import {
  Box, CardContent, Grid, LinearProgress, Stack, Typography, alpha, Chip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VerifiedIcon from '@mui/icons-material/Verified';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldIcon from '@mui/icons-material/Shield';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BarChartIcon from '@mui/icons-material/BarChart';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { GlassCard } from '../components/common/GlassCard';
import { KpiCard } from '../components/common/KpiCard';
import { AnimatedCounter } from '../components/common/AnimatedCounter';
import { StatusPill } from '../components/common/StatusPill';
import { ChartCard } from '../components/charts/ChartCard';
import { TrendLine } from '../components/charts/RootPilotCharts';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  dashboardService, healthService, autonomousService,
  predictionService, commandCenterService, briefingService,
} from '../services/platformServices';

// ── Trend indicator ───────────────────────────────────────────────────────────
function TrendBadge({ value, positive = true }: { value: number; positive?: boolean }) {
  const good = positive ? value >= 0 : value <= 0;
  const color = good ? '#10B981' : '#EF4444';
  const Icon = value >= 0 ? TrendingUpIcon : TrendingDownIcon;
  return (
    <Stack direction="row" alignItems="center" spacing={0.4}>
      <Icon sx={{ fontSize: 14, color }} />
      <Typography variant="caption" fontWeight={700} sx={{ color, fontSize: '0.72rem' }}>
        {value >= 0 ? '+' : ''}{value}%
      </Typography>
    </Stack>
  );
}

// ── Exec KPI card with trend ──────────────────────────────────────────────────
function ExecKpiCard({
  label, value, suffix, trend, trendPositive = true, icon, accent, helper, progress,
}: {
  label: string; value: number | string; suffix?: string; trend?: number;
  trendPositive?: boolean; icon: React.ReactNode; accent: string; helper?: string; progress?: number;
}) {
  return (
    <GlassCard glow={accent} interactive sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.68rem', letterSpacing: '.08em' }}>
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, letterSpacing: '-.03em', lineHeight: 1 }}>
              {typeof value === 'number'
                ? <AnimatedCounter value={value} suffix={suffix} />
                : <>{value}{suffix && <Box component="span" sx={{ fontSize: '0.6em', ml: 0.3 }}>{suffix}</Box>}</>
              }
            </Typography>
          </Box>
          <Box sx={{
            p: 1.2, borderRadius: 2.5,
            bgcolor: alpha(accent, 0.12),
            color: accent, flexShrink: 0,
            display: 'grid', placeItems: 'center',
          }}>
            {icon}
          </Box>
        </Stack>
        {helper && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2, fontSize: '0.78rem' }}>
            {helper}
          </Typography>
        )}
        {trend !== undefined && (
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1 }}>
            <TrendBadge value={trend} positive={trendPositive} />
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>vs last period</Typography>
          </Stack>
        )}
        {typeof progress === 'number' && (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, progress))}
            sx={{
              mt: 2, height: 5, borderRadius: 99, bgcolor: alpha(accent, 0.1),
              '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: accent },
            }}
          />
        )}
      </CardContent>
    </GlassCard>
  );
}

