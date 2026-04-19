package com.sidms.backend.repository;

import com.sidms.backend.entity.VolunteerTask;
import com.sidms.backend.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VolunteerTaskRepository extends JpaRepository<VolunteerTask, UUID> {
    List<VolunteerTask> findByStatus(TaskStatus status);
    List<VolunteerTask> findByAssignedVolunteer(UUID userId);
    List<VolunteerTask> findByAssignedResponder(UUID userId);
}
