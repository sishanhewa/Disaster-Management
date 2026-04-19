package com.sidms.backend.dto.admin;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class BroadcastRequest {
    private String title;
    private String body;
    private String type;
    private List<UUID> targetUserIds;
}
