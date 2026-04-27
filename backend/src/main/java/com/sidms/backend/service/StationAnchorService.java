package com.sidms.backend.service;

import com.sidms.backend.entity.GnStationAnchor;
import com.sidms.backend.entity.GnStationAnchorId;
import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.StationMetadata;
import com.sidms.backend.entity.enums.SpatialType;
import com.sidms.backend.repository.GnStationAnchorRepository;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.repository.StationMetadataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class StationAnchorService {

    private final GnStationAnchorRepository gnStationAnchorRepository;
    private final SpatialUnitRepository     spatialUnitRepository;
    private final StationMetadataRepository stationMetadataRepository;

    private static final double ANCHOR_THRESHOLD_KM = 3.0; // Served directly if within 3km

    @Transactional
    public void populateAnchors() {
        log.info("Starting population of gn_station_anchors (threshold={}km)...", ANCHOR_THRESHOLD_KM);
        
        // Clear existing
        gnStationAnchorRepository.deleteAll();
        
        List<SpatialUnit> gnDivisions = spatialUnitRepository.findByType(SpatialType.GN_DIVISION);
        List<StationMetadata> stations = stationMetadataRepository.findAll();
        
        List<GnStationAnchor> anchors = new ArrayList<>();
        
        for (SpatialUnit gn : gnDivisions) {
            if (gn.getLat() == null || gn.getLng() == null) continue;
            
            StationMetadata nearest = null;
            double minDist = Double.MAX_VALUE;
            
            for (StationMetadata station : stations) {
                if (station.getLatitude() == null || station.getLongitude() == null) continue;
                
                double dist = haversineKm(
                        gn.getLat(), gn.getLng(),
                        station.getLatitude().doubleValue(), station.getLongitude().doubleValue()
                );
                
                if (dist < minDist) {
                    minDist = dist;
                    nearest = station;
                }
            }
            
            if (nearest != null && minDist <= ANCHOR_THRESHOLD_KM) {
                GnStationAnchor anchor = new GnStationAnchor();
                anchor.setId(new GnStationAnchorId(gn.getId(), nearest.getStationId()));
                anchor.setDistanceKm(BigDecimal.valueOf(minDist));
                anchors.add(anchor);
            }
        }
        
        gnStationAnchorRepository.saveAll(anchors);
        log.info("Populated {} station anchors.", anchors.size());
    }

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 6371.0 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
