package com.sidms.backend.service;

import com.sidms.backend.dto.content.FaqEntryDto;
import com.sidms.backend.dto.content.GuideArticleDto;
import com.sidms.backend.entity.FaqEntry;
import com.sidms.backend.entity.GuideArticle;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.repository.FaqEntryRepository;
import com.sidms.backend.repository.GuideArticleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ContentService {

    private final GuideArticleRepository guideArticleRepository;
    private final FaqEntryRepository faqEntryRepository;

    public ContentService(GuideArticleRepository guideArticleRepository,
                          FaqEntryRepository faqEntryRepository) {
        this.guideArticleRepository = guideArticleRepository;
        this.faqEntryRepository = faqEntryRepository;
    }

    // ── Guides ──────────────────────────────────────────────

    public List<GuideArticleDto> getGuides(String language) {
        String lang = language != null ? language : "en";
        return guideArticleRepository.findByIsPublishedTrueAndLanguage(lang).stream()
                .map(this::toGuideDto)
                .collect(Collectors.toList());
    }

    public GuideArticleDto getGuideBySlug(String slug) {
        GuideArticle article = guideArticleRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found: " + slug));
        return toGuideDto(article);
    }

    public GuideArticleDto createGuide(GuideArticleDto req, UUID adminId) {
        GuideArticle article = GuideArticle.builder()
                .title(req.getTitle())
                .slug(req.getSlug())
                .summary(req.getSummary())
                .content(req.getContent())
                .coverImageUrl(req.getCoverImageUrl())
                .readTimeMin(req.getReadTimeMin())
                .category(req.getCategory())
                .language("en")
                .isPublished(true)
                .version(1)
                .createdBy(adminId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        article = guideArticleRepository.save(article);
        return toGuideDto(article);
    }

    public GuideArticleDto updateGuide(UUID id, GuideArticleDto req) {
        GuideArticle article = guideArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Guide not found: " + id));

        if (req.getTitle() != null) article.setTitle(req.getTitle());
        if (req.getSlug() != null) article.setSlug(req.getSlug());
        if (req.getSummary() != null) article.setSummary(req.getSummary());
        if (req.getContent() != null) article.setContent(req.getContent());
        if (req.getCoverImageUrl() != null) article.setCoverImageUrl(req.getCoverImageUrl());
        if (req.getReadTimeMin() != null) article.setReadTimeMin(req.getReadTimeMin());
        if (req.getCategory() != null) article.setCategory(req.getCategory());
        article.setUpdatedAt(LocalDateTime.now());

        article = guideArticleRepository.save(article);
        return toGuideDto(article);
    }

    // ── FAQs ────────────────────────────────────────────────

    public List<FaqEntryDto> getFaqs(String language) {
        String lang = language != null ? language : "en";
        return faqEntryRepository.findByIsPublishedTrueAndLanguageOrderBySortOrderAsc(lang).stream()
                .map(this::toFaqDto)
                .collect(Collectors.toList());
    }

    public FaqEntryDto createFaq(FaqEntryDto req, UUID adminId) {
        FaqEntry entry = FaqEntry.builder()
                .question(req.getQuestion())
                .answer(req.getAnswer())
                .category(req.getCategory())
                .language("en")
                .sortOrder(0)
                .isPublished(true)
                .createdBy(adminId)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        entry = faqEntryRepository.save(entry);
        return toFaqDto(entry);
    }

    public FaqEntryDto updateFaq(UUID id, FaqEntryDto req) {
        FaqEntry entry = faqEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ not found: " + id));

        if (req.getQuestion() != null) entry.setQuestion(req.getQuestion());
        if (req.getAnswer() != null) entry.setAnswer(req.getAnswer());
        if (req.getCategory() != null) entry.setCategory(req.getCategory());
        entry.setUpdatedAt(LocalDateTime.now());

        entry = faqEntryRepository.save(entry);
        return toFaqDto(entry);
    }

    // ── Helpers ─────────────────────────────────────────────

    private GuideArticleDto toGuideDto(GuideArticle article) {
        return GuideArticleDto.builder()
                .id(article.getId())
                .title(article.getTitle())
                .slug(article.getSlug())
                .summary(article.getSummary())
                .content(article.getContent())
                .coverImageUrl(article.getCoverImageUrl())
                .readTimeMin(article.getReadTimeMin())
                .category(article.getCategory())
                .updatedAt(article.getUpdatedAt())
                .build();
    }

    private FaqEntryDto toFaqDto(FaqEntry entry) {
        return FaqEntryDto.builder()
                .id(entry.getId())
                .question(entry.getQuestion())
                .answer(entry.getAnswer())
                .category(entry.getCategory())
                .build();
    }
}
