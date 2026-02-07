package com.supermarket.backend.controller;

import com.supermarket.backend.model.User;
import com.supermarket.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> creds) {
        String username = creds.get("username");
        String password = creds.get("password");

        System.out.println("--- Login Attempt ---");
        System.out.println("Username provided: " + username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found in database"));

        boolean isMatch = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password Match Status: " + isMatch);

        if (isMatch) {
            return Map.of(
                    "username", user.getUsername(),
                    "role", user.getRole(),
                    "fullName", user.getFullName()
            );
        } else {
            System.out.println("DEBUG: Password in DB: " + user.getPassword());
            throw new RuntimeException("Invalid Auth");
        }
    }

    @GetMapping("/staff")
    public List<User> getStaff() {
        return userRepository.findAll();
    }

    @PostMapping("/register-staff")
    public User register(@Valid @RequestBody User user) {
        if(userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @PutMapping("/update-profile")
    public User updateProfile(@RequestBody User updatedUser) {
        User existing = userRepository.findByUsername(updatedUser.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setFullName(updatedUser.getFullName());
        existing.setEmail(updatedUser.getEmail());
        existing.setPhone(updatedUser.getPhone());

        // Only change password if a new one is provided and not empty
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
            if (updatedUser.getPassword().length() < 6) throw new RuntimeException("New password too short");
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existing);
    }
}