package com.sidms.backend.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RefreshRequest {
    // Token comes from HttpOnly cookie, no fields needed
}
