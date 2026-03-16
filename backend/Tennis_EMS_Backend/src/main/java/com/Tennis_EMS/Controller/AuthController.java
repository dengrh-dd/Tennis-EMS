package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.CurrentUserDTO;
import com.Tennis_EMS.DTO.LoginRequestDTO;
import com.Tennis_EMS.DTO.LoginResponseDTO;
import com.Tennis_EMS.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO req, HttpSession session) {

        if (req == null) {
            return ResponseEntity.badRequest().build();
        }

        LoginResponseDTO resp = authService.login(req.getEmail(), req.getPassword(), session);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<CurrentUserDTO> me(HttpSession session) {

        CurrentUserDTO me = authService.currentUser(session);
        if (me == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(me);
    }
}
