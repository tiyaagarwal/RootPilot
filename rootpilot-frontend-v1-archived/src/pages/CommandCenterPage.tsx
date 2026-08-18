import { CardContent, Grid, Stack, Typography } from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { SortableTable } from '../components/common/SortableTable';
import { AiCopilotPanel } from '../components/visual/AiCopilotPanel';
import { StatusPill } from '../components/common/StatusPill';
import { GlassCard } from '../components/common/GlassCard';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { commandCenterService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

export function CommandCenterPage() {
  useDocumentTitle('AI Command Center');
  const dashboard = usePlatformQuery(['command-center'], commandCenterService.dashboard);

  if (dashboard.isLoading) return <LoadingState cards={4} />;
  if (dashboard.isError) return <ErrorState queryKey={['command-center']} title="Command Center Unavailable" />;

  const d = dashboard.data;

  return (
    <>
      <PageHeader
        eyebrow="AI Ops Command Center"
        title="RootPilot Operational Brain"
        description="Executive AI summary, operational priorities, recommended actions, and platform readiness — synthesized by the autonomous AI engine in real time."
      />
      <Stack spacing={2.5}>
        {/* Executive Hero Card */}
        <GlassCard glow="#2563EB">
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <KpiCard
                  label="Autonomous Readiness"
                  value={d?.aiOpsSummary?.operationalReadinessScore ?? 0}
                  suffix="%"
                  helper={d?.executiveSummary?.operationalStatus ?? 'Operational status'}
                  progress={d?.aiOpsSummary?.operationalReadinessScore}
                  accent="#2563EB"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" sx={{ letterSpacing: '-.03em', fontWeight: 700 }}>Executive AI Summary</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, fontSize: 16 }}>
                  {d?.executiveSummary?.executiveRecommendation ?? 'No executive recommendation available.'}
                </Typography>
                <Stack direction="row" gap={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                  {d?.executiveSummary?.keyRiskArea && <StatusPill value={d.executiveSummary.keyRiskArea} />}
                  {d?.executiveSummary?.recommendedFocus && <StatusPill value={d.executiveSummary.recommendedFocus} />}
                  {d?.executiveSummary?.automationReadinessAssessment && (
                    <StatusPill value={d.executiveSummary.automationReadinessAssessment} />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </GlassCard>

        {/* Summary KPIs */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Total Priorities"
              value={d?.aiOpsSummary?.totalPriorities ?? 0}
              helper="Operational action items"
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Critical Priorities"
              value={d?.aiOpsSummary?.criticalPriorities ?? 0}
              helper={d?.aiOpsSummary?.topPriorityService ?? ''}
              accent="#DC2626"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Services Requiring Action"
              value={d?.aiOpsSummary?.servicesRequiringAction ?? 0}
              helper="Across all operational priorities"
              accent="#D97706"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <KpiCard
              label="Avg Operational Score"
              value={d?.aiOpsSummary?.averageOperationalScore ?? 0}
              suffix="%"
              helper="Platform readiness average"
              progress={d?.aiOpsSummary?.averageOperationalScore}
              accent="#059669"
            />
          </Grid>
        </Grid>

        {/* Copilot + priorities table */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={4}>
            <AiCopilotPanel
              title="Command Copilot"
              summary={d?.executiveSummary?.recommendedFocus}
              recommendations={(d?.operationalPriorities ?? []).map((x) => ({
                severity: x.priorityLevel,
                message: x.recommendedAction,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <SortableTable
              title="Operational Priorities"
              rows={d?.operationalPriorities ?? []}
              columns={[
                { key: 'serviceName', label: 'Service' },
                { key: 'priorityLevel', label: 'Priority', renderCell: (v) => <StatusPill value={String(v)} /> },
                { key: 'recommendedAction', label: 'Recommended Action' },
                { key: 'businessImpact', label: 'Business Impact' },
                { key: 'executionUrgency', label: 'Urgency', renderCell: (v) => <StatusPill value={String(v)} /> },
                { key: 'operationalScore', label: 'Score', numeric: true },
              ]}
              defaultSort="operationalScore"
            />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}
