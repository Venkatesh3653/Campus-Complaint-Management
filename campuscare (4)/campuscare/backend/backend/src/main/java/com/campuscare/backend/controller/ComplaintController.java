
package com.campuscare.backend.controller;

import com.campuscare.backend.complaint.Complaint;
import com.campuscare.backend.complaint.ComplaintRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintRepository repository;

    public ComplaintController(ComplaintRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return repository.findAll();
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        return repository.save(complaint);
    }
}
