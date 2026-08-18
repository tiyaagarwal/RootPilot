import { Grid, Stack, Typography, CardContent, LinearProgress, Chip, Divider, Box } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { SortableTable } from '../components/common/SortableTable';
import { AiCopilotPanel } from '../components/visual/AiCopilotPanel';
import { StatusPill } from '../components/common/StatusPill';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { rootCauseService, changeService } from '../services/platformServices';
import { GlassCard } from '../components/common/GlassCard';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

export function RootCausePage() {
  useDocumentTitle('Root Cause Analysis');
  
  const recommendations = usePlatformQuery(['recommendations'], rootCauseService.recommendations);
  const rcaSummary = usePlatformQuery(['rca-summary'], rootCauseService.rcaSummary);
  const recSummary = usePlatformQuery(['recommendation-summary'], rootCauseService.recommendationSummary);
  const recentChanges = usePlatformQuery(['recent-changes'], () => changeService.recent(24));

  if (recommendations.isLoading || rcaSummary.isLoading || recentChanges.isLoading) {
    return <LoadingState cards={3} />;
  }
  
  if (recommendations.isError) {
    return <ErrorState queryKey={['recommendations']} title="RCA Unavailable" />;
  }

  const totalIncidents = Number(rcaSummary.data?.totalIncidents ?? 0);
  const topCorrelationMap = rcaSummary.data?.topCorrelation as Record<string, unknown> | undefined;
  const incidentCount = Number(topCorrelationMap?.incidentCount ?? 0);
  const rcaProgress = totalIncidents > 0 ? Math.min(100, Math.round((incidentCount / totalIncidents) * 100)) : 0;

  const probableRootCause = rcaSummary.data?.probableRootCause;
  const rcaSummaryText = probableRootCause
    ? `Probable root cause identified as ${probableRootCause}. Dominant exception is ${rcaSummary.data?.topException} concentrating in ${rcaSummary.data?.topService}.`
    : 'Analyzing evidence to determine probable root cause candidates...';

  const rChanges = recentChanges.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Root Cause Analysis"
        title="AI Evidence Workbench & Change Intelligence"
        description="AI-powered root cause identification backed by telemetry evidence, exception logs, and Change Intelligence correlations tracking deployments and configuration restarts."
      />
      
      <Stack spacing={2.5}>
        {/* Summary KPIs */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="Probable Root Cause"
              value={String(probableRootCause ?? 'Analyzing...')}
              helper="From telemetry correlation"
              progress={rcaProgress}
              icon={<PsychologyIcon />}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="Top Vulnerable Service"
              value={String(rcaSummary.data?.topService ?? 'N/A')}
              helper={String(rcaSummary.data?.topException ?? '')}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="Total Recommendations"
              value={recSummary.data?.totalRecommendations ?? recommendations.data?.length ?? 0}
              helper={`${recSummary.data?.criticalRecommendations ?? 0} critical · Highest: ${recSummary.data?.highestPriority ?? 'N/A'}`}
              accent="#DC2626"
            />
          </Grid>
        </Grid>

        {/* RCA Copilot Panel + Explainable AI Recommendations Grid */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={5}>
            <Stack spacing={2.5} sx={{ height: '100%' }}>
              <AiCopilotPanel
                title="RCA Copilot"
                summary={rcaSummaryText}
                recommendations={(recommendations.data ?? []).map((x) => ({ severity: x.riskLevel, message: x.recommendation }))}
              />
              
              {/* Change Intelligence: What Changed Before This Incident? */}
              <GlassCard glow="#F59E0B">
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SettingsBackupRestoreIcon color="warning" />
                    What Changed Before This Incident?
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  {rChanges.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No deployments or config changes detected within the last 24 hours.
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {rChanges.map((change) => (
                        <Box key={change.id} sx={{ pl: 1, borderLeft: '3px solid #F59E0B' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="body2" fontWeight={700}>
                              {change.serviceName}
                            </Typography>
                            <Chip size="small" label={change.changeType} color="warning" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 'bold' }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {change.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem', opacity: 0.8 }}>
                            By {change.changedBy} · {new Date(change.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </GlassCard>
            </Stack>
          </Grid>

          {/* Cards showcasing Explainable AI */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2.2}>
              {(recommendations.data ?? []).map((x) => (
                <Grid item xs={12} md={12} key={x.serviceName}>
                  <GlassCard glow="#2563EB" interactive>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <StatusPill value={x.riskLevel} />
                          <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 700 }}>
                            {x.serviceName}
                          </Typography>
                          <Typography color="primary.main" variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                            {x.exceptionName}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>AI Confidence</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3B82F6' }}>
                            {x.confidenceScore ?? 85.0}%
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                        {x.reason}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      {/* Evidence Checklist */}
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <InfoIcon sx={{ fontSize: 16 }} color="primary" />
                        AI Ingestion Evidence Logs:
                      </Typography>
                      <Stack spacing={0.6} sx={{ pl: 1, mb: 2 }}>
                        {(x.evidence ?? []).map((evText, idx) => (
                          <Typography key={idx} variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <CheckCircleIcon sx={{ fontSize: 13, color: '#10B981' }} />
                            {evText}
                          </Typography>
                        ))}
                      </Stack>

                      {/* Related change events & dependencies */}
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {x.relatedEvents && x.relatedEvents.length > 0 && (
                          <Chip size="small" variant="outlined" label={`Event: ${x.relatedEvents[0]}`} sx={{ fontSize: '0.7rem' }} />
                        )}
                        {x.relatedTelemetry && x.relatedTelemetry.length > 0 && (
                          <Chip size="small" variant="outlined" label={`Telemetry: ${x.relatedTelemetry[0]}`} sx={{ fontSize: '0.7rem' }} />
                        )}
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, x.incidentCount * 4)}
                          sx={{ height: 6, borderRadius: 99, mb: 0.5 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Concentrates {x.incidentCount} total incidents
                        </Typography>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Full recommendations table */}
        <SortableTable
          title="All Recommendations"
          rows={recommendations.data ?? []}
          columns={[
            { key: 'serviceName', label: 'Service' },
            { key: 'exceptionName', label: 'Exception' },
            { key: 'riskLevel', label: 'Risk', renderCell: (v) => <StatusPill value={String(v)} /> },
            { key: 'incidentCount', label: 'Incidents', numeric: true },
            { key: 'recommendation', label: 'Recommendation' },
            { key: 'reason', label: 'Reason' },
          ]}
          defaultSort="incidentCount"
          glow="#DC2626"
        />
      </Stack>
    </>
  );
}
