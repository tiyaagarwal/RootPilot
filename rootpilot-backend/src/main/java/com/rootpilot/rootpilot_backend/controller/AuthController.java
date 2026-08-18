package com.rootpilot.rootpilot_backend.controller;

import com.rootpilot.rootpilot_backend.config.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // Standard hardcoded mock database for interview authentication
    private static final Map<String, String> USERS = new HashMap<>();
    private static final Map<String, String> ROLES = new HashMap<>();

    static {
        ROLES.put("admin", "ADMIN");
        ROLES.put("sre", "SRE");
        ROLES.put("operator", "OPERATOR");
        ROLES.put("viewer", "VIEWER");
    }

    public AuthController(JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        
        // Dynamically compute hashes on startup to avoid static hash typos
        String encodedPassword = passwordEncoder.encode("rootpilot");
        USERS.put("admin", encodedPassword);
        USERS.put("sre", encodedPassword);
        USERS.put("operator", encodedPassword);
        USERS.put("viewer", encodedPassword);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Username and password required"));
        }

        String storedHash = USERS.get(username.toLowerCase());
        if (storedHash != null && passwordEncoder.matches(password, storedHash)) {
            String role = ROLES.get(username.toLowerCase());
            String token = jwtUtil.generateToken(username, role);
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", username,
                    "role", role
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
    }

    @GetMapping("/session")
    public ResponseEntity<?> getSession() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No active session"));
        }
        
        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(r -> r.getAuthority().replace("ROLE_", ""))
                .findFirst().orElse("OPERATOR");

        return ResponseEntity.ok(Map.of(
                "username", username,
                "role", role
        ));
    }
}
