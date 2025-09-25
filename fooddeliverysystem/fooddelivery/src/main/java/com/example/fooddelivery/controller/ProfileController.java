package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.User;
import com.example.fooddelivery.repository.UserRepository;
import com.example.fooddelivery.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String phone = jwtUtil.extractPhone(token.replace("Bearer ", ""));
            Optional<User> userOptional = userRepository.findByPhone(phone);

            if (userOptional.isPresent()) {
                return ResponseEntity.ok(userOptional.get());
            }
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody User request) {

        try {
            String phone = jwtUtil.extractPhone(token.replace("Bearer ", ""));
            Optional<User> userOptional = userRepository.findByPhone(phone);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // ONLY UPDATE FIELDS THAT EXIST IN OUR SIMPLE USER CLASS
                if (request.getName() != null) user.setName(request.getName());
                if (request.getEmail() != null) user.setEmail(request.getEmail());

                userRepository.save(user);
                return ResponseEntity.ok("Profile updated successfully");
            }
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile");
        }
    }
}