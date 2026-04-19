package com.sidms.backend.repository;

import com.sidms.backend.entity.WeatherNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WeatherNodeRepository extends JpaRepository<WeatherNode, UUID>, JpaSpecificationExecutor<WeatherNode> {
    List<WeatherNode> findByIsActiveTrue();

    List<WeatherNode> findByIsVolatileTrue();

    Optional<WeatherNode> findByGridKey(String gridKey);
}
