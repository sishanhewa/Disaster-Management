package com.sidms.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "app_profiles")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Profile extends BaseEntity {

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role = "donor"; // donor, camp_manager, admin

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;
}
