package com.sidms.backend.repository;

import com.sidms.backend.entity.WeatherNodeLiveCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WeatherNodeLiveCacheRepository extends JpaRepository<WeatherNodeLiveCache, UUID> {
    java.util.Optional<WeatherNodeLiveCache> findTopByOrderByFetchedAtDesc();
}
