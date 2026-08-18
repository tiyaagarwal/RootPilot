import { Grid, Stack, Typography } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/charts/ChartCard';
import { VolumeBar } from '../components/charts/RootPilotCharts';
import { SortableTable } from '../components/common/SortableTable';
import { StatusPill } from '../components/common/StatusPill';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { predictionService, dashboardService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

export function PredictivePage() {
  useDocumentTitle('Predictive Analytics');
  const predictions = usePlatformQuery(['predictions'], predictionService.predictions);
  const anomalies = usePlatformQuery(['anomalies'], predictionService.anomalies);
  const predSummary = usePlatformQuery(['prediction-summary'], predictionService.predictionSummary);
  const anomSummary = usePlatformQuery(['anomaly-summary'], predictionService.anomalySummary);
  const anomExecSummary = usePlatformQuery(['anomaly-exec-summary'], predictionService.anomalyExecutiveSummary);
  const trend = usePlatformQuery(['dashboard-trend'], dashboardService.hourlyTrend);

  if (predictions.isLoading || anomalies.isLoading) return <LoadingState cards={4} />;
  if (predictions.isError) return <ErrorState queryKey={['predictions']} title="Predictions Unavailable" />;

  return (
    <>
      <PageHeader
        eyebrow="Predictive Analytics"
        title="Failure Forecasting Engine"
        description="AI continuously analyzes telemetry patterns to predict failures before they impact users — surfacing risk scores and anomaly signals across all services."
      />
      <Stack spacing={2.5}>
        {/* Summary KPIs from real backend endpoints */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Services At Risk"
              value={predSummary.data?.totalPredictions ?? predictions.data?.length ?? 0}
              helper={predSummary.data?.topRiskService ?? 'Highest-risk service in portfolio'}
              icon={<InsightsIcon />}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Critical Predictions"
              value={predSummary.data?.criticalServices ?? 'N/A'}
              helper={predSummary.data?.highestRiskScore !== undefined ? `Highest risk score: ${predSummary.data.highestRiskScore}%` : 'Prediction risk breakdown'}
              accent="#DC2626"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Anomalies Detected"
              value={anomSummary.data?.totalAnomalies ?? anomalies.data?.length ?? 0}
              helper={anomSummary.data?.topAnomalyService ?? 'Services with anomalous behavior patterns'}
              icon={<WarningAmberIcon />}
              accent="#D97706"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Critical Anomalies"
              value={anomSummary.data?.criticalAnomalies ?? 'N/A'}
              helper="Anomalies classified as critical severity"
              accent="#DC2626"
            />
          </Grid>
        </Grid>

        {/* Risk forecasts per service */}
        <Grid container spacing={2.2}>
          {(predictions.data ?? []).map((x) => (
            <Grid item xs={12} md={4} key={x.serviceName}>
              <KpiCard
                label={x.serviceName}
                value={x.riskScore}
                suffix="%"
                helper={x.predictionReason}
                progress={x.riskScore}
                accent={x.riskScore > 85 ? '#DC2626' : x.riskScore > 65 ? '#D97706' : '#059669'}
              />
            </Grid>
          ))}
        </Grid>

        {/* Chart + tables */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Incident Volume (Historical)"
              subtitle="Hourly incident distribution — use this to identify recurrence patterns"
              loading={trend.isLoading}
              error={trend.isError}
              queryKey={['dashboard-trend']}
            >
              <VolumeBar data={trend.data ?? []} />
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <SortableTable
              title="Failure Predictions"
              rows={predictions.data ?? []}
              columns={[
                { key: 'serviceName', label: 'Service' },
                { key: 'predictedRisk', label: 'Risk', renderCell: (v) => <StatusPill value={String(v)} /> },
                { key: 'riskScore', label: 'Score', numeric: true, renderCell: (v) => `${String(v)}%` },
                { key: 'incidentCount', label: 'Incidents', numeric: true },
                { key: 'alertCount', label: 'Alerts', numeric: true },
              ]}
              defaultSort="riskScore"
              glow="#2563EB"
            />
          </Grid>
        </Grid>

        {anomExecSummary.data?.summary && (
          <Typography variant="caption" color="text.secondary" sx={{ pb: 1 }}>
            {anomExecSummary.data.summary}
          </Typography>
        )}
        <SortableTable
          title="Anomaly Intelligence"
          rows={anomalies.data ?? []}
          columns={[
            { key: 'serviceName', label: 'Service' },
            { key: 'anomalyLevel', label: 'Level', renderCell: (v) => <StatusPill value={String(v)} /> },
            { key: 'anomalyScore', label: 'Score', numeric: true },
            { key: 'incidentCount', label: 'Incidents', numeric: true },
            { key: 'deviation', label: 'Deviation', numeric: true },
            { key: 'reason', label: 'Reason' },
          ]}
          defaultSort="anomalyScore"
        />
      </Stack>
    </>
  );
}
