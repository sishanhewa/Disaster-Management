package com.sidms.backend.client;

import com.sidms.backend.util.ApiKeyManager;
import com.sidms.backend.util.ApiCircuitBreaker;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import java.net.URI;

/**
 * Client for OpenWeatherMap API (volatile nodes).
 * Routes through CircuitBreaker and ApiKeyManager.
 */
@Component
@Slf4j
public class OpenWeatherMapClient {

    private static final String SERVICE = "OPENWEATHER";
    private static final String BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    private final RestTemplate restTemplate;
    private final ApiKeyManager apiKeyManager;
    private final ApiCircuitBreaker circuitBreaker;
    private final ObjectMapper objectMapper;

    public OpenWeatherMapClient(RestTemplate restTemplate, ApiKeyManager apiKeyManager,
                                ApiCircuitBreaker circuitBreaker, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.apiKeyManager = apiKeyManager;
        this.circuitBreaker = circuitBreaker;
        this.objectMapper = objectMapper;
    }

    /**
     * Fetch current weather for given coordinates.
     */
    public JsonNode getCurrentWeather(double lat, double lng) {
        return circuitBreaker.execute(SERVICE, () -> {
            int maxRetries = 2;
            long delay = 500;

            for (int attempt = 0; ; attempt++) {
                String key = null;
                try {
                    key = apiKeyManager.getNextKey(SERVICE);
                    if (key == null) {
                        throw new RuntimeException("No OpenWeatherMap API key available");
                    }

                    String url = BASE_URL + "?lat=" + lat + "&lon=" + lng + "&units=metric&appid=" + key;
                    String response = restTemplate.getForObject(URI.create(url), String.class);
                    return objectMapper.readTree(response);
                } catch (HttpClientErrorException e) {
                    int status = e.getStatusCode().value();

                    if (apiKeyManager.isRateLimitError(status)) {
                        apiKeyManager.blockKey(SERVICE, key, 3_600_000L); // block for 1 hour
                    }

                    boolean retriable = status == 429 || status >= 500;
                    if (attempt >= maxRetries || !retriable) {
                        throw e;
                    }

                    sleep(delay);
                    delay *= 2;
                } catch (Exception e) {
                    if (attempt >= maxRetries) throw new RuntimeException(e);
                    sleep(delay);
                    delay *= 2;
                }
            }
        });
    }

    private void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }
    }
}
