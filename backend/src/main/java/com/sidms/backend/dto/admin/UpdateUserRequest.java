package com.sidms.backend.dto.admin;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String displayName;
    private String phone;
    private Boolean isActive;
}
