package com.example.fooddelivery.controller;

import com.example.fooddelivery.model.User;
import com.example.fooddelivery.repository.UserRepository;
import com.example.fooddelivery.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String phone = request.get("phone");
            String name = request.get("name");
            String email = request.get("email");
            String password = request.get("password");
            String role = request.getOrDefault("role", "CUSTOMER");

            // Validation
            if (phone == null || !phone.matches("^[0-9]{10}$")) {
                response.put("success", false);
                response.put("message", "Phone number must be exactly 10 digits");
                return ResponseEntity.badRequest().body(response);
            }

            // Check if user exists
            if (userRepository.existsByPhone(phone)) {
                response.put("success", false);
                response.put("message", "User already exists with this phone number");
                return ResponseEntity.badRequest().body(response);
            }

            if (password == null || password.length() < 6) {
                response.put("success", false);
                response.put("message", "Password must be at least 6 characters");
                return ResponseEntity.badRequest().body(response);
            }

            // Create user
            User user = new User();
            user.setPhone(phone);
            user.setName(name != null ? name : "Customer");
            user.setEmail(email != null ? email : phone + "@foodexpress.com");
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role.equalsIgnoreCase("ADMIN") ? "ADMIN" : "CUSTOMER");

            User savedUser = userRepository.save(user);

            // Generate token with role
            String token = jwtUtil.generateToken(phone, savedUser.getRole());

            response.put("success", true);
            response.put("token", token);
            response.put("user", savedUser);
            response.put("message", "Registration successful");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String phone = request.get("phone");
            String password = request.get("password");

            if (phone == null || !phone.matches("^[0-9]{10}$")) {
                response.put("success", false);
                response.put("message", "Phone number must be exactly 10 digits");
                return ResponseEntity.badRequest().body(response);
            }

            if (password == null || password.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Password is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Find user
            Optional<User> userOptional = userRepository.findByPhone(phone);
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found. Please register first.");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOptional.get();
            if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
                response.put("success", false);
                response.put("message", "Invalid credentials");
                return ResponseEntity.badRequest().body(response);
            }
            String token = jwtUtil.generateToken(phone, user.getRole());

            response.put("success", true);
            response.put("token", token);
            response.put("user", user);
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/debug")
    public ResponseEntity<Map<String, Object>> debug() {
        Map<String, Object> response = new HashMap<>();
        try {
            var users = userRepository.findAll();
            response.put("success", true);
            response.put("userCount", users.size());
            response.put("users", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Debug error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}