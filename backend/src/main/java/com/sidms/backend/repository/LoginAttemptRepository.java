package com.sidms.backend.repository;

import com.sidms.backend.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, UUID> {
    long countByUserIdAndSuccessFalseAndCreatedAtAfter(UUID userId, LocalDateTime since);
    Optional<LoginAttempt> findTop1ByUserIdAndSuccessTrueOrderByCreatedAtDesc(UUID userId);
}
