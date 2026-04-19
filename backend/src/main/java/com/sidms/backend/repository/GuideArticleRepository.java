package com.sidms.backend.repository;

import com.sidms.backend.entity.GuideArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GuideArticleRepository extends JpaRepository<GuideArticle, UUID> {
    List<GuideArticle> findByIsPublishedTrueAndLanguage(String language);
    Optional<GuideArticle> findBySlug(String slug);
}
