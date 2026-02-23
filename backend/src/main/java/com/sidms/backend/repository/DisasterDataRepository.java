package com.sidms.backend.repository;

import com.sidms.backend.model.DisasterData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface DisasterDataRepository extends JpaRepository<DisasterData, UUID> {

    @Query(value = "SELECT DISTINCT ON (location_name, hazard_type) * FROM disaster_data ORDER BY location_name, hazard_type, observation_time DESC", nativeQuery = true)
    List<DisasterData> findLatestData();

    List<DisasterData> findByLocationNameAndHazardTypeAndObservationTimeAfterOrderByObservationTimeAsc(
            String locationName, String hazardType, LocalDateTime after);
}
