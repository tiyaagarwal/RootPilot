import { Box, CardContent, Chip, Grid, LinearProgress, Stack, Typography, alpha } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ShieldIcon from '@mui/icons-material/Shield';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { SortableTable } from '../components/common/SortableTable';
import { StatusPill } from '../components/common/StatusPill';
import { GlassCard } from '../components/common/GlassCard';
import { EmptyState } from '../components/feedback/EmptyState';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { healthService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { motion } from 'framer-motion';

// ── Resilience metric tile ────────────────────────────────────────────────────
function MetricTile({
  label, value, icon, accent = '#2563EB',
}: {
  label: string; value: string | number; icon: React.ReactNode; accent?: string;
}) {
  return (
    <Box sx={{
      p: 2, borderRadius: 2.5, flex: 1,
      bgcolor: alpha(accent, 0.06),
      border: `1px solid ${alpha(accent, 0.15)}`,
    }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
        <Box sx={{ color: accent, display: 'grid', placeItems: 'center' }}>{icon}</Box>
        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.72rem' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="h5" fontWeight={800} sx={{ color: accent, letterSpacing: '-.03em' }}>
        {value ?? 'N/A'}
      </Typography>
    </Box>
  );
}

export function ServiceHealthPage() {
  useDocumentTitle('Service Health');

  const reliability    = usePlatformQuery(['reliability'], healthService.reliability);
  const relSummary     = usePlatformQuery(['reliability-summary'], healthService.reliabilitySummary);
  const relExecSummary = usePlatformQuery(['reliability-exec-summary'], healthService.reliabilityExecutiveSummary);
  const resilience     = usePlatformQuery(['resilience'], healthService.resilience);
  const resDashboard   = usePlatformQuery(['resilience-dashboard'], healthService.resilienceDashboard);
  const resRecommendations = usePlatformQuery(['resilience-recommendations'], healthService.resilienceRecommendations);

  if (reliability.isLoading) return <LoadingState cards={4} />;
  if (reliability.isError)   return <ErrorState queryKey={['reliability']} title="Service Health Unavailable" />;

  const rs  = relSummary.data;
  const rdb = resDashboard.data;

  return (
    <>
      <PageHeader
        eyebrow="Service Health"
        title="Reliability & Resilience Command"
        description="Comprehensive SLO compliance, reliability scoring, and resilience posture across all monitored services."
        action={rdb && <StatusPill value={rdb.resilienceStatus} />}
      />

      <Stack spacing={2.5}>
        {/* ── KPI row ──────────────────────────────────────────────── */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Total Services"
              value={rs?.totalServices ?? 'N/A'}
              helper="Continuously monitored for SLO compliance"
              icon={<HealthAndSafetyIcon />}
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Lowest Reliability"
              value={rs?.lowestReliabilityScore !== undefined ? rs.lowestReliabilityScore : 'N/A'}
              suffix={rs?.lowestReliabilityScore !== undefined ? '%' : undefined}
              helper={`Most at-risk: ${rs?.mostUnreliableService ?? 'N/A'}`}
              accent="#EF4444"
              progress={rs?.lowestReliabilityScore}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="SLO Violations"
              value={rs?.sloViolations ?? 'N/A'}
              helper="Services breaching their reliability targets"
              accent="#F59E0B"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Platform Resilience"
              value={rdb?.platformResilienceScore !== undefined ? rdb.platformResilienceScore : 'N/A'}
              suffix={rdb?.platformResilienceScore !== undefined ? '%' : undefined}
              helper={rdb?.resilienceStatus ?? 'Overall platform resilience score'}
              accent="#10B981"
              progress={rdb?.platformResilienceScore}
              icon={<ShieldIcon />}
            />
          </Grid>
        </Grid>

        {/* ── Resilience dashboard — glass cards instead of wall of text ── */}
        {rdb && (
          <GlassCard glow="#2563EB">
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Platform Resilience Overview</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Structural resilience posture and vulnerability assessment
                  </Typography>
                </Box>
                <Chip
                  label={rdb.resilienceStatus}
                  size="small"
                  sx={{
                    bgcolor: rdb.resilienceStatus?.includes('CRITICAL') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                    color: rdb.resilienceStatus?.includes('CRITICAL') ? '#EF4444' : '#10B981',
                    fontWeight: 700,
                  }}
                />
              </Stack>

              {/* Metric tiles grid */}
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricTile
                    label="Resilience Score"
                    value={`${rdb.platformResilienceScore}%`}
                    icon={<ShieldIcon sx={{ fontSize: 18 }} />}
                    accent="#3B82F6"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricTile
                    label="Most Vulnerable Service"
                    value={rdb.mostVulnerableService ?? 'N/A'}
                    icon={<WarningAmberIcon sx={{ fontSize: 18 }} />}
                    accent="#EF4444"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricTile
                    label="Strongest Service"
                    value={rdb.strongestService ?? 'N/A'}
                    icon={<VerifiedIcon sx={{ fontSize: 18 }} />}
                    accent="#10B981"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricTile
                    label="Critical Services"
                    value={rdb.criticalServicesCount}
                    icon={<WarningAmberIcon sx={{ fontSize: 18 }} />}
                    accent="#F59E0B"
                  />
                </Grid>
              </Grid>

              {/* Top recommendation */}
              {rdb.topRecommendation && (
                <Box sx={{
                  p: 2, borderRadius: 2, mt: 1,
                  bgcolor: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.15)',
                }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <TrendingUpIcon sx={{ color: '#3B82F6', mt: 0.2, flexShrink: 0 }} />
                    <Box>
                      <Typography variant="overline" color="primary.main" sx={{ fontSize: '0.65rem' }}>
                        Top Recommendation
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {rdb.topRecommendation}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </GlassCard>
        )}

        {/* ── Reliability executive summary ─────────────────────────── */}
        {!relExecSummary.isError && relExecSummary.data?.summary && (
          <GlassCard glow="#10B981">
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{
                  p: 1.25, borderRadius: 2, bgcolor: 'rgba(16,185,129,0.1)',
                  color: '#10B981', flexShrink: 0, display: 'grid', placeItems: 'center',
                }}>
                  <HealthAndSafetyIcon />
                </Box>
                <Box>
                  <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    AI Reliability Assessment
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                    {relExecSummary.data.summary}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </GlassCard>
        )}

        {/* ── Per-service reliability grid ──────────────────────────── */}
        {(reliability.data ?? []).length === 0 ? (
          <EmptyState
            icon={<HealthAndSafetyIcon sx={{ fontSize: 34 }} />}
            title="No service data detected"
            description="Service reliability metrics will appear here once your services begin reporting telemetry."
            accentColor="#2563EB"
          />
        ) : (
          <Grid container spacing={2.2}>
            {(reliability.data ?? []).map((x, i) => (
              <Grid item xs={12} md={4} key={x.serviceName}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ height: '100%' }}
                >
                  <GlassCard
                    glow={x.sloStatus === 'AT_RISK' ? '#EF4444' : '#10B981'}
                    interactive
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1, mr: 1 }} noWrap>
                          {x.serviceName}
                        </Typography>
                        <StatusPill value={x.sloStatus === 'AT_RISK' ? 'AT RISK' : x.sloStatus} />
                      </Stack>

                      {/* Reliability score bar */}
                      <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">Reliability</Typography>
                          <Typography variant="caption" fontWeight={700}
                            sx={{ color: x.reliabilityScore >= 90 ? '#10B981' : x.reliabilityScore >= 70 ? '#F59E0B' : '#EF4444' }}>
                            {x.reliabilityScore}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={x.reliabilityScore}
                          sx={{
                            height: 6, borderRadius: 99, bgcolor: 'action.hover',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 99,
                              bgcolor: x.reliabilityScore >= 90 ? '#10B981' : x.reliabilityScore >= 70 ? '#F59E0B' : '#EF4444',
                            },
                          }}
                        />
                      </Stack>

                      {/* Stats row */}
                      <Stack direction="row" justifyContent="space-between">
                        <Box>
                          <Typography variant="caption" color="text.disabled">Availability</Typography>
                          <Typography variant="body2" fontWeight={700}>{x.availabilityPercentage?.toFixed(2) ?? 'N/A'}%</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.disabled">SLO Target</Typography>
                          <Typography variant="body2" fontWeight={700}>{x.sloTarget ?? 'N/A'}%</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.disabled">Incidents</Typography>
                          <Typography variant="body2" fontWeight={700}>{x.incidentCount}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ── Resilience recommendations table ──────────────────────── */}
        <SortableTable
          title="Resilience Recommendations"
          rows={resRecommendations.data ?? []}
          columns={[
            { key: 'serviceName', label: 'Service' },
            { key: 'priority', label: 'Priority', renderCell: (v) => <StatusPill value={String(v)} /> },
            { key: 'recommendation', label: 'Recommendation' },
            { key: 'expectedResilienceImprovement', label: 'Expected Gain %', numeric: true,
              renderCell: (v) => `+${String(v)}%` },
            { key: 'justification', label: 'Justification' },
          ]}
          defaultSort="expectedResilienceImprovement"
          glow="#10B981"
        />

        {/* ── Resilience actions overview ────────────────────────────── */}
        <SortableTable
          title="Service Resilience Actions"
          rows={resilience.data ?? []}
          columns={[
            { key: 'serviceName', label: 'Service' },
            { key: 'resilienceScore', label: 'Resilience Score', numeric: true, renderCell: (v) => `${String(v)}%` },
            { key: 'riskLevel', label: 'Risk Level', renderCell: (v) => <StatusPill value={String(v)} /> },
            { key: 'recommendedAction', label: 'Recommended Action' },
          ]}
          defaultSort="resilienceScore"
          glow="#2563EB"
        />
      </Stack>
    </>
  );
}
