package com.sidms.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AiChatRequestDto {
    private List<ChatMessage> messages;
    private String query;

    @Data
    public static class ChatMessage {
        private String role;
        private String content;
    }
}
