package com.sidms.backend.config;

import com.sidms.backend.model.Camp;
import com.sidms.backend.model.Profile;
import com.sidms.backend.repository.CampRepository;
import com.sidms.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProfileRepository profileRepository;
    private final CampRepository campRepository;

    @Override
    public void run(String... args) throws Exception {
        
        // 1. Seed Universal Donor Account
        if (profileRepository.findByEmail("donor@test.com").isEmpty()) {
            Profile donor = new Profile();
            donor.setFullName("Demo Donor");
            donor.setEmail("donor@test.com");
            donor.setPasswordHash("password");
            donor.setRole("donor");
            profileRepository.save(donor);
        }

        // 2. Seed Camp Manager 1 (Colombo)
        if (profileRepository.findByEmail("colombo@sidms.com").isEmpty()) {
            Profile manager1 = new Profile();
            manager1.setFullName("Colombo Camp Manager");
            manager1.setEmail("colombo@sidms.com");
            manager1.setPasswordHash("secure123");
            manager1.setRole("camp_manager");
            manager1 = profileRepository.save(manager1);

            Camp camp1 = new Camp();
            camp1.setCampName("Colombo Central Relief Camp");
            camp1.setDistrict("Colombo");
            camp1.setAddress("123 Main St, Colombo 01");
            camp1.setManager(manager1);
            campRepository.save(camp1);
        }

        // 3. Seed Camp Manager 2 (Galle)
        if (profileRepository.findByEmail("galle@sidms.com").isEmpty()) {
            Profile manager2 = new Profile();
            manager2.setFullName("Galle Camp Manager");
            manager2.setEmail("galle@sidms.com");
            manager2.setPasswordHash("secure123");
            manager2.setRole("camp_manager");
            manager2 = profileRepository.save(manager2);

            Camp camp2 = new Camp();
            camp2.setCampName("Galle Coastal Safezone");
            camp2.setDistrict("Galle");
            camp2.setAddress("45 Beach Rd, Galle");
            camp2.setManager(manager2);
            campRepository.save(camp2);
        }

        // Remove the old unassigned 'manager@test.com' if it exists to strictly steer users to the real data
        profileRepository.findByEmail("manager@test.com").ifPresent(profile -> {
            // Delete if it has no camps attached to prevent constraint violations
            if (campRepository.findByManager_Id(profile.getId()).isEmpty()) {
                profileRepository.delete(profile);
            }
        });
    }
}
