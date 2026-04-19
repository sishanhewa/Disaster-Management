package com.sidms.backend.service;

import com.sidms.backend.entity.ErrorLog;
import com.sidms.backend.entity.SystemConfig;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.repository.ErrorLogRepository;
import com.sidms.backend.repository.SystemConfigRepository;
import com.sidms.backend.util.ApiCircuitBreaker;
import com.sidms.backend.util.ApiKeyManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SystemAdminService {

    private final SystemConfigRepository systemConfigRepository;
    private final ErrorLogRepository errorLogRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ApiCircuitBreaker circuitBreaker;
    private final ApiKeyManager apiKeyManager;

    public SystemAdminService(SystemConfigRepository systemConfigRepository,
                              ErrorLogRepository errorLogRepository,
                              RedisTemplate<String, Object> redisTemplate,
                              ApiCircuitBreaker circuitBreaker,
                              ApiKeyManager apiKeyManager) {
        this.systemConfigRepository = systemConfigRepository;
        this.errorLogRepository = errorLogRepository;
        this.redisTemplate = redisTemplate;
        this.circuitBreaker = circuitBreaker;
        this.apiKeyManager = apiKeyManager;
    }

    public String getSystemConfig(String key) {
        String cacheKey = "sysconfig:" + key;
        Object cachedValue = redisTemplate.opsForValue().get(cacheKey);
        if (cachedValue instanceof String) {
            return (String) cachedValue;
        }

        String dbValue = systemConfigRepository.findByKey(key)
                .map(SystemConfig::getValue)
                .orElse(null);

        if (dbValue != null) {
            redisTemplate.opsForValue().set(cacheKey, dbValue);
        }
        return dbValue;
    }

    @Transactional
    public SystemConfig setSystemConfig(String key, String value, String description, UUID adminId) {
        SystemConfig systemConfig = systemConfigRepository.findByKey(key)
                .orElse(SystemConfig.builder().key(key).build());

        systemConfig.setValue(value);
        if (description != null) {
            systemConfig.setDescription(description);
        }
        systemConfig.setUpdatedBy(adminId);
        systemConfig.setUpdatedAt(LocalDateTime.now());

        systemConfigRepository.save(systemConfig);
        
        String cacheKey = "sysconfig:" + key;
        redisTemplate.opsForValue().set(cacheKey, value);

        return systemConfig;
    }

    public List<SystemConfig> getAllConfigs() {
        return systemConfigRepository.findAll();
    }

    public List<ErrorLog> getRecentErrors(Integer limit) {
        int maxResults = limit != null && limit > 0 ? limit : 50;
        return errorLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, maxResults));
    }

    @Transactional
    public ErrorLog resolveError(UUID errorId, UUID adminId) {
        ErrorLog errorLog = errorLogRepository.findById(errorId)
                .orElseThrow(() -> new ResourceNotFoundException("Error log not found: " + errorId));

        errorLog.setIsResolved(true);
        errorLog.setResolvedBy(adminId);
        
        return errorLogRepository.save(errorLog);
    }

    public java.util.Map<String, Object> getCircuitBreakerStats() {
        return circuitBreaker.getAllStats();
    }

    public java.util.Map<String, Object> getApiKeyStats() {
        return apiKeyManager.getStats();
    }

    public java.util.Map<String, Object> getFallbackStats() {
        // Find last fallback error in logs
        return errorLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, 1)).stream()
                .filter(e -> e.getMessage().contains("fallback"))
                .findFirst()
                .map(e -> java.util.Map.<String, Object>of(
                        "fallbackCount", errorLogRepository.count(), // Approximate
                        "lastFallbackAt", e.getCreatedAt().toString(),
                        "lastMessage", e.getMessage()
                ))
                .orElse(java.util.Map.<String, Object>of("fallbackCount", 0L, "lastFallbackAt", "N/A"));
    }

    public void resetCircuitBreaker(String serviceName) {
        circuitBreaker.getBreaker(serviceName).reset();
    }
}
