package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferences {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "unit_temp", length = 10)
    private String unitTemp;

    @Column(name = "unit_wind", length = 10)
    private String unitWind;

    @Column(name = "unit_precip", length = 10)
    private String unitPrecip;

    @Column(length = 10)
    private String language;

    @Column(name = "user_type", length = 50)
    private String userType;

    @Column(length = 20)
    private String theme;

    @Column(name = "dnd_start", length = 10)
    private String dndStart;

    @Column(name = "dnd_end", length = 10)
    private String dndEnd;

    @Column(name = "notif_email")
    private Boolean notifEmail;

    @Column(name = "notif_push")
    private Boolean notifPush;

    @Column(name = "notif_inapp")
    private Boolean notifInapp;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
