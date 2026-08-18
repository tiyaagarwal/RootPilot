package com.rootpilot.rootpilot_backend.repository;

import com.rootpilot.rootpilot_backend.entity.MetricData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetricDataRepository extends JpaRepository<MetricData, Long> {
    
    @Query("SELECT m FROM MetricData m WHERE m.serviceName = :serviceName ORDER BY m.timestamp DESC LIMIT :limit")
    List<MetricData> findRecentMetrics(String serviceName, int limit);
}
