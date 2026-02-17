package com.sidms.backend.util;

import java.time.Duration;

/**
 * Centralized cache key patterns and TTL values.
 * Matches the reference project's cache.js key structure.
 */
public final class CacheKeys {

    private CacheKeys() {
    }

    // ── TTL constants (match reference) ──────────────────────

    public static final Duration TTL_CURRENT_WEATHER = Duration.ofSeconds(600); // 10 min
    public static final Duration TTL_ENRICHED_WEATHER = Duration.ofSeconds(900); // 15 min
    public static final Duration TTL_FORECAST_SHORT = Duration.ofSeconds(10800); // 3 hr
    public static final Duration TTL_HISTORICAL = Duration.ofSeconds(43200); // 12 hr
    public static final Duration TTL_ANALYTICS_OVERVIEW = Duration.ofSeconds(7200); // 2 hr
    public static final Duration TTL_DISASTER_WARNINGS = Duration.ofSeconds(300); // 5 min
    public static final Duration TTL_AI_PREDICTION = Duration.ofSeconds(7200); // 2 hr
    public static final Duration TTL_CITY_SEARCH = Duration.ofSeconds(3600); // 60 min
    public static final Duration TTL_NATIVE_FORECAST = Duration.ofSeconds(10800); // 3 hr

    // Flood
    public static final Duration TTL_FLOOD_DASHBOARD = Duration.ofSeconds(300); // 5 min
    public static final Duration TTL_RIVERNET_CONFIG = Duration.ofSeconds(86400); // 24 hr
    public static final Duration TTL_RIVERNET_STATUS = Duration.ofSeconds(300); // 5 min
    public static final Duration TTL_ARCGIS_STATIONS = Duration.ofSeconds(86400); // 24 hr
    public static final Duration TTL_ARCGIS_GAUGES = Duration.ofSeconds(300); // 5 min
    public static final Duration TTL_ARCGIS_GEOJSON = Duration.ofSeconds(3600); // 1 hr

    // MeteoSL
    public static final Duration TTL_METEO_CONTENT = Duration.ofSeconds(900); // 15 min
    public static final Duration TTL_METEO_EXCEL = Duration.ofSeconds(10800); // 3 hr

    // Public
    public static final Duration TTL_PUBLIC_MAP = Duration.ofSeconds(300); // 5 min
    public static final Duration TTL_ANNOUNCEMENTS = Duration.ofSeconds(600); // 10 min
    public static final Duration TTL_ALL_DISTRICTS = Duration.ofSeconds(3600); // 60 min

    // ── Key patterns ─────────────────────────────────────────

    // Weather
    public static String weatherSpatial(String spatialUnitId) {
        return "weather:spatial:" + spatialUnitId;
    }

    public static String weatherCurrent(double lat, double lng) {
        return "weather:current:" + lat + ":" + lng;
    }

    public static String weatherEnriched(double lat, double lng) {
        return "weather:enriched:" + lat + ":" + lng;
    }

    public static String weatherForecast(double lat, double lng) {
        return "weather:forecast:" + lat + ":" + lng;
    }

    public static String weatherForecastSpatial(String spatialUnitId) {
        return "weather:forecast:spatial:" + spatialUnitId;
    }

    public static String weatherHistorical(double lat, double lng, String startDate, String endDate) {
        return "weather:historical:" + lat + ":" + lng + ":" + startDate + ":" + endDate;
    }

    // Search
    public static String searchLocations(String query) {
        return "search:locations:" + query.toLowerCase().trim();
    }

    // Analytics
    public static String analyticsOverview(String spatialUnitId) {
        return "analytics:overview:" + spatialUnitId;
    }

    public static String analyticsForecast(String spatialUnitId, String metricsKey, int horizon) {
        return "analytics:forecast:" + spatialUnitId + ":" + metricsKey + ":" + horizon;
    }

    public static String analyticsZScore(String spatialUnitId, String metric, int days) {
        return "analytics:zscore:" + spatialUnitId + ":" + metric + ":" + days;
    }

    // Disaster
    public static String disasterActiveWarnings() {
        return "disaster:warnings:active";
    }

    // Flood
    public static String floodDashboard() {
        return "flood:dashboard:combined";
    }

    // ArcGIS
    public static String arcgisStations() {
        return "arcgis:stations";
    }

    public static String arcgisLatestGauges() {
        return "arcgis:gauges:latest";
    }

    public static String arcgisAlertSummary() {
        return "arcgis:alert:summary";
    }

    public static String arcgisRainfallTop(int limit) {
        return "arcgis:rainfall:top:" + limit;
    }

    public static String arcgisGaugeHistory(String name) {
        return "arcgis:gauge:history:" + name;
    }

    public static String arcgisGeojson(String layer) {
        return "arcgis:geojson:" + layer;
    }

    // Rivernet
    public static String rivernetRegionDevices() {
        return "rivernet:config:region-devices";
    }

    public static String rivernetLatestStatus(String deviceType, String keys) {
        return "rivernet:status:" + deviceType + ":" + keys;
    }

    public static String rivernetChart(String deviceKey, long start, long end) {
        return "rivernet:chart:" + deviceKey + ":" + start + ":" + end;
    }

    // MeteoSL
    public static String meteoContent() {
        return "meteo:content";
    }

    public static String meteoForecast() {
        return "meteo:forecast";
    }

    public static String meteoMarine() {
        return "meteo:marine";
    }

    public static String meteoFleet() {
        return "meteo:fleet";
    }

    public static String meteoAdvisories() {
        return "meteo:advisories";
    }

    public static String meteoGraphics() {
        return "meteo:graphics";
    }

    public static String meteoThreeHourly() {
        return "meteo:3hourly";
    }

    // Public
    public static String publicMapData() {
        return "public:map:live";
    }

    public static String publicAnnouncements() {
        return "public:announcements";
    }

    public static String allDistricts() {
        return "spatial:districts:all";
    }

    // AI
    public static String aiPrediction(String spatialUnitId, String metricsKey, int horizon) {
        return "ai:prediction:" + spatialUnitId + ":" + metricsKey + ":" + horizon;
    }
}
