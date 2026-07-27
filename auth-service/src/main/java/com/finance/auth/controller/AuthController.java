package com.finance.auth.controller;

import com.finance.auth.dto.AuthResponse;
import com.finance.auth.dto.LoginRequest;
import com.finance.auth.dto.RegisterRequest;
import com.finance.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://ai-finance-assistant-sooty.vercel.app",
        "*"
})
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(
                authService.login(request));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health(){
        return ResponseEntity.ok(
                "Auth Service is running! ✅");
    }
}
