package com.sidms.backend.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/**
 * Circuit breaker per external service.
 * States: CLOSED (healthy) → OPEN (failing, reject calls) → HALF_OPEN (probe) → CLOSED.
 */
@Slf4j
@Component
public class ApiCircuitBreaker {

    private final Map<String, CircuitBreaker> breakers = new ConcurrentHashMap<>();

    public <T> T execute(String serviceName, Supplier<T> fn) {
        return getBreaker(serviceName).execute(fn);
    }

    public CircuitBreaker getBreaker(String serviceName) {
        return breakers.computeIfAbsent(serviceName, k -> {
            log.info("[CircuitBreaker] Created breaker for {}", k);
            return new CircuitBreaker(k);
        });
    }

    public Map<String, Object> getAllStats() {
        Map<String, Object> stats = new ConcurrentHashMap<>();
        breakers.forEach((name, cb) -> stats.put(name, cb.getStats()));
        return stats;
    }

    // ─── Inner CircuitBreaker ────────────────────────────────

    public enum State { CLOSED, OPEN, HALF_OPEN }

    @Slf4j
    public static class CircuitBreaker {
        private final String serviceName;
        private final int failureThreshold;
        private final long resetTimeoutMs;
        private final int halfOpenMaxAttempts;

        private volatile State state = State.CLOSED;
        private int failureCount = 0;
        private int halfOpenSuccessCount = 0;
        private long nextAttemptTime = 0;

        // Stats
        private long totalRequests = 0;
        private long successfulRequests = 0;
        private long failedRequests = 0;
        private long rejectedRequests = 0;

        public CircuitBreaker(String serviceName) {
            this(serviceName, 5, 60_000, 3);
        }

        public CircuitBreaker(String serviceName, int failureThreshold, long resetTimeoutMs, int halfOpenMaxAttempts) {
            this.serviceName = serviceName;
            this.failureThreshold = failureThreshold;
            this.resetTimeoutMs = resetTimeoutMs;
            this.halfOpenMaxAttempts = halfOpenMaxAttempts;
        }

        public synchronized <T> T execute(Supplier<T> fn) {
            totalRequests++;
            updateState();

            if (state == State.OPEN) {
                rejectedRequests++;
                throw new CircuitBreakerOpenException(
                        "Circuit breaker OPEN for " + serviceName + ". Service unavailable.");
            }

            try {
                T result = fn.get();
                onSuccess();
                successfulRequests++;
                return result;
            } catch (Exception e) {
                onFailure();
                failedRequests++;
                throw e;
            }
        }

        private void onSuccess() {
            failureCount = 0;
            if (state == State.HALF_OPEN) {
                halfOpenSuccessCount++;
                if (halfOpenSuccessCount >= halfOpenMaxAttempts) {
                    transitionTo(State.CLOSED);
                    halfOpenSuccessCount = 0;
                }
            }
        }

        private void onFailure() {
            failureCount++;
            if (state == State.HALF_OPEN) {
                transitionTo(State.OPEN);
                halfOpenSuccessCount = 0;
            } else if (state == State.CLOSED && failureCount >= failureThreshold) {
                transitionTo(State.OPEN);
            }
        }

        private void updateState() {
            if (state == State.OPEN && System.currentTimeMillis() >= nextAttemptTime) {
                transitionTo(State.HALF_OPEN);
                halfOpenSuccessCount = 0;
            }
        }

        private void transitionTo(State newState) {
            State old = this.state;
            this.state = newState;
            log.info("[CircuitBreaker] {}: {} → {} (failures: {})", serviceName, old, newState, failureCount);

            if (newState == State.OPEN) {
                nextAttemptTime = System.currentTimeMillis() + resetTimeoutMs;
            }
            if (newState == State.CLOSED) {
                failureCount = 0;
            }
        }

        public State getState() {
            updateState();
            return state;
        }

        public Map<String, Object> getStats() {
            return Map.of(
                    "service", serviceName,
                    "state", state.name(),
                    "failures", failureCount,
                    "totalRequests", totalRequests,
                    "successRate", totalRequests > 0
                            ? String.format("%.1f%%", (double) successfulRequests / totalRequests * 100)
                            : "N/A"
            );
        }

        public synchronized void reset() {
            transitionTo(State.CLOSED);
            failureCount = 0;
            halfOpenSuccessCount = 0;
        }
    }

    // ─── Exception ───────────────────────────────────────────

    public static class CircuitBreakerOpenException extends RuntimeException {
        public CircuitBreakerOpenException(String message) {
            super(message);
        }
    }
}
