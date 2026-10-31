
package com.campuscare.backend.controller;

import com.campuscare.backend.user.AppUser;
import com.campuscare.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> data) {

        String name = data.get("name");
        String email = data.get("email");
        String password = data.get("password");

        if (name == null || name.trim().length() < 2 ||
                email == null || !email.contains("@") ||
                password == null || password.length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please provide valid registration details."));
        }

        if (userRepository.existsByEmail(email.trim().toLowerCase())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "An account with this email already exists."));
        }

        AppUser user = new AppUser();
        user.setName(name.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("student");

        AppUser saved = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "user", Map.of(
                        "id", saved.getId(),
                        "name", saved.getName(),
                        "email", saved.getEmail(),
                        "role", saved.getRole())));
    }
}
