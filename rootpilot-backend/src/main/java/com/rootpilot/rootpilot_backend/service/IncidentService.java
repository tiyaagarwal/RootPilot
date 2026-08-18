package com.rootpilot.rootpilot_backend.service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import com.rootpilot.rootpilot_backend.dto.ServiceDependency;

import java.time.Duration;

import java.util.ArrayList;
import com.rootpilot.rootpilot_backend.dto.*;
import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import com.rootpilot.rootpilot_backend.entity.Incident;
import com.rootpilot.rootpilot_backend.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(
            IncidentRepository incidentRepository,
            SafeRedisTemplate redisTemplate) {

        this.incidentRepository = incidentRepository;
        this.redisTemplate = redisTemplate;
    }

    public Incident saveIncident(
            Incident incident) {

        Incident saved =
                incidentRepository.save(incident);

        redisTemplate.opsForValue()
                .increment("liveIncidentCount");
        System.out.println(
                "SERVICE = "
                        + incident.getServiceName()
        );
        redisTemplate.opsForValue()
                .increment(
                        "service:"
                                + incident.getServiceName()
                );
        redisTemplate.opsForValue()
                .increment(
                        "exception:"
                                + incident.getExceptionType()
                );
        redisTemplate.opsForValue()
                .increment(
                        "correlation:"
                                + incident.getServiceName()
                                + "|"
                                + incident.getExceptionType()
                );
        redisTemplate.delete("totalIncidents");
        redisTemplate.delete("serviceMetrics");
        redisTemplate.delete("exceptionMetrics");
        redisTemplate.delete("rcaSummary");
        redisTemplate.delete("recentRcaSummary");

        return saved;
    }

    public List<Incident> getAllIncidents() {

        return incidentRepository.findAll();
    }

    public Optional<Incident> getIncidentById(
            Long id) {

        return incidentRepository.findById(id);
    }
    public long getTotalIncidents() {

        String cacheKey = "totalIncidents";

        Object cachedValue =
                redisTemplate.opsForValue()
                        .get(cacheKey);

        if (cachedValue != null) {

            return Long.parseLong(
                    cachedValue.toString()
            );
        }

        long count =
                incidentRepository.count();

        redisTemplate.opsForValue()
                .set(cacheKey, count);

        return count;
    }
    public List<String> getAllServices() {

        return incidentRepository.findDistinctServiceNames();
    }
    @SuppressWarnings("unchecked")
    public Map<String, Long> getExceptionMetrics() {

        String cacheKey = "exceptionMetrics";

        Object cached =
                redisTemplate.opsForValue()
                        .get(cacheKey);

        if (cached != null) {

            return (Map<String, Long>) cached;
        }

        List<Object[]> results =
                incidentRepository.countIncidentsByException();

        Map<String, Long> metrics =
                new HashMap<>();

        for (Object[] row : results) {

            metrics.put(
                    (String) row[0],
                    (Long) row[1]
            );
        }

        redisTemplate.opsForValue()
                .set(cacheKey, metrics);

        return metrics;
    }
    @SuppressWarnings("unchecked")
    public Map<String, Long> getServiceMetrics() {

        String cacheKey = "serviceMetrics";

        Object cached =
                redisTemplate.opsForValue()
                        .get(cacheKey);

        if (cached != null) {

            return (Map<String, Long>) cached;
        }

        List<Object[]> results =
                incidentRepository.countIncidentsByService();

        Map<String, Long> metrics =
                new HashMap<>();

        for (Object[] row : results) {

            metrics.put(
                    (String) row[0],
                    (Long) row[1]
            );
        }

        redisTemplate.opsForValue()
                .set(cacheKey, metrics);

        return metrics;
    }
    public Map<String, Long> getExceptionCounts() {

        return incidentRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        Incident::getExceptionType,
                        Collectors.counting()
                ));
    }
    public Map<String, Object> getTopFailingService() {

        Map<String, Long> metrics = getServiceMetrics();

        Map.Entry<String, Long> topService =
                metrics.entrySet()
                        .stream()
                        .max(Map.Entry.comparingByValue())
                        .orElse(null);

        if (topService == null) {
            return Map.of();
        }

        return Map.of(
                "service", topService.getKey(),
                "incidentCount", topService.getValue()
        );
    }
    public Map<String, Object> getTopException() {

        Map<String, Long> metrics = getExceptionMetrics();

        Map.Entry<String, Long> topException =
                metrics.entrySet()
                        .stream()
                        .max(Map.Entry.comparingByValue())
                        .orElse(null);

        if (topException == null) {
            return Map.of();
        }

        return Map.of(
                "exception", topException.getKey(),
                "incidentCount", topException.getValue()
        );
    }
    public Map<String, Object> getAnalysisSummary() {

        Map<String, Object> topService =
                getTopFailingService();

        Map<String, Object> topException =
                getTopException();

        Map<String, Object> summary =
                new HashMap<>();

        summary.put(
                "totalIncidents",
                getTotalIncidents()
        );

        summary.put(
                "topService",
                topService.get("service")
        );

        summary.put(
                "topServiceIncidentCount",
                topService.get("incidentCount")
        );

        summary.put(
                "topException",
                topException.get("exception")
        );

        summary.put(
                "topExceptionIncidentCount",
                topException.get("incidentCount")
        );

        return summary;
    }
    public List<Map<String, Object>> getServiceRanking() {

        return getServiceMetrics()
                .entrySet()
                .stream()
                .sorted(
                        Map.Entry.<String, Long>comparingByValue()
                                .reversed()
                )
                .map(entry -> {

                    Map<String, Object> service =
                            new HashMap<>();

                    service.put(
                            "service",
                            entry.getKey()
                    );

                    service.put(
                            "incidentCount",
                            entry.getValue()
                    );

                    return service;
                })
                .toList();
    }
    public List<Map<String, Object>> getExceptionRanking() {

        return getExceptionMetrics()
                .entrySet()
                .stream()
                .sorted(
                        Map.Entry.<String, Long>comparingByValue()
                                .reversed()
                )
                .map(entry -> {

                    Map<String, Object> exception =
                            new HashMap<>();

                    exception.put(
                            "exception",
                            entry.getKey()
                    );

                    exception.put(
                            "incidentCount",
                            entry.getValue()
                    );

                    return exception;
                })
                .toList();
    }
    public Map<String, Object> getRootCauseCandidates() {

        Map<String, Object> topService =
                getTopFailingService();

        Map<String, Object> topException =
                getTopException();

        return Map.of(
                "topService",
                topService.get("service"),

                "topException",
                topException.get("exception"),

                "probableRootCause",
                topException.get("exception")
                        + " in "
                        + topService.get("service")
        );
    }
    public List<Map<String, Object>> getCorrelations() {

        List<Object[]> results =
                incidentRepository.countServiceExceptionCorrelations();

        List<Map<String, Object>> correlations =
                new ArrayList<>();

        for (Object[] row : results) {

            Map<String, Object> correlation =
                    new HashMap<>();

            correlation.put(
                    "service",
                    row[0]
            );

            correlation.put(
                    "exception",
                    row[1]
            );

            correlation.put(
                    "incidentCount",
                    row[2]
            );

            correlations.add(correlation);
        }

        return correlations;
    }
    public Map<String, Object> getTopCorrelation() {

        List<Map<String, Object>> correlations =
                getCorrelations();

        if (correlations.isEmpty()) {
            return Map.of();
        }

        return correlations.get(0);
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> getRcaSummary() {

        String cacheKey = "rcaSummary";

        Object cached =
                redisTemplate.opsForValue()
                        .get(cacheKey);

        if (cached != null) {

            return (Map<String, Object>) cached;
        }

        Map<String, Object> summary =
                new HashMap<>();

        Map<String, Object> topService =
                getTopFailingService();

        Map<String, Object> topException =
                getTopException();

        Map<String, Object> topCorrelation =
                getTopCorrelation();

        summary.put(
                "totalIncidents",
                getTotalIncidents()
        );

        summary.put(
                "topService",
                topService.get("service")
        );

        summary.put(
                "topException",
                topException.get("exception")
        );

        summary.put(
                "topCorrelation",
                topCorrelation
        );

        summary.put(
                "probableRootCause",
                topCorrelation.get("exception")
                        + " in "
                        + topCorrelation.get("service")
        );

        redisTemplate.opsForValue()
                .set(cacheKey, summary);

        return summary;
    }
    public Map<String, Long> getRecentIncidentCount() {

        LocalDateTime since =
                LocalDateTime.now().minusHours(1);

        long count =
                incidentRepository.countRecentIncidents(
                        since
                );

        return Map.of(
                "recentIncidents",
                count
        );
    }
    public List<Map<String, Object>> getHourlyTrend() {

        List<Object[]> results =
                incidentRepository.getHourlyTrend();

        List<Map<String, Object>> trend =
                new ArrayList<>();

        for (Object[] row : results) {

            Map<String, Object> point =
                    new HashMap<>();

            point.put(
                    "hour",
                    row[0].toString()
            );

            point.put(
                    "count",
                    row[1]
            );

            trend.add(point);
        }

        return trend;
    }
    public Map<String, Object> detectSpike() {

        List<Map<String, Object>> trend =
                getHourlyTrend();

        if (trend.size() < 2) {

            return Map.of(
                    "message",
                    "Not enough data for spike detection"
            );
        }

        Map<String, Object> previous =
                trend.get(trend.size() - 2);

        Map<String, Object> current =
                trend.get(trend.size() - 1);

        long previousCount =
                ((Number) previous.get("count"))
                        .longValue();

        long currentCount =
                ((Number) current.get("count"))
                        .longValue();

        double increasePercent = 0;

        if (previousCount > 0) {

            increasePercent =
                    ((double)
                            (currentCount - previousCount)
                            / previousCount)
                            * 100;
        }

        boolean spikeDetected =
                increasePercent > 50;

        Map<String, Object> result =
                new HashMap<>();

        result.put(
                "currentHourIncidents",
                currentCount
        );

        result.put(
                "previousHourIncidents",
                previousCount
        );

        result.put(
                "increasePercent",
                Math.round(increasePercent * 100.0) / 100.0
        );

        result.put(
                "spikeDetected",
                spikeDetected
        );

        return result;
    }
    public Map<String, Object> getRecentTopService() {

        LocalDateTime since =
                LocalDateTime.now().minusHours(1);

        List<Object[]> results =
                incidentRepository
                        .countRecentIncidentsByService(
                                since
                        );

        if (results.isEmpty()) {
            return Map.of();
        }

        Object[] row = results.get(0);

        return Map.of(
                "service",
                row[0],
                "incidentCount",
                row[1]
        );
    }
    public Map<String, Object> getRecentTopException() {

        LocalDateTime since =
                LocalDateTime.now().minusHours(1);

        List<Object[]> results =
                incidentRepository
                        .countRecentIncidentsByException(
                                since
                        );

        if (results.isEmpty()) {
            return Map.of();
        }

        Object[] row = results.get(0);

        return Map.of(
                "exception",
                row[0],
                "incidentCount",
                row[1]
        );
    }
    public Map<String, Object> getTrendSummary() {

        Map<String, Long> recentIncidents =
                getRecentIncidentCount();

        Map<String, Object> spike =
                detectSpike();

        Map<String, Object> recentService =
                getRecentTopService();

        Map<String, Object> recentException =
                getRecentTopException();

        Map<String, Object> summary =
                new HashMap<>();

        summary.put(
                "recentIncidents",
                recentIncidents.get("recentIncidents")
        );

        summary.put(
                "spikeDetected",
                spike.get("spikeDetected")
        );

        summary.put(
                "topRecentService",
                recentService.get("service")
        );

        summary.put(
                "topRecentException",
                recentException.get("exception")
        );

        return summary;
    }
    public List<Map<String, Object>> getRecentCorrelations() {

        LocalDateTime since =
                LocalDateTime.now().minusHours(1);

        List<Object[]> results =
                incidentRepository.countRecentCorrelations(
                        since
                );

        List<Map<String, Object>> correlations =
                new ArrayList<>();

        for (Object[] row : results) {

            Map<String, Object> correlation =
                    new HashMap<>();

            correlation.put(
                    "service",
                    row[0]
            );

            correlation.put(
                    "exception",
                    row[1]
            );

            correlation.put(
                    "incidentCount",
                    row[2]
            );

            correlations.add(correlation);
        }

        return correlations;
    }
    public Map<String, Object> getRecentTopCorrelation() {

        List<Map<String, Object>> correlations =
                getRecentCorrelations();

        if (correlations.isEmpty()) {
            return Map.of();
        }

        return correlations.get(0);
    }
    @SuppressWarnings("unchecked")
    public Map<String, Object> getRecentRcaSummary() {

        String cacheKey = "recentRcaSummary";

        Object cached =
                redisTemplate.opsForValue()
                        .get(cacheKey);

        if (cached != null) {

            return (Map<String, Object>) cached;
        }

        Map<String, Long> recentIncidents =
                getRecentIncidentCount();

        Map<String, Object> spike =
                detectSpike();

        Map<String, Object> topService =
                getRecentTopService();

        Map<String, Object> topException =
                getRecentTopException();

        Map<String, Object> topCorrelation =
                getRecentTopCorrelation();

        Map<String, Object> summary =
                new HashMap<>();

        summary.put(
                "recentIncidents",
                recentIncidents.get("recentIncidents")
        );

        summary.put(
                "spikeDetected",
                spike.get("spikeDetected")
        );

        summary.put(
                "topService",
                topService.get("service")
        );

        summary.put(
                "topException",
                topException.get("exception")
        );

        summary.put(
                "topCorrelation",
                topCorrelation
        );

        summary.put(
                "probableRootCause",
                topCorrelation.get("exception")
                        + " in "
                        + topCorrelation.get("service")
        );

        redisTemplate.opsForValue()
                .set(cacheKey, summary);

        return summary;
    }
    public Map<String, Object> getSeverityAnalysis() {

        Map<String, Long> recentIncidents =
                getRecentIncidentCount();

        Map<String, Object> spike =
                detectSpike();

        long incidentCount =
                recentIncidents.get("recentIncidents");

        boolean spikeDetected =
                Boolean.TRUE.equals(
                        spike.get("spikeDetected")
                );

        String severity;

        if (spikeDetected || incidentCount > 25) {

            severity = "HIGH";

        } else if (incidentCount > 10) {

            severity = "MEDIUM";

        } else {

            severity = "LOW";
        }

        Map<String, Object> result =
                new HashMap<>();

        result.put(
                "severity",
                severity
        );

        result.put(
                "recentIncidents",
                incidentCount
        );

        result.put(
                "spikeDetected",
                spikeDetected
        );

        return result;
    }
    private final SafeRedisTemplate redisTemplate;
    public Map<String, Long> getLiveIncidentCount() {

        Object count =
                redisTemplate.opsForValue()
                        .get("liveIncidentCount");

        long liveCount = 0;

        if (count != null) {

            liveCount =
                    Long.parseLong(
                            count.toString()
                    );
        }

        return Map.of(
                "liveIncidentCount",
                liveCount
        );
    }

    public Map<String, Long> getLiveServiceCounts() {

        Object count =
                redisTemplate.opsForValue()
                        .get("service:auth-service");

        long serviceCount = 0;

        if (count != null) {

            serviceCount =
                    Long.parseLong(
                            count.toString()
                    );
        }

        return Map.of(
                "auth-service",
                serviceCount
        );
    }
    public Map<String, Object> testExceptionCounter() {

        Object value =
                redisTemplate.opsForValue()
                        .get(
                                "exception:NullPointerException"
                        );

        return Map.of(
                "value",
                String.valueOf(value)
        );
    }
    public Map<String, Long> getLiveExceptionCounts() {

        Object count =
                redisTemplate.opsForValue()
                        .get(
                                "exception:NullPointerException"
                        );

        long exceptionCount = 0;

        if (count != null) {

            exceptionCount =
                    Long.parseLong(
                            count.toString()
                    );
        }

        return Map.of(
                "NullPointerException",
                exceptionCount
        );
    }
    public List<String> generateAlerts() {

        List<String> alerts = new ArrayList<>();

        Object countObject =
                redisTemplate.opsForValue()
                        .get("liveIncidentCount");

        long totalIncidents = 0;

        if (countObject instanceof Number number) {
            totalIncidents = number.longValue();
        }

        if (totalIncidents > 20) {
            alerts.add("HIGH incident volume detected");
        }
        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        String topService = null;
        long maxCount = 0;

        if (serviceKeys != null) {

            for (String key : serviceKeys) {

                Object value =
                        redisTemplate.opsForValue().get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxCount) {

                    maxCount = count;

                    topService =
                            key.replace("service:", "");
                }
            }
        }

        if (topService != null) {

            alerts.add(
                    topService
                            + " is currently failing most often"
            );
        }
        Set<String> exceptionKeys =
                redisTemplate.keys("exception:*");

        String topException = null;
        long maxExceptionCount = 0;

        if (exceptionKeys != null) {

            for (String key : exceptionKeys) {

                Object value =
                        redisTemplate.opsForValue().get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxExceptionCount) {

                    maxExceptionCount = count;

                    topException =
                            key.replace("exception:", "");
                }
            }
        }

        if (topException != null) {

            alerts.add(
                    topException
                            + " is dominant"
            );
        }
        List<Incident> recentIncidents =
                incidentRepository.findAll()
                        .stream()
                        .filter(i ->
                                i.getTimestamp()
                                        .isAfter(
                                                LocalDateTime.now().minusHours(1)
                                        )
                        )
                        .toList();
        String topCorrelation = "N/A";

        Set<String> correlationKeys =
                redisTemplate.keys("correlation:*");


        long maxCorrelationCount = 0;

        if (correlationKeys != null) {

            for (String key : correlationKeys) {

                Object value =
                        redisTemplate.opsForValue().get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxCorrelationCount) {

                    maxCorrelationCount = count;

                    topCorrelation =
                            key.replace("correlation:", "");
                }
            }
        }

        if (topCorrelation != null) {

            alerts.add(
                    "Strong correlation detected: "
                            + topCorrelation
                            .replace("|", " with ")
            );
        }
        if (totalIncidents > 50) {

            alerts.add("CRITICAL incident situation detected");

        } else if (totalIncidents > 20) {

            alerts.add("HIGH severity incident situation");

        } else if (totalIncidents > 5) {

            alerts.add("MEDIUM severity incident situation");

        }

        if (recentIncidents.size() > 10) {
            alerts.add("Recent failure spike detected");
        }


        return alerts;
    }
    public List<Alert> generateScoredAlerts() {

        List<Alert> alerts = new ArrayList<>();

        Object countObject =
                redisTemplate.opsForValue()
                        .get("liveIncidentCount");

        long totalIncidents = 0;

        if (countObject instanceof Number number) {
            totalIncidents = number.longValue();
        }

        if (totalIncidents > 50) {

            alerts.add(
                    new Alert(
                            "CRITICAL",
                            "Incident volume exceeds 50"
                    )
            );

        } else if (totalIncidents > 20) {

            alerts.add(
                    new Alert(
                            "HIGH",
                            "Incident volume exceeds 20"
                    )
            );
        }
        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        String topService = null;
        long maxServiceCount = 0;

        if (serviceKeys != null) {

            for (String key : serviceKeys) {

                Object value =
                        redisTemplate.opsForValue().get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxServiceCount) {

                    maxServiceCount = count;

                    topService =
                            key.replace("service:", "");
                }
            }
        }

        if (topService != null) {

            alerts.add(
                    new Alert(
                            "HIGH",
                            topService
                                    + " is failing most often"
                    )
            );
        }
        Set<String> exceptionKeys =
                redisTemplate.keys("exception:*");

        String topException = null;
        long maxExceptionCount = 0;

        if (exceptionKeys != null) {

            for (String key : exceptionKeys) {

                Object value =
                        redisTemplate.opsForValue().get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxExceptionCount) {

                    maxExceptionCount = count;

                    topException =
                            key.replace("exception:", "");
                }
            }
        }

        if (topException != null) {

            alerts.add(
                    new Alert(
                            "HIGH",
                            topException
                                    + " is dominant"
                    )
            );
        }
        Set<String> correlationKeys =
                redisTemplate.keys("correlation:*");

        String topCorrelation = null;
        long maxCorrelationCount = 0;

        if (correlationKeys != null) {

            for (String key : correlationKeys) {

                Object value =
                        redisTemplate.opsForValue().get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxCorrelationCount) {

                    maxCorrelationCount = count;

                    topCorrelation =
                            key.replace("correlation:", "");
                }
            }
        }

        if (topCorrelation != null) {

            alerts.add(
                    new Alert(
                            "HIGH",
                            "Strong correlation detected: "
                                    + topCorrelation.replace("|", " with ")
                    )
            );
        }
        List<Incident> recentIncidents =
                incidentRepository.findAll()
                        .stream()
                        .filter(i ->
                                i.getTimestamp()
                                        .isAfter(
                                                LocalDateTime.now()
                                                        .minusHours(1)
                                        )
                        )
                        .toList();

        if (recentIncidents.size() > 10) {

            alerts.add(
                    new Alert(
                            "CRITICAL",
                            "Recent failure spike detected"
                    )
            );
        }
        return alerts;
    }
    public DashboardSummary getDashboardSummary() {

        Object countObject =
                redisTemplate.opsForValue()
                        .get("liveIncidentCount");

        long totalIncidents = 0;

        if (countObject instanceof Number number) {
            totalIncidents = number.longValue();
        }
        
        if (totalIncidents == 0) {
            totalIncidents = incidentRepository.count();
            if (totalIncidents > 0) {
                redisTemplate.opsForValue().set("liveIncidentCount", String.valueOf(totalIncidents));
                
                List<Object[]> byService = incidentRepository.countIncidentsByService();
                if (byService != null) {
                    for (Object[] row : byService) {
                        redisTemplate.opsForValue().set("service:" + row[0], String.valueOf(row[1]));
                    }
                }
                
                List<Object[]> byException = incidentRepository.countIncidentsByException();
                if (byException != null) {
                    for (Object[] row : byException) {
                        redisTemplate.opsForValue().set("exception:" + row[0], String.valueOf(row[1]));
                    }
                }
                
                List<Object[]> byCorrelation = incidentRepository.countServiceExceptionCorrelations();
                if (byCorrelation != null) {
                    for (Object[] row : byCorrelation) {
                        redisTemplate.opsForValue().set("correlation:" + row[0] + "|" + row[1], String.valueOf(row[2]));
                    }
                }
            }
        }

        String topService = "N/A";
        long maxServiceCount = 0;

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys != null) {

            for (String key : serviceKeys) {

                Object value =
                        redisTemplate.opsForValue()
                                .get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxServiceCount) {

                    maxServiceCount = count;

                    topService =
                            key.replace("service:", "");
                }
            }
        }

        String topException = "N/A";
        long maxExceptionCount = 0;
        int alertsCount =
                generateAlerts().size();

        int scoredAlertsCount =
                generateScoredAlerts().size();
        String topCorrelation = "N/A";

        Set<String> correlationKeys =
                redisTemplate.keys("correlation:*");

        long maxCorrelationCount = 0;

        if (correlationKeys != null) {

            for (String key : correlationKeys) {

                Object value =
                        redisTemplate.opsForValue().get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxCorrelationCount) {

                    maxCorrelationCount = count;

                    topCorrelation =
                            key.replace("correlation:", "")
                                    .replace("|", " with ");
                }
            }
        }
        Set<String> exceptionKeys =
                redisTemplate.keys("exception:*");

        if (exceptionKeys != null) {

            for (String key : exceptionKeys) {

                Object value =
                        redisTemplate.opsForValue()
                                .get(key);

                long count = 0;

                if (value instanceof Number number) {
                    count = number.longValue();
                }

                if (count > maxExceptionCount) {

                    maxExceptionCount = count;

                    topException =
                            key.replace("exception:", "");
                }
            }
        }

        String severity = "LOW";

        if (totalIncidents > 50) {
            severity = "CRITICAL";
        } else if (totalIncidents > 20) {
            severity = "HIGH";
        } else if (totalIncidents > 5) {
            severity = "MEDIUM";
        }
        String topDependency =
                getTopDependencyName();

        String highestDependencyRisk =
                getHighestDependencyRisk();

        long totalDependencies =
                getTopDependencies().size();

        return new DashboardSummary(
                totalIncidents,
                topService,
                topException,
                severity,
                alertsCount,
                scoredAlertsCount,
                topCorrelation,
                topDependency,
                highestDependencyRisk,
                totalDependencies
        );
    }
    public ExecutiveSummary getExecutiveSummary() {

        DashboardSummary dashboard =
                getDashboardSummary();

        StringBuilder summary = new StringBuilder();

        summary.append(
                        "RootPilot has detected a ")
                .append(dashboard.getSeverity())
                .append(" incident situation. ");

        summary.append(
                        dashboard.getTopService())
                .append(" is currently the most unstable service. ");

        summary.append(
                        dashboard.getTopException())
                .append(" is the dominant exception. ");

        summary.append(
                        "Total incidents observed: ")
                .append(dashboard.getTotalIncidents())
                .append(". ");

        if (!dashboard.getTopCorrelation().equals("N/A")) {

            summary.append(
                            "Strong correlation detected between ")
                    .append(dashboard.getTopCorrelation())
                    .append(". ");
        }

        summary.append(
                        dashboard.getAlertsCount())
                .append(" active alerts are currently raised.");

        return new ExecutiveSummary(
                summary.toString()
        );
    }
    public LiveDashboard getLiveDashboard() {

        DashboardSummary dashboard =
                getDashboardSummary();

        ExecutiveSummary executive =
                getExecutiveSummary();
        String topDependency =
                getTopDependencyName();

        String highestDependencyRisk =
                getHighestDependencyRisk();

        long totalDependencies =
                getTopDependencies().size();
        return new LiveDashboard(
                dashboard.getTotalIncidents(),
                dashboard.getTopService(),
                dashboard.getTopException(),
                dashboard.getSeverity(),
                dashboard.getAlertsCount(),
                dashboard.getScoredAlertsCount(),
                dashboard.getTopCorrelation(),
                executive.getSummary(),
                getHealthScore(),
                getSystemStatus()
        );
    }
    public int getHealthScore() {

        int score = 100;

        long incidents =
                incidentRepository.count();

        if (incidents > 100) {
            score -= 30;
        }
        else if (incidents > 50) {
            score -= 20;
        }
        else if (incidents > 20) {
            score -= 10;
        }

        String severity =
                (String) getSeverityAnalysis()
                        .get("severity");

        if ("CRITICAL".equalsIgnoreCase(severity)) {
            score -= 30;
        }
        else if ("HIGH".equalsIgnoreCase(severity)) {
            score -= 20;
        }
        else if ("MEDIUM".equalsIgnoreCase(severity)) {
            score -= 10;
        }

        int alerts =
                generateAlerts().size();

        score -= Math.min(alerts * 5, 20);

        return Math.max(score, 0);
    }
    public String getSystemStatus() {

        int healthScore =
                getHealthScore();

        if (healthScore >= 80) {
            return "HEALTHY";
        }

        if (healthScore >= 50) {
            return "WARNING";
        }

        return "CRITICAL";
    }
    public String getLiveSummary() {

        LiveDashboard dashboard =
                getLiveDashboard();

        return "RootPilot status is "
                + getSystemStatus()
                + " with a health score of "
                + getHealthScore()
                + ". "
                + dashboard.getTopService()
                + " is currently the most unstable service. "
                + dashboard.getTopException()
                + " remains the dominant exception. "
                + dashboard.getAlertsCount()
                + " active alerts are present.";
    }
    public DashboardSnapshot getDashboardSnapshot() {
        String topDependency =
                getTopDependencyName();

        String highestDependencyRisk =
                getHighestDependencyRisk();

        long totalDependencies =
                getTopDependencies().size();
        return new DashboardSnapshot(
                getLiveDashboard(),
                getHealthScore(),
                getSystemStatus(),
                getLiveSummary()
        );
    }
    public List<ServiceDependency> getServiceDependencies() {

        List<Incident> incidents =
                incidentRepository.findAll();

        incidents.sort(
                Comparator.comparing(
                        Incident::getTimestamp));

        List<ServiceDependency> dependencies =
                new ArrayList<>();

        for (int i = 0; i < incidents.size(); i++) {

            Incident current = incidents.get(i);
            
            for (int j = i + 1; j < incidents.size(); j++) {
                Incident next = incidents.get(j);

                if (current.getServiceName() == null || next.getServiceName() == null) {
                    continue;
                }

                if (current.getServiceName().equals(next.getServiceName())) {
                    continue;
                }

                Duration duration = Duration.between(current.getTimestamp(), next.getTimestamp());
                long minutes = duration.toMinutes();

                if (minutes <= 5) {
                    dependencies.add(new ServiceDependency(current.getServiceName(), next.getServiceName(), 1));
                } else {
                    break; // List is sorted by timestamp, so all subsequent incidents will also be > 5 minutes apart
                }
            }
        }

        return dependencies;
    }
    public List<ServiceDependency> getTopDependencies() {

        List<ServiceDependency> dependencies =
                getServiceDependencies();

        Map<String, Long> counts =
                new HashMap<>();

        for (ServiceDependency dependency : dependencies) {

            String key =
                    dependency.getSourceService()
                            + "->"
                            + dependency.getTargetService();

            counts.put(
                    key,
                    counts.getOrDefault(key, 0L) + 1
            );
        }

        List<ServiceDependency> results =
                new ArrayList<>();

        for (Map.Entry<String, Long> entry
                : counts.entrySet()) {

            String[] parts =
                    entry.getKey().split("->");

            results.add(
                    new ServiceDependency(
                            parts[0],
                            parts[1],
                            entry.getValue()
                    )
            );
        }

        results.sort(
                (a, b) -> Long.compare(
                        b.getDependencyCount(),
                        a.getDependencyCount()
                )
        );

        return results;
    }
    public DependencySummary getDependencySummary() {

        List<ServiceDependency> dependencies =
                getTopDependencies();

        long totalDependencies = 0;

        for (ServiceDependency dependency : dependencies) {

            totalDependencies +=
                    dependency.getDependencyCount();
        }

        long uniqueDependencies =
                dependencies.size();

        String topSourceService = "N/A";
        String topTargetService = "N/A";
        long topDependencyCount = 0;

        if (!dependencies.isEmpty()) {

            ServiceDependency top =
                    dependencies.get(0);

            topSourceService =
                    top.getSourceService();

            topTargetService =
                    top.getTargetService();

            topDependencyCount =
                    top.getDependencyCount();
        }

        return new DependencySummary(
                totalDependencies,
                uniqueDependencies,
                topSourceService,
                topTargetService,
                topDependencyCount
        );
    }
    public List<CascadeFailure> getCascadeFailures() {

        List<ServiceDependency> dependencies =
                getTopDependencies();

        List<CascadeFailure> cascades =
                new ArrayList<>();

        for (ServiceDependency first : dependencies) {

            for (ServiceDependency second : dependencies) {

                if (first.getTargetService()
                        .equals(second.getSourceService())) {

                    cascades.add(
                            new CascadeFailure(
                                    first.getSourceService(),
                                    first.getTargetService(),
                                    second.getTargetService()
                            )
                    );
                }
            }
        }

        return cascades;
    }
    public List<DependencyRisk> getDependencyRisks() {

        List<ServiceDependency> dependencies =
                getTopDependencies();

        List<DependencyRisk> risks =
                new ArrayList<>();

        for (ServiceDependency dependency : dependencies) {

            long count =
                    dependency.getDependencyCount();

            String riskLevel;

            if (count >= 10) {

                riskLevel = "CRITICAL";

            } else if (count >= 5) {

                riskLevel = "HIGH";

            } else if (count >= 3) {

                riskLevel = "MEDIUM";

            } else {

                riskLevel = "LOW";
            }

            risks.add(
                    new DependencyRisk(
                            dependency.getSourceService(),
                            dependency.getTargetService(),
                            count,
                            riskLevel
                    )
            );
        }

        return risks;
    }
    private String getTopDependencyName() {

        List<ServiceDependency> dependencies =
                getTopDependencies();

        if (dependencies.isEmpty()) {
            return "N/A";
        }

        ServiceDependency top =
                dependencies.get(0);

        return top.getSourceService()
                + " -> "
                + top.getTargetService();
    }
    private String getHighestDependencyRisk() {

        List<DependencyRisk> risks =
                getDependencyRisks();

        if (risks.isEmpty()) {
            return "N/A";
        }

        return risks.get(0).getRiskLevel();
    }
    public DependencyExecutiveSummary getDependencyExecutiveSummary() {

        List<ServiceDependency> dependencies =
                getTopDependencies();

        List<DependencyRisk> risks =
                getDependencyRisks();

        if (dependencies.isEmpty()) {

            return new DependencyExecutiveSummary(
                    "No service dependency relationships detected."
            );
        }

        ServiceDependency topDependency =
                dependencies.get(0);

        String riskLevel = "LOW";

        if (!risks.isEmpty()) {
            riskLevel = risks.get(0).getRiskLevel();
        }

        String summary =
                "Top dependency detected between "
                        + topDependency.getSourceService()
                        + " and "
                        + topDependency.getTargetService()
                        + ". Risk level is "
                        + riskLevel
                        + ". Total dependency chains detected: "
                        + dependencies.size()
                        + ".";

        return new DependencyExecutiveSummary(summary);
    }
    public List<FailurePrediction> getFailurePredictions() {

        List<FailurePrediction> predictions = new ArrayList<>();

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys == null) {
            return predictions;
        }

        for (String key : serviceKeys) {

            String serviceName =
                    key.replace("service:", "");

            Object value =
                    redisTemplate.opsForValue().get(key);

            long incidentCount = 0;

            if (value instanceof Number number) {
                incidentCount = number.longValue();
            }

            long alertCount = incidentCount / 5;

            long dependencyRisk = incidentCount / 4;

            double riskScore =
                    incidentCount
                            + alertCount
                            + dependencyRisk;

            String predictedRisk;

            if (riskScore >= 100) {
                predictedRisk = "CRITICAL";
            }
            else if (riskScore >= 60) {
                predictedRisk = "HIGH";
            }
            else if (riskScore >= 30) {
                predictedRisk = "MEDIUM";
            }
            else {
                predictedRisk = "LOW";
            }

            String predictionReason =
                    "Based on incident frequency, alerts and dependency risk";

            predictions.add(
                    new FailurePrediction(
                            serviceName,
                            incidentCount,
                            alertCount,
                            dependencyRisk,
                            riskScore,
                            predictedRisk,
                            predictionReason));
        }

        predictions.sort(
                (a, b) ->
                        Double.compare(
                                b.getRiskScore(),
                                a.getRiskScore()));

        return predictions;
    }
    public String getTopRiskService() {

        List<FailurePrediction> predictions =
                getFailurePredictions();

        if (predictions.isEmpty()) {
            return "N/A";
        }

        return predictions.get(0).getServiceName();
    }
    public PredictionSummary getPredictionSummary() {

        List<FailurePrediction> predictions =
                getFailurePredictions();

        int totalPredictions =
                predictions.size();

        String topRiskService =
                "N/A";

        double highestRiskScore =
                0;

        int criticalServices =
                0;

        for (FailurePrediction prediction : predictions) {

            if (prediction.getRiskScore()
                    > highestRiskScore) {

                highestRiskScore =
                        prediction.getRiskScore();

                topRiskService =
                        prediction.getServiceName();
            }

            if ("CRITICAL".equals(
                    prediction.getPredictedRisk())) {

                criticalServices++;
            }
        }

        return new PredictionSummary(
                totalPredictions,
                topRiskService,
                highestRiskScore,
                criticalServices);
    }
    public PredictionExecutiveSummary getPredictionExecutiveSummary() {

        PredictionSummary summary =
                getPredictionSummary();

        String text =
                summary.getTopRiskService()
                        + " is currently the highest-risk service with a risk score of "
                        + summary.getHighestRiskScore()
                        + ". "
                        + summary.getCriticalServices()
                        + " service(s) require immediate attention.";

        return new PredictionExecutiveSummary(text);
    }
    public List<AnomalyDetection> getAnomalies() {

        List<AnomalyDetection> anomalies =
                new ArrayList<>();

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys == null || serviceKeys.isEmpty()) {
            return anomalies;
        }

        long totalIncidents = 0;

        for (String key : serviceKeys) {

            Object value =
                    redisTemplate.opsForValue().get(key);

            if (value instanceof Number number) {
                totalIncidents += number.longValue();
            }
        }

        double averageCount =
                (double) totalIncidents /
                        serviceKeys.size();

        for (String key : serviceKeys) {

            String serviceName =
                    key.replace("service:", "");

            Object value =
                    redisTemplate.opsForValue().get(key);

            long incidentCount = 0;

            if (value instanceof Number number) {
                incidentCount = number.longValue();
            }

            double deviation =
                    incidentCount - averageCount;

            double anomalyScore = 0;

            if (averageCount > 0) {
                anomalyScore =
                        Math.abs(deviation)
                                / averageCount
                                * 100;
            }

            String anomalyLevel;

            if (anomalyScore >= 150) {
                anomalyLevel = "CRITICAL";
            }
            else if (anomalyScore >= 75) {
                anomalyLevel = "HIGH";
            }
            else if (anomalyScore >= 25) {
                anomalyLevel = "WATCH";
            }
            else {
                anomalyLevel = "NORMAL";
            }

            String reason =
                    "Deviation from average incident volume";

            anomalies.add(
                    new AnomalyDetection(
                            serviceName,
                            incidentCount,
                            averageCount,
                            deviation,
                            anomalyScore,
                            anomalyLevel,
                            reason));
        }

        anomalies.sort(
                (a, b) ->
                        Double.compare(
                                b.getAnomalyScore(),
                                a.getAnomalyScore()));

        return anomalies;
    }
    public String getTopAnomalyService() {

        List<AnomalyDetection> anomalies =
                getAnomalies();

        if (anomalies.isEmpty()) {
            return "N/A";
        }

        return anomalies.get(0).getServiceName();
    }
    public AnomalySummary getAnomalySummary() {

        List<AnomalyDetection> anomalies =
                getAnomalies();

        int totalAnomalies =
                anomalies.size();

        String topAnomalyService =
                "N/A";

        double highestAnomalyScore =
                0;

        int criticalAnomalies =
                0;

        for (AnomalyDetection anomaly : anomalies) {

            if (anomaly.getAnomalyScore()
                    > highestAnomalyScore) {

                highestAnomalyScore =
                        anomaly.getAnomalyScore();

                topAnomalyService =
                        anomaly.getServiceName();
            }

            if ("CRITICAL".equals(
                    anomaly.getAnomalyLevel())) {

                criticalAnomalies++;
            }
        }

        return new AnomalySummary(
                totalAnomalies,
                topAnomalyService,
                highestAnomalyScore,
                criticalAnomalies);
    }
    public AnomalyExecutiveSummary getAnomalyExecutiveSummary() {

        AnomalySummary summary =
                getAnomalySummary();

        String text =
                summary.getTopAnomalyService()
                        + " shows the highest anomalous behavior with an anomaly score of "
                        + summary.getHighestAnomalyScore()
                        + ". "
                        + summary.getCriticalAnomalies()
                        + " critical anomaly/anomalies currently require investigation.";

        return new AnomalyExecutiveSummary(text);
    }
    public List<RootCauseRecommendation> getRecommendations() {

        List<RootCauseRecommendation> recommendations =
                new ArrayList<>();

        Set<String> exceptionKeys =
                redisTemplate.keys("exception:*");

        if (exceptionKeys == null) {
            return recommendations;
        }

        for (String key : exceptionKeys) {

            String exceptionName =
                    key.replace("exception:", "");

            Object value =
                    redisTemplate.opsForValue().get(key);

            long incidentCount = 0;

            if (value instanceof Number number) {
                incidentCount = number.longValue();
            }

            String recommendation =
                    "Investigate recurring exception";

            if (exceptionName.contains("NullPointer")) {

                recommendation =
                        "Review null validation and input checks";
            }
            else if (exceptionName.contains("Timeout")) {

                recommendation =
                        "Investigate latency and downstream dependencies";
            }
            else if (exceptionName.contains("Connection")) {

                recommendation =
                        "Verify dependent service availability";
            }
            else if (exceptionName.contains("OutOfMemory")) {

                recommendation =
                        "Inspect heap usage and memory leaks";
            }

            String priority;

            if (incidentCount >= 100) {
                priority = "CRITICAL";
            }
            else if (incidentCount >= 50) {
                priority = "HIGH";
            }
            else if (incidentCount >= 20) {
                priority = "MEDIUM";
            }
            else {
                priority = "LOW";
            }

            String riskLevel = priority;

            recommendations.add(
                    new RootCauseRecommendation(
                            (String) getTopFailingService().get("service"),
                            exceptionName,
                            incidentCount,
                            riskLevel,
                            recommendation,
                            priority,
                            "Generated from recurring exception patterns"));
        }

        recommendations.sort(
                (a, b) ->
                        Long.compare(
                                b.getIncidentCount(),
                                a.getIncidentCount()));

        return recommendations;
    }
    public String getTopRecommendationService() {

        List<RootCauseRecommendation> recommendations =
                getRecommendations();

        if (recommendations.isEmpty()) {
            return "N/A";
        }

        return recommendations.get(0).getServiceName();
    }
    public RecommendationSummary getRecommendationSummary() {

        List<RootCauseRecommendation> recommendations =
                getRecommendations();

        int totalRecommendations =
                recommendations.size();

        String topRecommendationService =
                "N/A";

        int criticalRecommendations =
                0;

        String highestPriority =
                "LOW";

        for (RootCauseRecommendation recommendation
                : recommendations) {

            if ("N/A".equals(topRecommendationService)) {

                topRecommendationService =
                        recommendation.getServiceName();
            }

            if ("CRITICAL".equals(
                    recommendation.getPriority())) {

                criticalRecommendations++;

                highestPriority = "CRITICAL";
            }
            else if ("HIGH".equals(
                    recommendation.getPriority())
                    && !"CRITICAL".equals(highestPriority)) {

                highestPriority = "HIGH";
            }
            else if ("MEDIUM".equals(
                    recommendation.getPriority())
                    && "LOW".equals(highestPriority)) {

                highestPriority = "MEDIUM";
            }
        }

        return new RecommendationSummary(
                totalRecommendations,
                topRecommendationService,
                criticalRecommendations,
                highestPriority
        );
    }
    public RecommendationExecutiveSummary getRecommendationExecutiveSummary() {

        List<RootCauseRecommendation> recommendations =
                getRecommendations();

        if (recommendations.isEmpty()) {

            return new RecommendationExecutiveSummary(
                    "No active recommendations available."
            );
        }

        RootCauseRecommendation top =
                recommendations.get(0);

        String summary =
                top.getServiceName()
                        + " requires immediate attention. "
                        + top.getExceptionName()
                        + " is generating recurring incidents. "
                        + "Recommended action: "
                        + top.getRecommendation()
                        + ". Priority level: "
                        + top.getPriority()
                        + ".";

        return new RecommendationExecutiveSummary(
                summary
        );
    }
    public List<ServiceReliability> getServiceReliability() {

        List<ServiceReliability> services =
                new ArrayList<>();

        Set<String> serviceKeys =
                redisTemplate.keys("service:*");

        if (serviceKeys == null) {
            return services;
        }

        for (String key : serviceKeys) {

            String serviceName =
                    key.replace("service:", "");

            Object value =
                    redisTemplate.opsForValue().get(key);

            long incidentCount = 0;

            if (value instanceof Number number) {
                incidentCount = number.longValue();
            }

            int reliabilityScore =
                    Math.max(
                            0,
                            100 - (int) incidentCount
                    );

            double availability =
                    Math.max(
                            0,
                            100 - (incidentCount * 0.1)
                    );

            double sloTarget = 99.0;

            String sloStatus;

            if (availability >= 99.0) {

                sloStatus = "PASS";

            } else if (availability >= 97.0) {

                sloStatus = "AT_RISK";

            } else {

                sloStatus = "VIOLATED";
            }

            String riskLevel;

            if (reliabilityScore >= 90) {

                riskLevel = "LOW";

            } else if (reliabilityScore >= 70) {

                riskLevel = "MEDIUM";

            } else if (reliabilityScore >= 50) {

                riskLevel = "HIGH";

            } else {

                riskLevel = "CRITICAL";
            }

            services.add(
                    new ServiceReliability(
                            serviceName,
                            incidentCount,
                            reliabilityScore,
                            availability,
                            sloTarget,
                            sloStatus,
                            riskLevel
                    )
            );
        }

        services.sort(
                Comparator.comparingInt(
                        ServiceReliability::getReliabilityScore
                )
        );

        return services;
    }
    public String getMostUnreliableService() {

        List<ServiceReliability> services =
                getServiceReliability();

        if (services.isEmpty()) {
            return "N/A";
        }

        return services.get(0).getServiceName();
    }
    public ReliabilitySummary getReliabilitySummary() {

        List<ServiceReliability> services =
                getServiceReliability();

        int totalServices =
                services.size();

        String mostUnreliableService =
                "N/A";

        int lowestReliabilityScore =
                100;

        int sloViolations =
                0;

        for (ServiceReliability service : services) {

            if (service.getReliabilityScore()
                    < lowestReliabilityScore) {

                lowestReliabilityScore =
                        service.getReliabilityScore();

                mostUnreliableService =
                        service.getServiceName();
            }

            if ("VIOLATED".equals(
                    service.getSloStatus())) {

                sloViolations++;
            }
        }

        if (services.isEmpty()) {
            lowestReliabilityScore = 0;
        }

        return new ReliabilitySummary(
                totalServices,
                mostUnreliableService,
                lowestReliabilityScore,
                sloViolations
        );
    }
    public ReliabilityExecutiveSummary getReliabilityExecutiveSummary() {

        ReliabilitySummary summary =
                getReliabilitySummary();

        String text =
                summary.getMostUnreliableService()
                        + " is currently the least reliable service with a reliability score of "
                        + summary.getLowestReliabilityScore()
                        + ". "
                        + summary.getSloViolations()
                        + " service(s) are violating SLO targets and require attention.";

        return new ReliabilityExecutiveSummary(text);
    }
    public List<AutonomousAction> getAutonomousActions() {

        List<AutonomousAction> actions =
                new ArrayList<>();


        /*
         * Prediction Engine
         */
        PredictionSummary predictionSummary =
                getPredictionSummary();

        if (predictionSummary != null
                && predictionSummary.getCriticalServices() > 0) {

            actions.add(
                    new AutonomousAction(
                            "AUTO_PREVENTIVE_ACTION",
                            predictionSummary.getTopRiskService(),
                            "Prediction Engine",
                            "HIGH",
                            "Perform preventive investigation",
                            "PENDING",
                            "High failure risk predicted"));
        }


        /*
         * Reliability Engine
         */
        ReliabilitySummary reliabilitySummary =
                getReliabilitySummary();

        if (reliabilitySummary != null
                && reliabilitySummary.getSloViolations() > 0) {

            actions.add(
                    new AutonomousAction(
                            "AUTO_RELIABILITY_ALERT",
                            reliabilitySummary.getMostUnreliableService(),
                            "Reliability Engine",
                            "HIGH",
                            "Review reliability degradation",
                            "PENDING",
                            "SLO violations detected"));
        }


        /*
         * Dependency Engine
         */
        DependencySummary dependencySummary =
                getDependencySummary();

        if (dependencySummary != null
                && dependencySummary.getTopDependencyCount() > 10) {

            actions.add(
                    new AutonomousAction(
                            "AUTO_DEPENDENCY_REVIEW",
                            dependencySummary.getTopSourceService(),
                            "Dependency Engine",
                            "MEDIUM",
                            "Review dependency risk",
                            "PENDING",
                            "High dependency concentration detected"));
        }


        /*
         * Recommendation Engine
         */
        RecommendationSummary recommendationSummary =
                getRecommendationSummary();

        if (recommendationSummary != null
                && recommendationSummary.getCriticalRecommendations() > 0) {

            actions.add(
                    new AutonomousAction(
                            "AUTO_INVESTIGATION",
                            recommendationSummary.getTopRecommendationService(),
                            "Recommendation Engine",
                            "MEDIUM",
                            "Investigate recommendation",
                            "PENDING",
                            "Critical recommendations detected"));
        }

        return actions;
    }
    public String getTopAction() {

        List<AutonomousAction> actions =
                getAutonomousActions();

        if (actions.isEmpty()) {
            return "N/A";
        }

        Map<String, Integer> actionCounts =
                new HashMap<>();

        for (AutonomousAction action : actions) {

            actionCounts.put(
                    action.getActionType(),
                    actionCounts.getOrDefault(
                            action.getActionType(),
                            0) + 1);
        }

        String topAction = "N/A";
        int maxCount = 0;

        for (Map.Entry<String, Integer> entry
                : actionCounts.entrySet()) {

            if (entry.getValue() > maxCount) {

                maxCount = entry.getValue();
                topAction = entry.getKey();
            }
        }

        return topAction;
    }
    public ActionSummary getActionSummary() {

        List<AutonomousAction> actions =
                getAutonomousActions();

        int totalActions = actions.size();

        int criticalActions = 0;
        int pendingActions = 0;

        for (AutonomousAction action : actions) {

            if ("CRITICAL".equalsIgnoreCase(
                    action.getSeverity())) {

                criticalActions++;
            }

            if ("PENDING".equalsIgnoreCase(
                    action.getStatus())) {

                pendingActions++;
            }
        }
        String topActionType = getTopAction();

        return new ActionSummary(
                totalActions,
                criticalActions,
                pendingActions,
                topActionType);
    }
    public ActionExecutiveSummary getActionExecutiveSummary() {

        ActionSummary summary =
                getActionSummary();

        String executiveSummary =
                "RootPilot generated "
                        + summary.getTotalActions()
                        + " autonomous actions. "
                        + summary.getCriticalActions()
                        + " critical actions detected. "
                        + summary.getTopActionType()
                        + " is the dominant operational response. "
                        + summary.getPendingActions()
                        + " actions remain pending review.";

        return new ActionExecutiveSummary(
                executiveSummary);
    }
    public Map<String, Object> getKnowledgeGraph() {

        List<Incident> incidents = incidentRepository.findAll();

        List<KnowledgeGraphNode> nodes = new ArrayList<>();
        List<KnowledgeGraphEdge> edges = new ArrayList<>();

        Map<String, Integer> serviceRelationshipCount =
                new HashMap<>();

        for (Incident incident : incidents) {

            String serviceName =
                    incident.getServiceName();

            String exceptionName =
                    incident.getExceptionType();

            String incidentNodeId =
                    "INCIDENT-" + incident.getId();

            serviceRelationshipCount.put(
                    serviceName,
                    serviceRelationshipCount.getOrDefault(
                            serviceName,
                            0
                    ) + 1
            );

            if (exceptionName != null) {

                edges.add(
                        new KnowledgeGraphEdge(
                                serviceName,
                                exceptionName,
                                "CAUSES",
                                90
                        )
                );

                nodes.add(
                        new KnowledgeGraphNode(
                                exceptionName,
                                "EXCEPTION",
                                exceptionName,
                                1
                        )
                );
            }

            nodes.add(
                    new KnowledgeGraphNode(
                            incidentNodeId,
                            "INCIDENT",
                            incidentNodeId,
                            1
                    )
            );

            edges.add(
                    new KnowledgeGraphEdge(
                            serviceName,
                            incidentNodeId,
                            "TRIGGERS",
                            85
                    )
            );
        }

        /*
         * Incident ↔ Incident Correlation
         */
        for (int i = 0; i < incidents.size(); i++) {

            for (int j = i + 1; j < incidents.size(); j++) {

                Incident first =
                        incidents.get(i);

                Incident second =
                        incidents.get(j);

                if (first.getExceptionType() != null
                        && second.getExceptionType() != null
                        && first.getExceptionType()
                        .equals(second.getExceptionType())) {

                    edges.add(
                            new KnowledgeGraphEdge(
                                    "INCIDENT-" + first.getId(),
                                    "INCIDENT-" + second.getId(),
                                    "CORRELATED_WITH",
                                    80
                            )
                    );
                }
            }
        }

        /*
         * Service ↔ Service Discovery
         */
        for (int i = 0; i < incidents.size(); i++) {

            for (int j = i + 1; j < incidents.size(); j++) {

                Incident first =
                        incidents.get(i);

                Incident second =
                        incidents.get(j);

                String firstService =
                        first.getServiceName();

                String secondService =
                        second.getServiceName();

                if (firstService != null
                        && secondService != null
                        && !firstService.equals(secondService)) {

                    edges.add(
                            new KnowledgeGraphEdge(
                                    firstService,
                                    secondService,
                                    "SERVICE_DEPENDS_ON",
                                    75
                            )
                    );
                }
            }
        }

        for (Map.Entry<String, Integer> entry :
                serviceRelationshipCount.entrySet()) {

            nodes.add(
                    new KnowledgeGraphNode(
                            entry.getKey(),
                            "SERVICE",
                            entry.getKey(),
                            entry.getValue()
                    )
            );
        }

        Map<String, Object> graph =
                new HashMap<>();

        graph.put("nodes", nodes);
        graph.put("edges", edges);

        return graph;
    }

    public KnowledgeGraphSummary getKnowledgeGraphSummary() {

        Map<String, Object> graph =
                getKnowledgeGraph();

        List<KnowledgeGraphNode> nodes =
                (List<KnowledgeGraphNode>) graph.get("nodes");

        List<KnowledgeGraphEdge> edges =
                (List<KnowledgeGraphEdge>) graph.get("edges");

        int totalNodes = nodes.size();

        int totalRelationships = edges.size();

        String mostConnectedNode = "N/A";

        int maxRelationships = 0;

        for (KnowledgeGraphNode node : nodes) {

            if (node.getRelationshipCount() >
                    maxRelationships) {

                maxRelationships =
                        node.getRelationshipCount();

                mostConnectedNode =
                        node.getNodeName();
            }
        }

        String strongestRelationship = "N/A";

        int strongestStrength = 0;

        for (KnowledgeGraphEdge edge : edges) {

            if (edge.getStrength() >
                    strongestStrength) {

                strongestStrength =
                        edge.getStrength();

                strongestRelationship =
                        edge.getSource()
                                + " -> "
                                + edge.getTarget();
            }
        }

        double graphDensity = 0.0;

        if (totalNodes > 1) {

            graphDensity =
                    (double) totalRelationships
                            / (totalNodes * (totalNodes - 1));
        }

        int incidentClusters = 0;

        Map<String, Integer> exceptionCounts =
                new HashMap<>();

        Set<String> relationshipTypes =
                new HashSet<>();

        for (KnowledgeGraphEdge edge : edges) {

            relationshipTypes.add(
                    edge.getRelationshipType()
            );

            if ("CORRELATED_WITH".equals(
                    edge.getRelationshipType())) {

                incidentClusters++;
            }

            if ("CAUSES".equals(
                    edge.getRelationshipType())) {

                exceptionCounts.put(
                        edge.getTarget(),
                        exceptionCounts.getOrDefault(
                                edge.getTarget(),
                                0
                        ) + 1
                );
            }
        }

        String mostCommonException = "N/A";

        int maxExceptionCount = 0;

        for (Map.Entry<String, Integer> entry :
                exceptionCounts.entrySet()) {

            if (entry.getValue() >
                    maxExceptionCount) {

                maxExceptionCount =
                        entry.getValue();

                mostCommonException =
                        entry.getKey();
            }
        }

        double graphMaturityScore =
                Math.min(
                        100.0,
                        totalNodes * 2.0
                                + totalRelationships * 1.5
                );

        double relationshipDiversityScore =
                relationshipTypes.size() * 20.0;

        if (relationshipDiversityScore > 100) {

            relationshipDiversityScore = 100;
        }

        double graphHealthScore =
                (
                        graphMaturityScore
                                + relationshipDiversityScore
                                + (graphDensity * 100)
                ) / 3.0;

        return new KnowledgeGraphSummary(
                totalNodes,
                totalRelationships,
                mostConnectedNode,
                strongestRelationship,
                strongestStrength,
                graphDensity,
                incidentClusters,
                mostCommonException,
                graphMaturityScore,
                relationshipDiversityScore,
                graphHealthScore
        );
    }

    public KnowledgeGraphExecutiveSummary
    getKnowledgeGraphExecutiveSummary() {

        KnowledgeGraphSummary summary =
                getKnowledgeGraphSummary();

        String graphHealth;

        if (summary.getGraphHealthScore() >= 80) {

            graphHealth = "EXCELLENT";

        } else if (summary.getGraphHealthScore() >= 60) {

            graphHealth = "HEALTHY";

        } else if (summary.getGraphHealthScore() >= 40) {

            graphHealth = "STABLE";

        } else if (summary.getGraphHealthScore() >= 20) {

            graphHealth = "DEGRADED";

        } else {

            graphHealth = "CRITICAL";
        }

        String riskLevel;

        if (summary.getIncidentClusters() >= 20) {

            riskLevel = "CRITICAL";

        } else if (summary.getIncidentClusters() >= 10) {

            riskLevel = "HIGH";

        } else if (summary.getIncidentClusters() >= 5) {

            riskLevel = "MEDIUM";

        } else {

            riskLevel = "LOW";
        }

        String recommendation;

        if ("CRITICAL".equals(riskLevel)) {

            recommendation =
                    "Immediate investigation required. Recurring incident clusters indicate systemic instability.";

        } else if ("HIGH".equals(riskLevel)) {

            recommendation =
                    "Review dependency chains and reduce concentration around critical services.";

        } else if ("MEDIUM".equals(riskLevel)) {

            recommendation =
                    "Monitor "
                            + summary.getMostConnectedNode()
                            + " and recurring exception patterns.";

        } else {

            recommendation =
                    "Knowledge graph indicates healthy operational behavior.";
        }

        return new KnowledgeGraphExecutiveSummary(
                graphHealth,
                summary.getMostConnectedNode(),
                summary.getStrongestRelationship(),
                riskLevel,
                recommendation
        );
    }

}