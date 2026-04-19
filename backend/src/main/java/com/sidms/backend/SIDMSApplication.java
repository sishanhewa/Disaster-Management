package com.sidms.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
@EnableScheduling
@EnableAsync
@EnableRetry
public class SIDMSApplication {

    public static void main(String[] args) {
        bootstrapEnv();
        SpringApplication.run(SIDMSApplication.class, args);
    }

    /**
     * Minimal zero-dependency .env loader for local development.
     * Looks for .env in the current directory or one level up.
     */
    private static void bootstrapEnv() {
        Path envPath = Paths.get(".env");
        if (!Files.exists(envPath)) {
            envPath = Paths.get("..", ".env");
        }

        if (Files.exists(envPath)) {
            try {
                List<String> lines = Files.readAllLines(envPath);
                for (String line : lines) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) continue;

                    int sep = line.indexOf('=');
                    if (sep > 0) {
                        String key = line.substring(0, sep).trim();
                        String value = line.substring(sep + 1).trim();
                        // Remove surrounding quotes if any
                        if (value.startsWith("\"") && value.endsWith("\"") ||
                            value.startsWith("'") && value.endsWith("'")) {
                            value = value.substring(1, value.length() - 1);
                        }
                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, value);
                        }
                    }
                }
                System.out.println(">>> Loaded environment from: " + envPath.toAbsolutePath());

                // Lazy start logic based on APP_SYNC_LAZY_START toggle
                String lazyStart = System.getProperty("APP_SYNC_LAZY_START");
                if ("true".equalsIgnoreCase(lazyStart)) {
                    System.out.println(">>> Lazy-start ENABLED: Background syncs will be delayed by their respective intervals.");
                    // Forcefully override these properties to ensure lazy-start works
                    System.setProperty("APP_SYNC_WEATHER_INITIAL_DELAY", "1800000"); // 30m
                    System.setProperty("APP_SYNC_FLOOD_INITIAL_DELAY", "900000");   // 15m
                    System.setProperty("APP_SYNC_METEO_INITIAL_DELAY", "1200000");  // 20m (slightly different offset)
                    System.setProperty("APP_SYNC_ALERTS_INITIAL_DELAY", "900000");  // 15m
                    System.setProperty("APP_SYNC_WARMING_INITIAL_DELAY", "1500000"); // 25m
                    System.setProperty("APP_SYNC_CACHE_EVICT_INITIAL_DELAY", "1805000"); // 30m + 5s
                } else {
                    System.out.println(">>> Lazy-start DISABLED: Background syncs will start normally.");
                }
            } catch (IOException e) {
                System.err.println(">>> Failed to load .env file: " + e.getMessage());
            }
        } else {
            System.out.println(">>> No .env file found at " + envPath.toAbsolutePath() + " - relying on system environment.");
        }
    }

    private static void setPropertyIfUnset(String key, String value) {
        if (System.getProperty(key) == null && System.getenv(key) == null) {
            System.setProperty(key, value);
        }
    }
}
