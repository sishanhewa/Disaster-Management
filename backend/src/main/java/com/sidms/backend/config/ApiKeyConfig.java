package com.sidms.backend.config;

import com.sidms.backend.util.ApiKeyManager;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "api")
@Data
public class ApiKeyConfig {

    private String openMeteoBaseUrl = "https://api.open-meteo.com/v1";

    private List<String> openWeatherMapKeys;
    private List<String> openMeteoKeys;
    private List<String> arcgisKeys;
    private List<String> rivernetKeys;

    private String arcgisBaseUrl = "https://services3.arcgis.com/J7ZFXmR8rSmQ3FGf/arcgis/rest/services";
    private String rivernetBaseUrl = "https://api.rivernet.lk/cache-api.php";
    private String meteoSlBaseUrl = "https://meteo.gov.lk";

    private int openMeteoCallsPerMinute = 600;
    private int batchSize = 50;

    private final ApiKeyManager apiKeyManager;

    public ApiKeyConfig(ApiKeyManager apiKeyManager) {
        this.apiKeyManager = apiKeyManager;
    }

    @PostConstruct
    public void initializeKeyPools() {
        apiKeyManager.registerKeys("OPENMETEO", openMeteoKeys);
        apiKeyManager.registerKeys("OPENWEATHER", openWeatherMapKeys);
        apiKeyManager.registerKeys("ARCGIS", arcgisKeys);
        apiKeyManager.registerKeys("RIVERNET", rivernetKeys);
    }
}

