package com.sidms.backend.repository;

import com.sidms.backend.entity.ArcgisSensorReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ArcgisSensorReadingRepository extends JpaRepository<ArcgisSensorReading, UUID> {

    /**
     * Latest reading per (location_name, hazard_type) pair.
     * Ported from DM's DisasterDataRepository.findLatestData() — table renamed to arcgis_sensor_readings.
     */
    @Query(value = "SELECT DISTINCT ON (location_name, hazard_type) * " +
                   "FROM arcgis_sensor_readings " +
                   "ORDER BY location_name, hazard_type, observation_time DESC",
           nativeQuery = true)
    List<ArcgisSensorReading> findLatestReadings();

    List<ArcgisSensorReading> findByLocationNameAndHazardTypeAndObservationTimeAfterOrderByObservationTimeAsc(
            String locationName, String hazardType, LocalDateTime after);
}
