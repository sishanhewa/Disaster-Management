package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rivernet_devices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RivernetDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    @Column(name = "device_key", length = 100, unique = true, nullable = false)
    private String deviceKey;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(length = 255)
    private String basin;

    @Column(length = 255)
    private String river;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(name = "max_level")
    private Double maxLevel;

    @Column(name = "offset_value")
    private Double offsetValue;

    @Column(name = "alert_levels", columnDefinition = "jsonb")
    private String alertLevels;

    @Column(name = "is_online")
    private Boolean isOnline;

    @Column(name = "last_synced_at")
    private LocalDateTime lastSyncedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
