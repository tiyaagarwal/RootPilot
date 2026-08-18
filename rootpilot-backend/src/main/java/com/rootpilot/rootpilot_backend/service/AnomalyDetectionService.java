package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.entity.AnomalyEvent;
import com.rootpilot.rootpilot_backend.entity.MetricData;
import com.rootpilot.rootpilot_backend.repository.AnomalyEventRepository;
import com.rootpilot.rootpilot_backend.repository.MetricDataRepository;
import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AnomalyDetectionService {

    private final MetricDataRepository metricDataRepository;
    private final AnomalyEventRepository anomalyEventRepository;
    private final SafeRedisTemplate redisTemplate;

    // Rolling window size for baseline calculations
    private static final int BASELINE_WINDOW = 30;

    public AnomalyDetectionService(MetricDataRepository metricDataRepository,
                                   AnomalyEventRepository anomalyEventRepository,
                                   SafeRedisTemplate redisTemplate) {
        this.metricDataRepository = metricDataRepository;
        this.anomalyEventRepository = anomalyEventRepository;
        this.redisTemplate = redisTemplate;
    }

    public void processMetric(String serviceName, double value, String metricType) {
        // Save current data point to SQL database
        MetricData currentData = new MetricData(
                serviceName,
                metricType.equals("latency") ? value : 0.0,
                metricType.equals("errorRate") ? value : 0.0,
                metricType.equals("throughput") ? value : 0.0,
                LocalDateTime.now()
        );
        metricDataRepository.save(currentData);

        // Fetch sliding window metrics to calculate mean & standard deviation
        List<MetricData> history = metricDataRepository.findRecentMetrics(serviceName, BASELINE_WINDOW);
        
        // Need at least 5 baseline points to calculate representative stats
        if (history.size() < 5) {
            return;
        }

        double sum = 0.0;
        for (MetricData m : history) {
            sum += getMetricValue(m, metricType);
        }
        double mean = sum / history.size();

        double sqDiffSum = 0.0;
        for (MetricData m : history) {
            double val = getMetricValue(m, metricType);
            sqDiffSum += Math.pow(val - mean, 2);
        }
        double stdDev = Math.sqrt(sqDiffSum / history.size());

        // Avoid division by zero
        if (stdDev < 0.001) {
            stdDev = 0.001;
        }

        // Calculate Z-Score
        double zScore = (value - mean) / stdDev;
        double absoluteZ = Math.abs(zScore);

        // Standard 3-sigma rule for anomaly detection (Z > 3)
        if (absoluteZ > 3.0) {
            String severity = absoluteZ > 5.0 ? "CRITICAL" : "HIGH";
            AnomalyEvent anomaly = new AnomalyEvent(
                    serviceName,
                    metricType,
                    zScore,
                    mean,
                    value,
                    LocalDateTime.now(),
                    severity
            );
            
            // Persist anomaly event to SQL
            anomalyEventRepository.save(anomaly);

            // Cache in Redis for real-time dashboard visualization
            String redisKey = "anomaly:" + serviceName + ":" + metricType;
            redisTemplate.opsForValue().set(redisKey, anomaly);
            
            System.out.printf("[Anomaly Triggered] Service: %s, Metric: %s, Z-Score: %.2f (Current: %.2f, Mean: %.2f)%n",
                    serviceName, metricType, zScore, value, mean);
        }
    }

    private double getMetricValue(MetricData m, String type) {
        return switch (type) {
            case "latency" -> m.getLatency();
            case "errorRate" -> m.getErrorRate();
            case "throughput" -> m.getThroughput();
            default -> 0.0;
        };
    }

    public List<AnomalyEvent> getAllAnomalies() {
        return anomalyEventRepository.findTop50ByOrderByTimestampDesc();
    }
}
