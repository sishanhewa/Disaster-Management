package com.sidms.backend.service;

import com.sidms.backend.dto.emergency.*;
import com.sidms.backend.entity.*;
import com.sidms.backend.entity.enums.DisasterSeverity;
import com.sidms.backend.entity.enums.SosStatus;
import com.sidms.backend.entity.enums.TaskStatus;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.exception.ValidationException;
import com.sidms.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmergencyService {

        private final SosIncidentRepository sosIncidentRepository;
        private final SosTimelineRepository sosTimelineRepository;
        private final SosEventRepository sosEventRepository;
        private final VolunteerTaskRepository volunteerTaskRepository;
        private final UserRepository userRepository;
        private final EmergencyResourceRepository emergencyResourceRepository;
        private final SpatialUnitRepository spatialUnitRepository;
        private final WeatherService weatherService;

        public EmergencyService(SosIncidentRepository sosIncidentRepository,
                        SosTimelineRepository sosTimelineRepository,
                        SosEventRepository sosEventRepository,
                        VolunteerTaskRepository volunteerTaskRepository,
                        UserRepository userRepository,
                        EmergencyResourceRepository emergencyResourceRepository,
                        SpatialUnitRepository spatialUnitRepository,
                        WeatherService weatherService) {
                this.sosIncidentRepository = sosIncidentRepository;
                this.sosTimelineRepository = sosTimelineRepository;
                this.sosEventRepository = sosEventRepository;
                this.volunteerTaskRepository = volunteerTaskRepository;
                this.userRepository = userRepository;
                this.emergencyResourceRepository = emergencyResourceRepository;
                this.spatialUnitRepository = spatialUnitRepository;
                this.weatherService = weatherService;
        }

        // ── Emergency Resources ─────────────────────────────────

        public List<EmergencyResource> listResources(String district, String type, Boolean active) {
                return emergencyResourceRepository.findAllByOrderByCreatedAtDesc().stream()
                                .filter(r -> district == null || district.equals(r.getDistrict()))
                                .filter(r -> type == null || type.equals(r.getResourceType()))
                                .filter(r -> active == null || active.equals(r.getIsActive()))
                                .collect(Collectors.toList());
        }

        @Transactional
        public EmergencyResource createResource(EmergencyResource req) {
                req.setCreatedAt(LocalDateTime.now());
                req.setUpdatedAt(LocalDateTime.now());
                if (req.getIsActive() == null)
                        req.setIsActive(true);
                return emergencyResourceRepository.save(req);
        }

        @Transactional
        public EmergencyResource updateResource(UUID id, EmergencyResource req) {
                EmergencyResource resource = emergencyResourceRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
                if (req.getDistrict() != null)
                        resource.setDistrict(req.getDistrict());
                if (req.getSpatialUnitId() != null)
                        resource.setSpatialUnitId(req.getSpatialUnitId());
                if (req.getResourceType() != null)
                        resource.setResourceType(req.getResourceType());
                if (req.getName() != null)
                        resource.setName(req.getName());
                if (req.getAddress() != null)
                        resource.setAddress(req.getAddress());
                if (req.getPhone() != null)
                        resource.setPhone(req.getPhone());
                if (req.getLat() != null)
                        resource.setLat(req.getLat());
                if (req.getLng() != null)
                        resource.setLng(req.getLng());
                if (req.getIsActive() != null)
                        resource.setIsActive(req.getIsActive());
                if (req.getNotes() != null)
                        resource.setNotes(req.getNotes());
                resource.setUpdatedAt(LocalDateTime.now());
                return emergencyResourceRepository.save(resource);
        }

        @Transactional
        public void deleteResource(UUID id) {
                EmergencyResource resource = emergencyResourceRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
                emergencyResourceRepository.delete(resource);
        }

        // ── SOS Incidents ───────────────────────────────────────

        @Transactional
        public SosResponse createSos(CreateSosRequest req, UUID userId) {
                if (req == null) {
                        throw new ValidationException("SOS request is required");
                }
                if (req.getLat() == null || req.getLng() == null) {
                        throw new ValidationException("Location (lat/lng) is required for SOS");
                }
                String medicalNotes = req.getMedicalNotes() != null ? req.getMedicalNotes().trim() : "";
                if (medicalNotes.isBlank()) {
                        throw new ValidationException("medicalNotes is required to describe the emergency");
                }
                if (medicalNotes.length() < 10 || medicalNotes.length() > 2000) {
                        throw new ValidationException("medicalNotes must be between 10 and 2000 characters");
                }

                // Save incident
                SosIncident incident = SosIncident.builder()
                                .userId(userId)
                                .lat(req.getLat())
                                .lng(req.getLng())
                                .batteryLevel(req.getBatteryLevel())
                                .medicalNotes(medicalNotes)
                                .contactPhone(req.getContactPhone())
                                .status(SosStatus.PENDING)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();

                incident = sosIncidentRepository.save(incident);

                // Save timeline entry
                sosTimelineRepository.save(SosTimeline.builder()
                                .incidentId(incident.getId())
                                .action("SOS_CREATED")
                                .actorId(userId)
                                .notes("SOS alert created")
                                .createdAt(LocalDateTime.now())
                                .build());

                // Create SosEvent for event-driven notification system
                createSosEventForIncident(incident, req);

                return toSosResponse(incident);
        }

        public List<SosResponse> getMySosIncidents(UUID userId) {
                return sosIncidentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                                .map(this::toSosResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public SosResponse updateSosStatus(UUID incidentId, String newStatus, UUID actorId) {
                SosIncident incident = sosIncidentRepository.findById(incidentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "SOS incident not found: " + incidentId));

                SosStatus status = SosStatus.valueOf(newStatus);
                incident.setStatus(status);
                incident.setUpdatedAt(LocalDateTime.now());

                if (status == SosStatus.RESOLVED) {
                        incident.setResolvedAt(LocalDateTime.now());
                }
                if (status == SosStatus.ASSIGNED || status == SosStatus.EN_ROUTE) {
                        incident.setAssignedTo(actorId);
                }

                sosIncidentRepository.save(incident);

                // Timeline entry
                String actorName = userRepository.findById(actorId)
                                .map(User::getDisplayName)
                                .orElse("Unknown");

                sosTimelineRepository.save(SosTimeline.builder()
                                .incidentId(incidentId)
                                .action("STATUS_CHANGED_TO_" + newStatus)
                                .actorId(actorId)
                                .notes("Status updated to " + newStatus + " by " + actorName)
                                .createdAt(LocalDateTime.now())
                                .build());

                return toSosResponse(incident);
        }

        public List<SosResponse> getActiveSosIncidents() {
                return sosIncidentRepository.findByStatusNot(SosStatus.RESOLVED).stream()
                                .map(this::toSosResponse)
                                .collect(Collectors.toList());
        }

        // ── Volunteer Tasks ─────────────────────────────────────

        @Transactional
        public TaskResponse createTask(CreateTaskRequest req, UUID createdBy) {
                if (req.getTitle() == null || req.getTitle().isBlank()) {
                        throw new ValidationException("Task title is required");
                }

                VolunteerTask task = VolunteerTask.builder()
                                .title(req.getTitle())
                                .description(req.getDescription())
                                .lat(req.getLat())
                                .lng(req.getLng())
                                .radiusKm(req.getRadiusKm())
                                .status(TaskStatus.OPEN)
                                .priority(req.getPriority() != null ? req.getPriority() : "NORMAL")
                                .requiredAssetType(req.getRequiredAssetType())
                                .sosIncidentId(req.getSosIncidentId())
                                .createdBy(createdBy)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .build();

                task = volunteerTaskRepository.save(task);
                return toTaskResponse(task);
        }

        @Transactional(readOnly = true)
        public List<TaskResponse> getAvailableTasks() {
                return volunteerTaskRepository.findByStatus(TaskStatus.OPEN).stream()
                                .map(this::toTaskResponse)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<TaskResponse> getTasksForUser(UUID userId) {
                List<VolunteerTask> openTasks = volunteerTaskRepository.findByStatus(TaskStatus.OPEN);
                List<VolunteerTask> assignedToMe = volunteerTaskRepository.findByAssignedVolunteer(userId);
                List<VolunteerTask> assignedToMeResponder = volunteerTaskRepository.findByAssignedResponder(userId);

                return java.util.stream.Stream.of(openTasks, assignedToMe, assignedToMeResponder)
                                .flatMap(List::stream)
                                .distinct()
                                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                                .map(this::toTaskResponse)
                                .collect(Collectors.toList());
        }

        public List<VolunteerDto> listVolunteers() {
                return userRepository.findAll().stream()
                                .filter(User::getIsActive)
                                .filter(u -> u.getRoles() != null && u.getRoles().stream()
                                                .anyMatch(r -> "volunteer".equalsIgnoreCase(r.getName())))
                                .map(u -> VolunteerDto.builder()
                                                .id(u.getId())
                                                .displayName(u.getDisplayName())
                                                .email(u.getEmail())
                                                .phone(u.getPhone())
                                                .isActive(u.getIsActive())
                                                .build())
                                .collect(Collectors.toList());
        }

        @Transactional
        public TaskResponse acceptTask(UUID taskId, User user) {
                VolunteerTask task = volunteerTaskRepository.findById(taskId)
                                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));

                if (task.getStatus() != TaskStatus.OPEN && task.getStatus() != TaskStatus.ASSIGNED) {
                        throw new ValidationException("Task is not available for acceptance");
                }

                boolean isResponder = false;
                boolean isVolunteer = false;

                if (user.getRoles() != null) {
                        isResponder = user.getRoles().stream()
                                        .anyMatch(r -> "responder".equalsIgnoreCase(r.getName()));
                        isVolunteer = user.getRoles().stream()
                                        .anyMatch(r -> "volunteer".equalsIgnoreCase(r.getName()));
                }

                if (isResponder) {
                        task.setAssignedResponder(user.getId());
                        task.setStatus(TaskStatus.EN_ROUTE);
                } else if (isVolunteer) {
                        task.setAssignedVolunteer(user.getId());
                        task.setStatus(TaskStatus.ASSIGNED);
                } else {
                        throw new ValidationException(
                                        "User lacks required 'volunteer' or 'responder' role to accept tasks");
                }

                task.setAcceptedAt(LocalDateTime.now());
                task.setUpdatedAt(LocalDateTime.now());
                volunteerTaskRepository.save(task);

                return toTaskResponse(task);
        }

        @Transactional
        public TaskResponse completeTask(UUID taskId, UUID userId) {
                VolunteerTask task = volunteerTaskRepository.findById(taskId)
                                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + taskId));

                task.setStatus(TaskStatus.COMPLETED);
                task.setCompletedAt(LocalDateTime.now());
                task.setUpdatedAt(LocalDateTime.now());
                volunteerTaskRepository.save(task);

                return toTaskResponse(task);
        }

        @Transactional
        public TaskResponse updateTask(UUID id, CreateTaskRequest req) {
                VolunteerTask task = volunteerTaskRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                if (req.getTitle() != null)
                        task.setTitle(req.getTitle());
                if (req.getDescription() != null)
                        task.setDescription(req.getDescription());
                if (req.getLat() != null)
                        task.setLat(req.getLat());
                if (req.getLng() != null)
                        task.setLng(req.getLng());
                if (req.getRadiusKm() != null)
                        task.setRadiusKm(req.getRadiusKm());
                if (req.getPriority() != null)
                        task.setPriority(req.getPriority());
                if (req.getRequiredAssetType() != null)
                        task.setRequiredAssetType(req.getRequiredAssetType());

                task.setUpdatedAt(LocalDateTime.now());
                volunteerTaskRepository.save(task);
                return toTaskResponse(task);
        }

        @Transactional
        public TaskResponse assignTask(UUID taskId, UUID volunteerId, UUID assignedBy) {
                VolunteerTask task = volunteerTaskRepository.findById(taskId)
                                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                task.setAssignedVolunteer(volunteerId);
                task.setAssignedResponder(assignedBy);
                task.setStatus(TaskStatus.ASSIGNED);
                task.setUpdatedAt(LocalDateTime.now());
                volunteerTaskRepository.save(task);
                return toTaskResponse(task);
        }

        @Transactional
        public void deleteTask(UUID taskId) {
                VolunteerTask task = volunteerTaskRepository.findById(taskId)
                                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                volunteerTaskRepository.delete(task);
        }

        public List<TaskResponse> getAllTasks() {
                return volunteerTaskRepository.findAll().stream()
                                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                                .map(this::toTaskResponse)
                                .collect(Collectors.toList());
        }

        @Transactional
        public SosResponse respondToSos(UUID incidentId, UUID responderId) {
                return updateSosStatus(incidentId, SosStatus.ASSIGNED.name(), responderId);
        }

        // ── Helpers ──────────────────────────────────────────────

        private SosResponse toSosResponse(SosIncident incident) {
                List<SosTimeline> timelineEntries = sosTimelineRepository
                                .findByIncidentIdOrderByCreatedAtAsc(incident.getId());

                List<SosTimelineDto> timeline = timelineEntries.stream()
                                .map(t -> {
                                        String actorName = t.getActorId() != null
                                                        ? userRepository.findById(t.getActorId())
                                                                        .map(User::getDisplayName).orElse("System")
                                                        : "System";
                                        return SosTimelineDto.builder()
                                                        .action(t.getAction())
                                                        .actorName(actorName)
                                                        .notes(t.getNotes())
                                                        .createdAt(t.getCreatedAt())
                                                        .build();
                                })
                                .collect(Collectors.toList());

                User user = userRepository.findById(incident.getUserId()).orElse(null);
                String assignedToName = incident.getAssignedTo() != null
                                ? userRepository.findById(incident.getAssignedTo()).map(User::getDisplayName)
                                                .orElse(null)
                                : null;

                return SosResponse.builder()
                                .id(incident.getId())
                                .userId(incident.getUserId())
                                .userDisplayName(user != null ? user.getDisplayName() : null)
                                .userPhone(user != null ? user.getPhone() : null)
                                .status(incident.getStatus().name())
                                .lat(incident.getLat())
                                .lng(incident.getLng())
                                .batteryLevel(incident.getBatteryLevel())
                                .medicalNotes(incident.getMedicalNotes())
                                .contactPhone(incident.getContactPhone())
                                .assignedTo(incident.getAssignedTo())
                                .assignedToName(assignedToName)
                                .createdAt(incident.getCreatedAt())
                                .resolvedAt(incident.getResolvedAt())
                                .timeline(timeline)
                                .build();
        }

        private TaskResponse toTaskResponse(VolunteerTask task) {
                String assignedVolunteerName = task.getAssignedVolunteer() != null
                                ? userRepository.findById(task.getAssignedVolunteer()).map(User::getDisplayName)
                                                .orElse(null)
                                : null;
                String assignedResponderName = task.getAssignedResponder() != null
                                ? userRepository.findById(task.getAssignedResponder()).map(User::getDisplayName)
                                                .orElse(null)
                                : null;

                return TaskResponse.builder()
                                .id(task.getId())
                                .title(task.getTitle())
                                .description(task.getDescription())
                                .status(task.getStatus().name())
                                .priority(task.getPriority())
                                .lat(task.getLat())
                                .lng(task.getLng())
                                .radiusKm(task.getRadiusKm())
                                .requiredAssetType(task.getRequiredAssetType())
                                .sosIncidentId(task.getSosIncidentId())
                                .assignedVolunteerId(task.getAssignedVolunteer())
                                .assignedResponderId(task.getAssignedResponder())
                                .assignedVolunteerName(assignedVolunteerName)
                                .assignedResponderName(assignedResponderName)
                                .createdBy(task.getCreatedBy())
                                .createdAt(task.getCreatedAt())
                                .acceptedAt(task.getAcceptedAt())
                                .completedAt(task.getCompletedAt())
                                .build();
        }

        // ── SOS Event Creation ──────────────────────────────────

        private void createSosEventForIncident(SosIncident incident, CreateSosRequest req) {
                try {
                        User user = userRepository.findById(incident.getUserId()).orElse(null);

                        // Get weather context for the SOS location
                        String weatherContext = getWeatherContextForLocation(incident.getLat(), incident.getLng());

                        // Build event title and description
                        String locationName = getLocationNameForCoordinates(incident.getLat(), incident.getLng());
                        String title = String.format("SOS EMERGENCY: %s in %s",
                                        incident.getStatus().name(),
                                        locationName != null ? locationName : "Unknown Location");

                        StringBuilder description = new StringBuilder();
                        description.append(String.format("Emergency SOS triggered by %s",
                                        user != null ? user.getDisplayName() : "Unknown User"));
                        if (user != null && user.getPhone() != null) {
                                description.append(String.format(" (Phone: %s)", user.getPhone()));
                        }
                        description.append(".\n\n");

                        if (incident.getMedicalNotes() != null && !incident.getMedicalNotes().isBlank()) {
                                description.append(String.format("Medical Notes: %s\n\n", incident.getMedicalNotes()));
                        }

                        description.append(String.format("Location: %s, %s\n",
                                        incident.getLat(), incident.getLng()));

                        if (weatherContext != null && !weatherContext.isBlank()) {
                                description.append(String.format("Weather Context: %s\n", weatherContext));
                        }

                        description.append(String.format("Battery Level: %.0f%%\n",
                                        incident.getBatteryLevel() != null ? incident.getBatteryLevel() : 100));

                        // Create SosEvent
                        SosEvent event = SosEvent.builder()
                                        .incidentId(incident.getId())
                                        .userId(incident.getUserId())
                                        .userName(user != null ? user.getDisplayName() : "Unknown")
                                        .userPhone(user != null ? user.getPhone() : null)
                                        .contactPhone(incident.getContactPhone())
                                        .status(incident.getStatus())
                                        .title(title)
                                        .description(description.toString())
                                        .medicalNotes(incident.getMedicalNotes())
                                        .latitude(incident.getLat())
                                        .longitude(incident.getLng())
                                        .spatialUnitId(null) // Could be resolved via spatial lookup
                                        .spatialUnitName(locationName)
                                        .batteryLevel(incident.getBatteryLevel())
                                        .severity(DisasterSeverity.CRITICAL)
                                        .weatherContext(weatherContext)
                                        .isProcessed(false)
                                        .createdAt(LocalDateTime.now())
                                        .build();

                        sosEventRepository.save(event);

                } catch (Exception e) {
                        // Log but don't fail the SOS creation
                        System.err.println("Failed to create SosEvent for incident " + incident.getId() + ": " + e.getMessage());
                }
        }

        private String getWeatherContextForLocation(Double lat, Double lng) {
                if (lat == null || lng == null || weatherService == null) {
                        return null;
                }
                try {
                        // Get weather for nearest spatial unit
                        var forecast = weatherService.getNearestSpatialUnit(lat, lng);
                        if (forecast == null) {
                                return "Weather data unavailable";
                        }

                        // Use flattened fields from AdvancedForecastResponse
                        return String.format("Temp: %.1f°C, Wind: %.1f km/h, Rain: %.1f mm/h",
                                        forecast.getTempC() != null ? forecast.getTempC() : 0.0,
                                        forecast.getWindSpeedKmh() != null ? forecast.getWindSpeedKmh() : 0.0,
                                        forecast.getPrecipitationMm() != null ? forecast.getPrecipitationMm() : 0.0);
                } catch (Exception e) {
                        return "Weather lookup failed: " + e.getMessage();
                }
        }

        private String getLocationNameForCoordinates(Double lat, Double lng) {
                if (lat == null || lng == null) {
                        return "Unknown Location";
                }
                try {
                        // Try to find the nearest spatial unit
                        var units = spatialUnitRepository.findAll();
                        // Simple distance-based lookup (could be improved with PostGIS)
                        return units.stream()
                                        .filter(u -> u.getLat() != null && u.getLng() != null)
                                        .min(java.util.Comparator.comparingDouble(u -> {
                                                double latDiff = u.getLat() - lat;
                                                double lngDiff = u.getLng() - lng;
                                                return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
                                        }))
                                        .map(SpatialUnit::getName)
                                        .orElse("Unknown Location");
                } catch (Exception e) {
                        return "Unknown Location";
                }
        }
}
