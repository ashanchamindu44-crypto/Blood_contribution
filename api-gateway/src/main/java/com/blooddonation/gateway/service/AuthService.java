package com.blooddonation.gateway.service;

import com.blooddonation.gateway.dto.AuthResponse;
import com.blooddonation.gateway.dto.LoginRequest;
import com.blooddonation.gateway.dto.RegisterRequest;
import com.blooddonation.gateway.dto.UserProfileResponse;
import com.blooddonation.gateway.model.LoginLog;
import com.blooddonation.gateway.model.User;
import com.blooddonation.gateway.model.UserRole;
import com.blooddonation.gateway.repository.LoginLogRepository;
import com.blooddonation.gateway.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final LoginLogRepository loginLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, LoginLogRepository loginLogRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.loginLogRepository = loginLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            if (!userRepository.existsByEmail("donor@blood.lk")) {
                User donor = new User(
                    "USR-101",
                    "donor@blood.lk",
                    passwordEncoder.encode("password123"),
                    "Kasun Perera",
                    "O+",
                    "Colombo",
                    "+94 77 123 4567",
                    UserRole.DONOR
                );
                userRepository.save(donor);
                loginLogRepository.save(new LoginLog(donor.getId(), donor.getEmail(), donor.getRole(), "SYSTEM_SEED"));
            }

            if (!userRepository.existsByEmail("hospital@colombo.lk")) {
                User hospital = new User(
                    "USR-102",
                    "hospital@colombo.lk",
                    passwordEncoder.encode("hospital123"),
                    "National Hospital Colombo",
                    "ALL",
                    "Colombo",
                    "+94 11 269 1111",
                    UserRole.HOSPITAL
                );
                userRepository.save(hospital);
                loginLogRepository.save(new LoginLog(hospital.getId(), hospital.getEmail(), hospital.getRole(), "SYSTEM_SEED"));
            }
        };
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("User with email " + req.getEmail() + " already exists!");
        }

        String userId = "USR-" + UUID.randomUUID().toString().substring(0, 8);
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        User newUser = new User(
            userId,
            req.getEmail(),
            encodedPassword,
            req.getFullName(),
            req.getBloodGroup() != null ? req.getBloodGroup() : "O+",
            req.getCity() != null ? req.getCity() : "Colombo",
            req.getPhone() != null ? req.getPhone() : "",
            req.getRole()
        );

        userRepository.save(newUser);
        loginLogRepository.save(new LoginLog(newUser.getId(), newUser.getEmail(), newUser.getRole(), "REGISTER"));

        String jwtToken = jwtService.generateToken(newUser.getId(), newUser.getEmail(), newUser.getRole());
        return new AuthResponse(jwtToken, newUser.getId(), newUser.getEmail(), newUser.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password!"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password!");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        loginLogRepository.save(new LoginLog(user.getId(), user.getEmail(), user.getRole(), "LOGIN_SUCCESS"));

        String jwtToken = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(jwtToken, user.getId(), user.getEmail(), user.getRole());
    }

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));
        return new UserProfileResponse(user);
    }

    public List<LoginLog> getLoginLogs() {
        return loginLogRepository.findAllByOrderByTimestampDesc();
    }
}
