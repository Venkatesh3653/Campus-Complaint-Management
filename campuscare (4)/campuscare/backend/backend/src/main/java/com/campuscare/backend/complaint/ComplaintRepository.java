package com.campuscare.backend.complaint;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository
        extends JpaRepository<Complaint, Long> {
}