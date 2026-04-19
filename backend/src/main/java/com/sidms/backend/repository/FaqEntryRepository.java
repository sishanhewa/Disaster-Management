package com.sidms.backend.repository;

import com.sidms.backend.entity.FaqEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FaqEntryRepository extends JpaRepository<FaqEntry, UUID> {
    List<FaqEntry> findByIsPublishedTrueAndLanguageOrderBySortOrderAsc(String language);
}
