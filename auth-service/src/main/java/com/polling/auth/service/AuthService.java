package com.polling.auth.service;

import com.polling.auth.dto.AuthResponse;
import com.polling.auth.dto.LoginRequest;
import com.polling.auth.dto.RegisterRequest;
import com.polling.auth.entity.User;
import com.polling.auth.exception.AuthException;
import com.polling.auth.repository.UserRepository;
import com.polling.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(auth);
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AuthException("User not found"));

        log.info("User '{}' logged in successfully", request.getUsername());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresIn(jwtExpiration)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AuthException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AuthException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_ADMIN")
                .build();

        userRepository.save(user);
        log.info("New admin user registered: {}", request.getUsername());

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        return AuthResponse.builder()
                .token(tokenProvider.generateToken(auth))
                .tokenType("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .expiresIn(jwtExpiration)
                .build();
    }
}
