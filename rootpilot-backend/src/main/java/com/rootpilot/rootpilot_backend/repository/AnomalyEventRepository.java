package com.rootpilot.rootpilot_backend.repository;

import com.rootpilot.rootpilot_backend.entity.AnomalyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnomalyEventRepository extends JpaRepository<AnomalyEvent, Long> {
    List<AnomalyEvent> findTop50ByOrderByTimestampDesc();
}
