package com.sidms.backend.dto.content;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FaqEntryDto {
    private UUID id;
    private String question;
    private String answer;
    private String category;
}