// ── Service reliability row ───────────────────────────────────────────────────
function ServiceRow({
  name, score, status, availability,
}: { name: string; score: number; status: string; availability: number }) {
  const color = score >= 90 ? '#10B981' : score >= 70 ? '#F59E0B' : '#EF4444';
  return (
    <Box sx={{ py: 1.5, px: 0.5 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body2" fontWeight={600} sx={{ width: 180, flexShrink: 0 }} noWrap>
          {name}
        </Typography>
        <Box sx={{ flex: 1 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, score)}
            sx={{
              height: 6, borderRadius: 99, bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: color },
            }}
          />
        </Box>
        <Typography variant="caption" fontWeight={700} sx={{ color, width: 44, flexShrink: 0, textAlign: 'right' }}>
          {score}%
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ width: 64, flexShrink: 0, textAlign: 'right' }}>
          {availability?.toFixed(1) ?? '–'}% up
        </Typography>
        <StatusPill value={status === 'AT_RISK' ? 'AT RISK' : 'HEALTHY'} />
      </Stack>
    </Box>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function ExecutiveOverviewPage() {
  useDocumentTitle('Executive Overview');

  const snapshot   = usePlatformQuery(['exec-snapshot'], dashboardService.snapshot);
  const summary    = usePlatformQuery(['exec-summary'], dashboardService.summary);
  const trend      = usePlatformQuery(['exec-trend'], dashboardService.hourlyTrend);
  const relData    = usePlatformQuery(['exec-reliability'], healthService.reliability);
  const relSummary = usePlatformQuery(['exec-rel-summary'], healthService.reliabilitySummary);
  const autoDash   = usePlatformQuery(['exec-auto-dash'], autonomousService.readinessDashboard);
  const predictions = usePlatformQuery(['exec-predictions'], predictionService.predictionSummary);
  const aiops      = usePlatformQuery(['exec-aiops'], commandCenterService.dashboard);
  const actionSummary = usePlatformQuery(['exec-actions'], autonomousService.actionSummary);
  const briefing   = usePlatformQuery(['exec-briefing'], briefingService.today);

  const isLoading = snapshot.isLoading || summary.isLoading || relSummary.isLoading || briefing.isLoading;

  if (isLoading) return <LoadingState cards={8} />;
  if (snapshot.isError && summary.isError) {
    return (
      <ErrorState
        queryKey={['exec-snapshot']}
        title="Executive Dashboard Unavailable"
        description="Unable to connect to the platform backend. Verify your deployment is running."
      />
    );
  }

  const healthScore = snapshot.data?.healthScore ?? 0;
  const systemStatus = snapshot.data?.systemStatus ?? 'UNKNOWN';
  const totalIncidents = summary.data?.totalIncidents ?? 0;
  const sloViolations = relSummary.data?.sloViolations ?? 0;
  const totalServices = relSummary.data?.totalServices ?? 0;
  const autoReadiness = autoDash.data?.overallAutomationReadinessScore ?? 0;
  const aiActionsTotal = actionSummary.data?.totalActions ?? 0;
  const predictedRisks = predictions.data?.totalPredictions ?? 0;
  const criticalPredictions = predictions.data?.criticalServices ?? 0;

  // Derive SLO compliance %
  const sloCompliance = totalServices > 0
    ? Math.round(((totalServices - sloViolations) / totalServices) * 100)
    : 0;

  // Derive rough MTTR from average latency across incidents (proxy metric)
  const avgLatency = relData.data?.length
    ? Math.round(relData.data.reduce((a, b) => a + (b.incidentCount > 0 ? 1 : 0), 0))
    : undefined;

  const execRec = aiops.data?.executiveSummary?.executiveRecommendation;
  const operationalStatus = aiops.data?.executiveSummary?.operationalStatus;

  return (
    <>
      <PageHeader
        eyebrow="Executive Overview"
        title="Business Intelligence Dashboard"
        description="Strategic operational health summary for leadership and executive stakeholders."
        action={<StatusPill value={systemStatus} />}
      />

      <Stack spacing={3}>
        {/* ── Flagship Daily Operational Briefing ───────────────────── */}
        {briefing.data && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlassCard glow="#818CF8">
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.68rem', letterSpacing: '.08em' }}>
                  Today's Flagship Briefing
                </Typography>
                <Typography variant="h5" fontWeight={850} sx={{ mt: 0.5, mb: 2, letterSpacing: '-.02em' }}>
                  Daily Operational Briefing
                </Typography>
                <Stack spacing={1.5}>
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
          </motion.div>
        )}

        {/* ── Hero executive summary ──────────────────────────────────── */}
        {execRec && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlassCard glow="#6366F1">
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
                  <Box sx={{
                    p: 2, borderRadius: 3, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.10))',
                    border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: { xs: 56, md: 72 }, height: { xs: 56, md: 72 },
                  }}>
                    <PsychologyIcon sx={{ fontSize: { xs: 28, md: 36 }, color: '#818CF8' }} />
                  </Box>
                  <Box flex={1}>
                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                      <Chip
                        label="AI Executive Summary"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(99,102,241,0.12)',
                          color: '#818CF8',
                          border: '1px solid rgba(99,102,241,0.25)',
                          fontWeight: 700, fontSize: '0.68rem',
                        }}
                      />
                      {operationalStatus && <StatusPill value={operationalStatus} />}
                    </Stack>
                    <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ lineHeight: 1.5 }}>
                      {execRec}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: { xs: 'left', md: 'right' }, flexShrink: 0 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      Platform Health
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{
                      color: healthScore >= 85 ? '#10B981' : healthScore >= 60 ? '#F59E0B' : '#EF4444',
                      letterSpacing: '-.04em',
                    }}>
                      <AnimatedCounter value={healthScore} suffix="%" />
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Row 1: Core business KPIs ───────────────────────────────── */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} sm={6} md={3}>
            <ExecKpiCard
              label="Platform Availability"
              value={sloCompliance}
              suffix="%"
              icon={<VerifiedIcon />}
              accent="#10B981"
              helper={`${sloViolations} SLO violation${sloViolations !== 1 ? 's' : ''} across ${totalServices} services`}
              progress={sloCompliance}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ExecKpiCard
              label="Active Incidents"
              value={totalIncidents}
              icon={<CrisisAlertIcon />}
              accent="#EF4444"
              trendPositive={false}
              helper={`Severity: ${summary.data?.severity ?? 'N/A'} — Top: ${summary.data?.topService ?? 'N/A'}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ExecKpiCard
              label="Predicted Risks"
              value={predictedRisks}
              icon={<BarChartIcon />}
              accent="#F59E0B"
              helper={`${criticalPredictions} critical — Top risk: ${predictions.data?.topRiskService ?? 'N/A'}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ExecKpiCard
              label="AI Actions Executed"
              value={aiActionsTotal}
              icon={<AutoFixHighIcon />}
              accent="#6366F1"
              helper={`Avg confidence: ${autoDash.data?.averageExecutionConfidence ?? 'N/A'}%`}
            />
          </Grid>
        </Grid>

        {/* ── Row 2: Operational posture KPIs ─────────────────────────── */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} sm={6} md={3}>
            <ExecKpiCard
              label="Automation Readiness"
              value={autoReadiness}
              suffix="%"
              icon={<SpeedIcon />}
              accent="#3B82F6"
              helper={autoDash.data?.automationMaturity ?? 'Automation maturity level'}
              progress={autoReadiness}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ExecKpiCard
              label="Autonomous Ready Services"
              value={autoDash.data?.autonomousReadyCount ?? 0}
              icon={<AutoFixHighIcon />}
              accent="#10B981"
              helper={`Grade: ${autoDash.data?.platformAutomationGrade ?? 'N/A'}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ExecKpiCard
              label="SLO Compliance"
              value={sloCompliance}
              suffix="%"
              icon={<ShieldIcon />}
              accent={sloCompliance >= 95 ? '#10B981' : sloCompliance >= 80 ? '#F59E0B' : '#EF4444'}
              helper={`${sloViolations} breaches detected out of ${totalServices} monitored services`}
              progress={sloCompliance}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ExecKpiCard
              label="Services Requiring Action"
              value={aiops.data?.aiOpsSummary?.servicesRequiringAction ?? 0}
              icon={<CrisisAlertIcon />}
              accent="#F59E0B"
              helper={`Top priority: ${aiops.data?.aiOpsSummary?.topPriorityService ?? 'N/A'}`}
            />
          </Grid>
        </Grid>

        {/* ── Row 3: Trend chart + Service reliability ────────────────── */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} lg={7}>
            <ChartCard
              title="Incident Trend — 24h"
              subtitle="Hourly incident volume across all monitored services"
              loading={trend.isLoading}
              error={trend.isError}
              queryKey={['exec-trend']}
            >
              <TrendLine data={trend.data ?? []} />
            </ChartCard>
          </Grid>

          <Grid item xs={12} lg={5}>
            <GlassCard glow="#3B82F6">
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>Service Reliability</Typography>
                  <Chip
                    label={`${totalServices} services`}
                    size="small"
                    sx={{ bgcolor: 'rgba(59,130,246,0.1)', color: 'primary.main', fontWeight: 600 }}
                  />
                </Stack>
                {relData.isLoading ? (
                  <Stack spacing={1}>
                    {[1, 2, 3, 4].map((i) => (
                      <Box key={i} sx={{ height: 32, bgcolor: 'action.hover', borderRadius: 1 }} />
                    ))}
                  </Stack>
                ) : (relData.data ?? []).length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                    No service reliability data available.
                  </Typography>
                ) : (
                  <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
                    {(relData.data ?? []).slice(0, 6).map((s) => (
                      <ServiceRow
                        key={s.serviceName}
                        name={s.serviceName}
                        score={s.reliabilityScore}
                        status={s.sloStatus}
                        availability={s.availabilityPercentage}
                      />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* ── Row 4: AI Ops priorities + self-healing exec summary ──────── */}
        {aiops.data?.operationalPriorities && aiops.data.operationalPriorities.length > 0 && (
          <GlassCard glow="#6366F1">
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Operational Priorities</Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-ranked actions requiring leadership attention
                  </Typography>
                </Box>
                <Chip
                  label={`${aiops.data.aiOpsSummary?.criticalPriorities ?? 0} critical`}
                  size="small"
                  color="error"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
              <Stack spacing={0} divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
                {aiops.data.operationalPriorities.slice(0, 5).map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      alignItems={{ md: 'center' }}
                      spacing={2}
                      sx={{ py: 1.5 }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 200 }}>
                        <StatusPill value={p.priorityLevel} />
                        <Typography variant="body2" fontWeight={700}>{p.serviceName}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {p.recommendedAction}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                        {p.businessImpact}
                      </Typography>
                      <Chip
                        label={p.executionUrgency}
                        size="small"
                        sx={{
                          bgcolor: p.executionUrgency === 'IMMEDIATE' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                          color: p.executionUrgency === 'IMMEDIATE' ? '#EF4444' : '#F59E0B',
                          fontWeight: 700, fontSize: '0.65rem', flexShrink: 0,
                        }}
                      />
                    </Stack>
                  </motion.div>
                ))}
              </Stack>
            </CardContent>
          </GlassCard>
        )}

        {/* ── Avg operational score bar ────────────────────────────────── */}
        {aiops.data?.aiOpsSummary && (
          <GlassCard glow="#10B981">
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                {[
                  {
                    label: 'Avg Operational Score',
                    value: aiops.data.aiOpsSummary.averageOperationalScore,
                    accent: '#10B981',
                  },
                  {
                    label: 'Platform Readiness',
                    value: aiops.data.aiOpsSummary.operationalReadinessScore,
                    accent: '#3B82F6',
                  },
                  {
                    label: 'Automation Confidence',
                    value: autoDash.data?.averageExecutionConfidence ?? 0,
                    accent: '#6366F1',
                  },
                ].map(({ label, value, accent }) => (
                  <Grid item xs={12} md={4} key={label}>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                          {label}
                        </Typography>
                        <Typography variant="body2" fontWeight={800} sx={{ color: accent }}>
                          <AnimatedCounter value={value} suffix="%" />
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, value)}
                        sx={{
                          height: 8, borderRadius: 99,
                          bgcolor: alpha(accent, 0.1),
                          '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: accent },
                        }}
                      />
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </GlassCard>
        )}

        {/* Bottom footnote */}
        {avgLatency !== undefined && (
          <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'right', display: 'block' }}>
            Platform telemetry refreshed continuously. Historical comparisons derived from incident telemetry.
          </Typography>
        )}
      </Stack>
    </>
  );
}
