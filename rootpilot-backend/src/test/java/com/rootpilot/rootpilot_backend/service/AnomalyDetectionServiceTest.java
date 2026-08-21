package com.rootpilot.rootpilot_backend.service;

import com.rootpilot.rootpilot_backend.config.SafeRedisTemplate;
import com.rootpilot.rootpilot_backend.entity.AnomalyEvent;
import com.rootpilot.rootpilot_backend.entity.MetricData;
import com.rootpilot.rootpilot_backend.repository.AnomalyEventRepository;
import com.rootpilot.rootpilot_backend.repository.MetricDataRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnomalyDetectionServiceTest {

    @Mock
    private MetricDataRepository metricDataRepository;

    @Mock
    private AnomalyEventRepository anomalyEventRepository;

    @Mock
    private SafeRedisTemplate redisTemplate;

    @Mock
    private SafeRedisTemplate.SafeValueOperations valueOperations;

    private AnomalyDetectionService service;

    @BeforeEach
    void setUp() {
        service = new AnomalyDetectionService(metricDataRepository, anomalyEventRepository, redisTemplate);
    }

    // --- Insufficient history ---

    @Test
    void processMetric_fewerThanFiveHistoryPoints_doesNotTriggerAnomaly() {
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt()))
                .thenReturn(buildLatencyHistory(4, 100.0));

        service.processMetric("svc-a", 999.0, "latency");

        verify(anomalyEventRepository, never()).save(any());
        verify(redisTemplate, never()).opsForValue();
    }

    @Test
    void processMetric_emptyHistory_doesNotTriggerAnomaly() {
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt()))
                .thenReturn(Collections.emptyList());

        service.processMetric("svc-a", 500.0, "latency");

        verify(anomalyEventRepository, never()).save(any());
    }

    // --- Normal (non-anomalous) values ---

    @Test
    void processMetric_valueWithinThreeSigma_doesNotTriggerAnomaly() {
        // 15 points at 90 ms and 15 at 110 ms → mean=100, stdDev=10
        // A value of 125 ms gives Z=2.5, which is below the 3-sigma threshold
        List<MetricData> history = new ArrayList<>();
        for (int i = 0; i < 15; i++) history.add(makeMetric("svc-a", 90.0, 0, 0));
        for (int i = 0; i < 15; i++) history.add(makeMetric("svc-a", 110.0, 0, 0));
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt())).thenReturn(history);

        service.processMetric("svc-a", 125.0, "latency");

        verify(anomalyEventRepository, never()).save(any());
    }

    // --- Anomaly detection ---

    @Test
    void processMetric_zScoreBetweenThreeAndFive_savesHighSeverityAnomaly() {
        // Baseline: 30 points at latency=100, stdDev ~0. Force a meaningful spread:
        // 29 points at 100, 1 at 104 → mean ~100.13, stdDev small but non-zero
        // Use a large spike that gives |Z| just above 3 but well below 5
        List<MetricData> history = buildLatencyHistory(29, 100.0);
        history.add(makeMetric("svc-a", 110.0, 0, 0)); // slight spread
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt())).thenReturn(history);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // Compute what value gives Z ≈ 4 for this distribution, or just use a very
        // large spike and rely on the actual mean/stdDev math
        // Mean ≈ 100.33, stdDev ≈ 1.83; value=107 → Z ≈ 3.6
        service.processMetric("svc-a", 107.0, "latency");

        ArgumentCaptor<AnomalyEvent> captor = ArgumentCaptor.forClass(AnomalyEvent.class);
        verify(anomalyEventRepository).save(captor.capture());
        assertThat(captor.getValue().getSeverity()).isEqualTo("HIGH");
        assertThat(captor.getValue().getServiceName()).isEqualTo("svc-a");
        assertThat(captor.getValue().getMetricType()).isEqualTo("latency");
    }

    @Test
    void processMetric_zScoreAboveFive_savesCriticalSeverityAnomaly() {
        // 30 uniform points → stdDev forced to minimum (0.001); any non-zero deviation
        // will produce a huge Z. Use a history with tiny spread so a big spike is critical.
        List<MetricData> history = buildLatencyHistory(29, 100.0);
        history.add(makeMetric("svc-a", 100.1, 0, 0));
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt())).thenReturn(history);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // Spike to 10_000 → Z >> 5 → CRITICAL
        service.processMetric("svc-a", 10_000.0, "latency");

        ArgumentCaptor<AnomalyEvent> captor = ArgumentCaptor.forClass(AnomalyEvent.class);
        verify(anomalyEventRepository).save(captor.capture());
        assertThat(captor.getValue().getSeverity()).isEqualTo("CRITICAL");
    }

    @Test
    void processMetric_anomalyTriggered_cachesInRedis() {
        List<MetricData> history = buildLatencyHistory(30, 100.0);
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt())).thenReturn(history);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        service.processMetric("svc-b", 10_000.0, "latency");

        verify(redisTemplate).opsForValue();
        verify(valueOperations).set(eq("anomaly:svc-b:latency"), any(AnomalyEvent.class));
    }

    // --- Metric type routing ---

    @Test
    void processMetric_errorRateType_readsErrorRateField() {
        List<MetricData> history = buildErrorRateHistory(30, 0.01);
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt())).thenReturn(history);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // Spike errorRate from 0.01 to 1.0 — massive Z-score → anomaly
        service.processMetric("svc-c", 1.0, "errorRate");

        ArgumentCaptor<AnomalyEvent> captor = ArgumentCaptor.forClass(AnomalyEvent.class);
        verify(anomalyEventRepository).save(captor.capture());
        assertThat(captor.getValue().getMetricType()).isEqualTo("errorRate");
    }

    @Test
    void processMetric_throughputType_readsThroughputField() {
        List<MetricData> history = buildThroughputHistory(30, 1000.0);
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt())).thenReturn(history);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // Throughput drops to near-zero — spike in the negative direction
        service.processMetric("svc-d", 0.001, "throughput");

        ArgumentCaptor<AnomalyEvent> captor = ArgumentCaptor.forClass(AnomalyEvent.class);
        verify(anomalyEventRepository).save(captor.capture());
        assertThat(captor.getValue().getMetricType()).isEqualTo("throughput");
    }

    @Test
    void processMetric_unknownMetricType_treatsAsZeroAndNoAnomaly() {
        // All values become 0.0 for unknown type, so mean=0, stdDev=0.001, current=0 → Z=0
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt()))
                .thenReturn(buildLatencyHistory(10, 100.0));

        service.processMetric("svc-e", 0.0, "unknown_type");

        verify(anomalyEventRepository, never()).save(any());
    }

    // --- Always persists the raw metric ---

    @Test
    void processMetric_alwaysSavesMetricDataRegardlessOfAnomaly() {
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt()))
                .thenReturn(buildLatencyHistory(2, 100.0)); // too few → no anomaly

        service.processMetric("svc-f", 105.0, "latency");

        ArgumentCaptor<MetricData> captor = ArgumentCaptor.forClass(MetricData.class);
        verify(metricDataRepository).save(captor.capture());
        assertThat(captor.getValue().getServiceName()).isEqualTo("svc-f");
        assertThat(captor.getValue().getLatency()).isEqualTo(105.0);
    }

    @Test
    void processMetric_zScoreStoredInAnomaly_isSignedNotAbsolute() {
        // Negative Z (current < mean) should still be stored with its sign
        List<MetricData> history = buildLatencyHistory(29, 1000.0);
        history.add(makeMetric("svc-g", 1001.0, 0, 0));
        when(metricDataRepository.findRecentMetrics(anyString(), anyInt())).thenReturn(history);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // Very small value → large negative Z
        service.processMetric("svc-g", 0.001, "latency");

        ArgumentCaptor<AnomalyEvent> captor = ArgumentCaptor.forClass(AnomalyEvent.class);
        verify(anomalyEventRepository).save(captor.capture());
        assertThat(captor.getValue().getZScore()).isNegative();
    }

    // --- getAllAnomalies ---

    @Test
    void getAllAnomalies_delegatesToRepository() {
        List<AnomalyEvent> events = List.of(
                new AnomalyEvent("svc-h", "latency", 4.2, 100.0, 520.0, LocalDateTime.now(), "HIGH")
        );
        when(anomalyEventRepository.findTop50ByOrderByTimestampDesc()).thenReturn(events);

        List<AnomalyEvent> result = service.getAllAnomalies();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getServiceName()).isEqualTo("svc-h");
    }

    // --- Helpers ---

    private List<MetricData> buildLatencyHistory(int count, double latency) {
        List<MetricData> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(makeMetric("svc", latency, 0, 0));
        }
        return list;
    }

    private List<MetricData> buildErrorRateHistory(int count, double errorRate) {
        List<MetricData> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(makeMetric("svc", 0, errorRate, 0));
        }
        return list;
    }

    private List<MetricData> buildThroughputHistory(int count, double throughput) {
        List<MetricData> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(makeMetric("svc", 0, 0, throughput));
        }
        return list;
    }

    private MetricData makeMetric(String service, double latency, double errorRate, double throughput) {
        return new MetricData(service, latency, errorRate, throughput, LocalDateTime.now());
    }
}
