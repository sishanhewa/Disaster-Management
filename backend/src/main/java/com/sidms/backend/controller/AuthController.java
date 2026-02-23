package com.sidms.backend.controller;

import com.sidms.backend.model.Profile;
import com.sidms.backend.repository.ProfileRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final ProfileRepository profileRepository;

    @PostMapping("/login")
    public Profile login(@RequestBody LoginRequest request) {
        Profile user = profileRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        // SUPER SIMPLE PLAINTEXT PASSWORD CHECK - NOT SECURE - FOR DEMO ONLY
        if (!user.getPasswordHash().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return user;
    }

    @PostMapping("/register")
    public Profile register(@RequestBody Profile profile) {
        if (profileRepository.findByEmail(profile.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }
        // In a real app we would hash the password here
        return profileRepository.save(profile);
    }
}

@Data
class LoginRequest {
    private String email;
    private String password;
}
