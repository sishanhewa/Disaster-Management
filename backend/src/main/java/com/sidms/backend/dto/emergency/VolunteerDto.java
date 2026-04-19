package com.sidms.backend.dto.emergency;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class VolunteerDto {
    private UUID id;
    private String displayName;
    private String email;
    private String phone;
    private Boolean isActive;
}
