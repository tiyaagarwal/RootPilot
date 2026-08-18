import { Box, CardContent, Grid, Stack, Typography } from '@mui/material';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HubIcon from '@mui/icons-material/Hub';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  autonomousService,
  dashboardService,
  incidentService,
  knowledgeGraphService,
  briefingService,
} from '../services/platformServices';
import { KpiCard } from '../components/common/KpiCard';
import { PageHeader } from '../components/common/PageHeader';
import { ChartCard } from '../components/charts/ChartCard';
import { TrendLine, VolumeBar } from '../components/charts/RootPilotCharts';
import { SortableTable } from '../components/common/SortableTable';
import { StatusPill } from '../components/common/StatusPill';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { HealthStrip } from '../components/visual/HealthStrip';
import { AiCopilotPanel } from '../components/visual/AiCopilotPanel';
import { GlassCard } from '../components/common/GlassCard';
import { AnimatedCounter } from '../components/common/AnimatedCounter';

export function DashboardPage() {
  useDocumentTitle('Dashboard');
  const summary = usePlatformQuery(['dashboard-summary'], dashboardService.summary);
  const snapshot = usePlatformQuery(['dashboard-snapshot'], dashboardService.snapshot);
  const trend = usePlatformQuery(['dashboard-trend'], dashboardService.hourlyTrend);
  const alerts = usePlatformQuery(['alerts'], dashboardService.scoredAlerts);
  const incidents = usePlatformQuery(['incidents'], incidentService.list);
  const readiness = usePlatformQuery(['readiness-dashboard'], autonomousService.readinessDashboard);
  const kgSummary = usePlatformQuery(['knowledge-graph-summary'], knowledgeGraphService.summary);
  const spike = usePlatformQuery(['spike-detection'], dashboardService.spikeDetection);
  const briefing = usePlatformQuery(['dashboard-briefing'], briefingService.today);

  const isLoading =
    summary.isLoading || trend.isLoading || readiness.isLoading || kgSummary.isLoading || briefing.isLoading;

  if (isLoading) return <LoadingState />;

  if (summary.isError || !summary.data) {
    return (
      <ErrorState
        queryKey={['dashboard-summary']}
        title="Dashboard Unavailable"
        description="Could not connect to the RootPilot backend. Verify the Spring Boot service is running and CORS is configured."
      />
    );
  }

  const d = summary.data;
  const healthScore = snapshot.data?.healthScore ?? snapshot.data?.dashboard?.healthScore ?? 0;
  const systemStatus =
    snapshot.data?.systemStatus ?? snapshot.data?.dashboard?.systemStatus ?? 'UNKNOWN';
  const recommendations = (alerts.data ?? []).map((item) => ({
    severity: item.severity,
    message: item.message,
  }));

  // Derived from backend — no fabrication
  const aiConfidence = readiness.data?.averageExecutionConfidence;
  const correlationAccuracy = kgSummary.data?.graphMaturityScore;
  const spikeDetected = spike.data?.spikeDetected;

  return (
    <>
      <PageHeader
        eyebrow="Platform Overview"
        title="AIOps Intelligence Dashboard"
        description={
          snapshot.data?.liveSummary ??
          'Real-time operational health powered by AI-driven telemetry analysis and continuous monitoring.'
        }
        action={<StatusPill value={systemStatus} />}
      />
      <Stack spacing={2.5}>
        {/* Flagship Daily Operational Briefing */}
        {briefing.data && (
          <GlassCard glow="#818CF8">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.68rem', letterSpacing: '.08em' }}>
                Today's Flagship Briefing
              </Typography>
              <Typography variant="h5" fontWeight={850} sx={{ mt: 0.5, mb: 2, letterSpacing: '-.02em' }}>
                Daily Operational Briefing
              </Typography>
              <Stack spacing={1.2}>
                {briefing.data.briefingText.split('\n').filter(line => line.trim().length > 0 && !line.startsWith('###')).map((line, idx) => {
                  const isBullet = line.trim().startsWith('-');
                  const cleanText = line.replace(/^[#\-\*\s]+/, '').replace(/\*\*/g, '');
                  return (
                    <Typography key={idx} variant={isBullet ? "body2" : "body1"} color="text.primary" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, fontWeight: isBullet ? 500 : 700 }}>
                      {isBullet && <Box component="span" sx={{ color: '#818CF8', fontSize: '1.2rem', lineHeight: 1 }}>•</Box>}
                      {cleanText}
                    </Typography>
                  );
                })}
              </Stack>
            </CardContent>
          </GlassCard>
        )}

        {/* System Health Strip */}
        <HealthStrip
          score={healthScore}
          status={systemStatus}
          totalIncidents={d.totalIncidents}
          scoredAlertsCount={d.scoredAlertsCount}
          severity={d.severity}
          topService={d.topService}
          latency={snapshot.data?.latency}
          nodes={snapshot.data?.nodes}
        />

        {/* KPI Grid — Row 1: Core incident metrics */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Total Incidents"
              value={d.totalIncidents}
              helper={`Severity: ${d.severity}`}
              icon={<CrisisAlertIcon />}
              progress={Math.min(100, (d.totalIncidents / 200) * 100)}
              accent="#DC2626"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Critical Alerts"
              value={d.scoredAlertsCount}
              helper={`${d.alertsCount} alerts prioritized by AI scoring`}
              icon={<AutoFixHighIcon />}
              progress={Math.min(100, (d.scoredAlertsCount / (d.alertsCount || 1)) * 100)}
              accent="#D97706"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Top Failing Service"
              value={d.topService ?? 'N/A'}
              helper={`Exception: ${d.topException ?? 'N/A'}`}
              icon={<HubIcon />}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Top Correlation"
              value={d.topCorrelation ?? 'N/A'}
              helper={d.topDependency ?? 'No dependency data'}
              icon={<HubIcon />}
              accent="#2563EB"
            />
          </Grid>

          {/* KPI Grid — Row 2: Quality metrics from real backend */}
          <Grid item xs={12} md={3}>
            <KpiCard
              label="AI Automation Confidence"
              value={aiConfidence !== undefined ? aiConfidence : 'N/A'}
              suffix={aiConfidence !== undefined ? '%' : undefined}
              helper="Confidence in autonomous remediation decisions"
              icon={<PsychologyIcon />}
              progress={aiConfidence}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Service Health Score"
              value={healthScore}
              suffix="%"
              helper={systemStatus}
              icon={<HealthAndSafetyIcon />}
              progress={healthScore}
              accent="#059669"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Graph Maturity Score"
              value={correlationAccuracy !== undefined ? correlationAccuracy : 'N/A'}
              suffix={correlationAccuracy !== undefined ? '%' : undefined}
              helper={d.topCorrelation ?? 'Knowledge graph signal'}
              icon={<HubIcon />}
              progress={correlationAccuracy}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <GlassCard glow={spikeDetected ? '#DC2626' : '#059669'}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                  <TrendingUpIcon sx={{ color: spikeDetected ? 'error.main' : 'success.main' }} />
                  <Typography variant="overline" color="text.secondary">Spike Detection</Typography>
                </Stack>
                {spike.isLoading ? (
                  <Typography variant="h4" fontWeight={900} color="text.secondary">—</Typography>
                ) : spike.isError ? (
                  <Typography variant="body2" color="text.secondary">No Data Available</Typography>
                ) : (
                  <>
                    <Typography
                      variant="h4"
                      fontWeight={900}
                      color={spikeDetected ? 'error.main' : 'success.main'}
                    >
                      {spikeDetected ? 'SPIKE' : 'NORMAL'}
                    </Typography>
                    {spike.data?.recentIncidents !== undefined && (
                      <Typography variant="body2" color="text.secondary">
                        <AnimatedCounter value={spike.data.recentIncidents} /> recent incidents
                      </Typography>
                    )}
                  </>
                )}
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Charts Row 1 */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} lg={8}>
            <ChartCard
              title="Incident Trend"
              subtitle="Hourly incident volume over the last 24 hours"
              loading={trend.isLoading}
              error={trend.isError}
              queryKey={['dashboard-trend']}
            >
              <TrendLine data={trend.data ?? []} />
            </ChartCard>
          </Grid>
          <Grid item xs={12} lg={4}>
            <AiCopilotPanel
              summary={snapshot.data?.dashboard?.executiveSummary}
              recommendations={recommendations}
            />
          </Grid>
        </Grid>

        {/* Charts Row 2 */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} lg={6}>
            <ChartCard
              title="Incident Volume"
              subtitle="Incident distribution by hour across all monitored services"
              loading={trend.isLoading}
              error={trend.isError}
              queryKey={['dashboard-trend']}
            >
              <VolumeBar data={trend.data ?? []} />
            </ChartCard>
          </Grid>
          <Grid item xs={12} lg={6}>
            <SortableTable
              title="Recent Incidents"
              rows={incidents.data?.slice(0, 8) ?? []}
              columns={[
                { key: 'id', label: 'ID', renderCell: (v) => <Typography fontWeight={900}>#{String(v)}</Typography> },
                { key: 'serviceName', label: 'Service' },
                {
                  key: 'statusCode',
                  label: 'Severity',
                  renderCell: (v) => <StatusPill value={Number(v) >= 500 ? 'HIGH' : 'MEDIUM'} />,
                },
                { key: 'latency', label: 'Latency', renderCell: (v) => `${String(v)}ms` },
                { key: 'exceptionType', label: 'Exception' },
              ]}
              defaultSort="id"
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
