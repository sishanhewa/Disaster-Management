package com.sidms.backend.dto.weather.advanced;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class CelestialEventsResponse {
    private List<CelestialDay> days;
    private Map<String, Map<String, String>> _links;

    @Data
    @Builder
    public static class CelestialDay {
        private String date;
        private Map<String, List<Map<String, Object>>> sun;
        private Map<String, Object> moon;
    }
}
