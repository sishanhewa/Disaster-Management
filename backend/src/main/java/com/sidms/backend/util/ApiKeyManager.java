package com.sidms.backend.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Round-robin API key manager with temporary blocking on rate-limit errors.
 * Supports multiple key pools per service (OPENMETEO, ARCGIS, RIVERNET, OPENWEATHER).
 */
@Component
@Slf4j
public class ApiKeyManager {

    private final Map<String, List<String>> keyPools = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> currentIndexes = new ConcurrentHashMap<>();
    private final Map<String, Long> blockedKeys = new ConcurrentHashMap<>(); // "SERVICE:key" -> expiryEpochMs

    /**
     * Load keys for a service. Typically called from ApiKeyConfig init.
     */
    public void registerKeys(String serviceName, List<String> keys) {
        if (keys == null || keys.isEmpty()) {
            log.debug("[ApiKeyManager] No keys registered for {}", serviceName);
            return;
        }
        List<String> cleaned = keys.stream()
                .map(String::trim)
                .filter(k -> !k.isEmpty())
                .toList();
        if (!cleaned.isEmpty()) {
            keyPools.put(serviceName, cleaned);
            currentIndexes.put(serviceName, new AtomicInteger(0));
            log.info("[ApiKeyManager] Registered {} key(s) for {}", cleaned.size(), serviceName);
        }
    }

    /**
     * Get the next available (non-blocked) key for a service.
     * Returns null if no keys configured or all are blocked.
     */
    public String getNextKey(String serviceName) {
        List<String> keys = keyPools.get(serviceName);
        if (keys == null || keys.isEmpty()) {
            return null;
        }

        if (keys.size() == 1) {
            String key = keys.get(0);
            return isKeyBlocked(serviceName, key) ? null : key;
        }

        AtomicInteger indexHolder = currentIndexes.get(serviceName);
        int startIndex = indexHolder.get();

        for (int attempts = 0; attempts < keys.size(); attempts++) {
            int idx = indexHolder.getAndUpdate(i -> (i + 1) % keys.size());
            String key = keys.get(idx % keys.size());
            if (!isKeyBlocked(serviceName, key)) {
                return key;
            }
        }

        log.error("[ApiKeyManager] All keys for {} are blocked", serviceName);
        return null;
    }

    /**
     * Temporarily block a key after a rate-limit (429) response.
     */
    public void blockKey(String serviceName, String key, long durationMs) {
        String blockKey = serviceName + ":" + key;
        long expiryTime = System.currentTimeMillis() + durationMs;
        blockedKeys.put(blockKey, expiryTime);
        log.warn("[ApiKeyManager] Blocked key for {} until {} ({}ms cooldown)",
                serviceName, new Date(expiryTime), durationMs);
    }

    public boolean isKeyBlocked(String serviceName, String key) {
        String blockKey = serviceName + ":" + key;
        Long expiryTime = blockedKeys.get(blockKey);
        if (expiryTime == null) return false;

        if (System.currentTimeMillis() >= expiryTime) {
            blockedKeys.remove(blockKey);
            log.info("[ApiKeyManager] Unblocked key for {} (cooldown expired)", serviceName);
            return false;
        }
        return true;
    }

    /**
     * Check if an HTTP error is a rate-limit response.
     */
    public boolean isRateLimitError(int statusCode) {
        return statusCode == 429;
    }

    /**
     * Parse Retry-After header to get block duration in milliseconds.
     * Falls back to 1 hour if not parseable.
     */
    public long parseRetryAfter(String retryAfterHeader) {
        if (retryAfterHeader == null || retryAfterHeader.isBlank()) {
            return 3_600_000L; // 1 hour default
        }
        try {
            int seconds = Integer.parseInt(retryAfterHeader.trim());
            return seconds * 1000L;
        } catch (NumberFormatException e) {
            return 3_600_000L;
        }
    }

    public boolean hasKeys(String serviceName) {
        List<String> keys = keyPools.get(serviceName);
        return keys != null && !keys.isEmpty();
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        for (Map.Entry<String, List<String>> entry : keyPools.entrySet()) {
            String service = entry.getKey();
            List<String> keys = entry.getValue();
            long blocked = keys.stream().filter(k -> isKeyBlocked(service, k)).count();
            Map<String, Object> s = new LinkedHashMap<>();
            s.put("total", keys.size());
            s.put("available", keys.size() - blocked);
            s.put("blocked", blocked);
            stats.put(service, s);
        }
        return stats;
    }
}
