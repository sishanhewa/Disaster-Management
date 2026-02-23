package com.sidms.backend.controller;

import com.sidms.backend.model.DisasterData;
import com.sidms.backend.repository.DisasterDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/disaster-data")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DisasterDataController {

    private final DisasterDataRepository disasterDataRepository;

    @GetMapping("/latest")
    public ResponseEntity<List<DisasterData>> getLatestData() {
        return ResponseEntity.ok(disasterDataRepository.findLatestData());
    }

    @GetMapping("/history")
    public ResponseEntity<List<DisasterData>> getHistory(
            @RequestParam String locationName,
            @RequestParam String hazardType,
            @RequestParam(defaultValue = "7") int daysBack) {

        LocalDateTime after = LocalDateTime.now().minusDays(daysBack);
        return ResponseEntity.ok(
                disasterDataRepository.findByLocationNameAndHazardTypeAndObservationTimeAfterOrderByObservationTimeAsc(
                        locationName, hazardType, after));
    }
}
