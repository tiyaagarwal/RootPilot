package com.rootpilot.rootpilot_backend.repository;

import com.rootpilot.rootpilot_backend.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentRepository
        extends JpaRepository<Incident, Long> {

    @Query("""
           SELECT DISTINCT i.serviceName
           FROM Incident i
           """)
    List<String> findDistinctServiceNames();

    @Query("""
       SELECT i.exceptionType,
              COUNT(i)
       FROM Incident i
       GROUP BY i.exceptionType
       """)
    List<Object[]> countIncidentsByException();

    @Query("""
       SELECT i.serviceName,
              COUNT(i)
       FROM Incident i
       GROUP BY i.serviceName
       """)
    List<Object[]> countIncidentsByService();
    @Query("""
       SELECT i.serviceName,
              i.exceptionType,
              COUNT(i)
       FROM Incident i
       GROUP BY i.serviceName,
                i.exceptionType
       ORDER BY COUNT(i) DESC
       """)
    List<Object[]> countServiceExceptionCorrelations();
    @Query("""
       SELECT COUNT(i)
       FROM Incident i
       WHERE i.timestamp >= :since
       """)
    long countRecentIncidents(LocalDateTime since);
    @Query("""
       SELECT FUNCTION('DATE_TRUNC', 'hour', i.timestamp),
              COUNT(i)
       FROM Incident i
       GROUP BY FUNCTION('DATE_TRUNC', 'hour', i.timestamp)
       ORDER BY FUNCTION('DATE_TRUNC', 'hour', i.timestamp)
       """)
    List<Object[]> getHourlyTrend();
    @Query("""
       SELECT i.serviceName,
              COUNT(i)
       FROM Incident i
       WHERE i.timestamp >= :since
       GROUP BY i.serviceName
       ORDER BY COUNT(i) DESC
       """)
    List<Object[]> countRecentIncidentsByService(
            LocalDateTime since
    );
    @Query("""
       SELECT i.exceptionType,
              COUNT(i)
       FROM Incident i
       WHERE i.timestamp >= :since
       GROUP BY i.exceptionType
       ORDER BY COUNT(i) DESC
       """)
    List<Object[]> countRecentIncidentsByException(
            LocalDateTime since
    );
    @Query("""
       SELECT i.serviceName,
              i.exceptionType,
              COUNT(i)
       FROM Incident i
       WHERE i.timestamp >= :since
       GROUP BY i.serviceName,
                i.exceptionType
       ORDER BY COUNT(i) DESC
       """)
    List<Object[]> countRecentCorrelations(
            LocalDateTime since
    );
}