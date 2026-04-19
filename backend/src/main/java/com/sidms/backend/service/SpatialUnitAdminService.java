package com.sidms.backend.service;

import com.sidms.backend.dto.admin.SpatialUnitDto;
import com.sidms.backend.dto.admin.SpatialUnitWeatherInsightDto;
import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.SpatialUnitWeatherNodeMapping;
import com.sidms.backend.entity.WeatherNode;
import com.sidms.backend.entity.WeatherNodeLiveCache;
import com.sidms.backend.entity.enums.SpatialType;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.repository.SpatialUnitWeatherNodeMappingRepository;
import com.sidms.backend.repository.WeatherNodeLiveCacheRepository;
import com.sidms.backend.repository.WeatherNodeRepository;
import com.sidms.backend.dto.admin.SpatialUnitWeatherNodeMappingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class SpatialUnitAdminService {

    private final SpatialUnitRepository spatialUnitRepository;
    private final SpatialUnitWeatherNodeMappingRepository mappingRepository;
    private final WeatherNodeRepository weatherNodeRepository;
    private final WeatherNodeLiveCacheRepository weatherNodeLiveCacheRepository;

    public SpatialUnitAdminService(SpatialUnitRepository spatialUnitRepository,
            SpatialUnitWeatherNodeMappingRepository mappingRepository,
            WeatherNodeRepository weatherNodeRepository,
            WeatherNodeLiveCacheRepository weatherNodeLiveCacheRepository) {
        this.spatialUnitRepository = spatialUnitRepository;
        this.mappingRepository = mappingRepository;
        this.weatherNodeRepository = weatherNodeRepository;
        this.weatherNodeLiveCacheRepository = weatherNodeLiveCacheRepository;
    }

    public Page<SpatialUnitDto> getAllSpatialUnits(Pageable pageable, String search, SpatialType type,
            Boolean isActive, Boolean isTracked) {
        Specification<SpatialUnit> spec = Specification.where(null);

        if (search != null && !search.isBlank()) {
            String normalized = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), normalized),
                    cb.like(cb.lower(root.get("nameSinhala")), normalized),
                    cb.like(cb.lower(root.get("nameTamil")), normalized),
                    cb.like(cb.lower(root.get("pcode")), normalized)));
        }

        if (type != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }
        if (isActive != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isActive"), isActive));
        }
        if (isTracked != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isTracked"), isTracked));
        }

        return spatialUnitRepository.findAll(spec, pageable).map(this::toDto);
    }

    public Page<SpatialUnitDto> getChildSpatialUnits(UUID parentId, Pageable pageable) {
        if (!spatialUnitRepository.existsById(parentId)) {
            throw new RuntimeException("Spatial Unit not found");
        }
        return spatialUnitRepository.findByParentId(parentId, pageable).map(this::toDto);
    }

    public SpatialUnitDto getSpatialUnitById(UUID id) {
        SpatialUnit entity = spatialUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spatial Unit not found"));
        return toDto(entity);
    }

    public SpatialUnitDto createSpatialUnit(SpatialUnitDto dto) {
        SpatialUnit entity = SpatialUnit.builder()
                .name(dto.getName())
                .nameSinhala(dto.getNameSinhala())
                .nameTamil(dto.getNameTamil())
                .pcode(dto.getPcode())
                .type(dto.getType())
                .lat(dto.getLat())
                .lng(dto.getLng())
                .parentId(dto.getParentId())
                .population(dto.getPopulation())
                .isTracked(dto.getIsTracked() != null ? dto.getIsTracked() : false)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return toDto(spatialUnitRepository.save(entity));
    }

    public SpatialUnitDto updateSpatialUnit(UUID id, SpatialUnitDto dto) {
        SpatialUnit entity = spatialUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spatial Unit not found"));

        entity.setName(dto.getName());
        entity.setNameSinhala(dto.getNameSinhala());
        entity.setNameTamil(dto.getNameTamil());
        entity.setPcode(dto.getPcode());
        entity.setType(dto.getType());
        entity.setLat(dto.getLat());
        entity.setLng(dto.getLng());
        entity.setParentId(dto.getParentId());
        entity.setPopulation(dto.getPopulation());
        entity.setIsTracked(dto.getIsTracked());
        entity.setIsActive(dto.getIsActive());
        entity.setUpdatedAt(LocalDateTime.now());

        return toDto(spatialUnitRepository.save(entity));
    }

    public void deleteSpatialUnit(UUID id) {
        if (!spatialUnitRepository.existsById(id)) {
            throw new RuntimeException("Spatial Unit not found");
        }
        spatialUnitRepository.deleteById(id);
    }

    private SpatialUnitDto toDto(SpatialUnit entity) {
        return SpatialUnitDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .nameSinhala(entity.getNameSinhala())
                .nameTamil(entity.getNameTamil())
                .pcode(entity.getPcode())
                .type(entity.getType())
                .lat(entity.getLat())
                .lng(entity.getLng())
                .parentId(entity.getParentId())
                .population(entity.getPopulation())
                .isTracked(entity.getIsTracked())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public List<SpatialUnitWeatherNodeMappingDto> getMappingsForSpatialUnit(UUID spatialUnitId, Integer limit) {
        if (!spatialUnitRepository.existsById(spatialUnitId)) {
            throw new RuntimeException("Spatial Unit not found");
        }

        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);
        if (limit != null && limit > 0 && mappings.size() > limit) {
            mappings = new ArrayList<>(mappings.subList(0, limit));
        }

        return mappings.stream().map(m -> {
            WeatherNode node = weatherNodeRepository.findById(m.getWeatherNodeId()).orElse(null);
            WeatherNodeLiveCache live = weatherNodeLiveCacheRepository.findById(m.getWeatherNodeId()).orElse(null);
            return SpatialUnitWeatherNodeMappingDto.builder()
                    .id(m.getId())
                    .spatialUnitId(m.getSpatialUnitId())
                    .weatherNodeId(m.getWeatherNodeId())
                    .weatherNodeCode(node != null ? node.getCode() : "UNKNOWN")
                    .weatherNodeLat(node != null ? node.getLat() : 0.0)
                    .weatherNodeLng(node != null ? node.getLng() : 0.0)
                    .rank(m.getRank())
                    .distanceKm(m.getDistanceKm())
                    .idwWeight(m.getIdwWeight())
                    .isPrimary(m.getIsPrimary())
                    .liveFetchedAt(live != null ? live.getFetchedAt() : null)
                    .liveTempC(live != null ? live.getTempC() : null)
                    .liveHumidityPct(live != null ? live.getHumidityPct() : null)
                    .livePrecipitationMm(live != null ? live.getPrecipitationMm() : null)
                    .createdAt(m.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    public SpatialUnitWeatherInsightDto getWeatherInsightForSpatialUnit(UUID spatialUnitId, Integer limit) {
        SpatialUnit spatialUnit = spatialUnitRepository.findById(spatialUnitId)
                .orElseThrow(() -> new RuntimeException("Spatial Unit not found"));

        List<SpatialUnitWeatherNodeMappingDto> nodes = getMappingsForSpatialUnit(spatialUnitId, limit);

        double weightedTemp = 0.0;
        double weightedHumidity = 0.0;
        double weightedPrecip = 0.0;
        double availableWeight = 0.0;
        double tempWeight = 0.0;
        double humidityWeight = 0.0;
        double precipWeight = 0.0;

        for (SpatialUnitWeatherNodeMappingDto node : nodes) {
            if (node.getIdwWeight() == null || node.getLiveFetchedAt() == null) {
                continue;
            }
            double w = node.getIdwWeight();
            availableWeight += w;
            if (node.getLiveTempC() != null) {
                weightedTemp += node.getLiveTempC() * w;
                tempWeight += w;
            }
            if (node.getLiveHumidityPct() != null) {
                weightedHumidity += node.getLiveHumidityPct() * w;
                humidityWeight += w;
            }
            if (node.getLivePrecipitationMm() != null) {
                weightedPrecip += node.getLivePrecipitationMm() * w;
                precipWeight += w;
            }
        }

        return SpatialUnitWeatherInsightDto.builder()
                .spatialUnitId(spatialUnit.getId())
                .spatialUnitName(spatialUnit.getName())
                .nearestNodeCount(nodes.size())
                .weightCoverage(availableWeight)
                .weightedTempC(tempWeight > 0 ? round3(weightedTemp / tempWeight) : null)
                .weightedHumidityPct(humidityWeight > 0 ? round3(weightedHumidity / humidityWeight) : null)
                .weightedPrecipitationMm(precipWeight > 0 ? round3(weightedPrecip / precipWeight) : null)
                .computedAt(LocalDateTime.now())
                .nearestNodes(nodes)
                .build();
    }

    private Double round3(Double value) {
        if (value == null) {
            return null;
        }
        return Math.round(value * 1000.0) / 1000.0;
    }
}
