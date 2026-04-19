package com.sidms.backend.repository;

import com.sidms.backend.entity.MetBulletin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MetBulletinRepository extends JpaRepository<MetBulletin, UUID> {
    List<MetBulletin> findAllByOrderByScrapedAtDesc();

    java.util.Optional<MetBulletin> findTopByOrderByScrapedAtDesc();
}
