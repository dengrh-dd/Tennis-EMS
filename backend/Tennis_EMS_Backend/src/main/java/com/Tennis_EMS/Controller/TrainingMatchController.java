package com.Tennis_EMS.Controller;

import com.Tennis_EMS.DTO.CreateTrainingMatchRequestDTO;
import com.Tennis_EMS.DTO.TrainingMatchResponseDTO;
import com.Tennis_EMS.DTO.UpdateTrainingMatchRequestDTO;
import com.Tennis_EMS.Service.TrainingMatchService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class TrainingMatchController {

    private final TrainingMatchService trainingMatchService;

    public TrainingMatchController(TrainingMatchService trainingMatchService) {
        this.trainingMatchService = trainingMatchService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingMatchResponseDTO> getById(@PathVariable int id, HttpSession session) {
        return ResponseEntity.ok(trainingMatchService.getById(id, session));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<TrainingMatchResponseDTO>> getBySession(@PathVariable int sessionId, HttpSession session) {
        return ResponseEntity.ok(trainingMatchService.getBySession(sessionId, session));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TrainingMatchResponseDTO>> getByStatus(@PathVariable String status, HttpSession session) {
        return ResponseEntity.ok(trainingMatchService.getByStatus(status, session));
    }

    @PostMapping
    public ResponseEntity<TrainingMatchResponseDTO> create(@RequestBody CreateTrainingMatchRequestDTO request,
                                                           HttpSession session) {
        return ResponseEntity.status(HttpStatus.CREATED).body(trainingMatchService.create(request, session));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingMatchResponseDTO> update(@PathVariable int id,
                                                           @RequestBody UpdateTrainingMatchRequestDTO request,
                                                           HttpSession session) {
        return ResponseEntity.ok(trainingMatchService.update(id, request, session));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id, HttpSession session) {
        trainingMatchService.delete(id, session);
        return ResponseEntity.noContent().build();
    }
}
