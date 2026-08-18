import {
  Box, CardContent, Chip, Grid, LinearProgress, Stack,
  Table, TableBody, TableCell, TableHead, TableRow, Typography, alpha,
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HistoryIcon from '@mui/icons-material/History';
import SpeedIcon from '@mui/icons-material/Speed';
import PsychologyIcon from '@mui/icons-material/Psychology';
import UndoIcon from '@mui/icons-material/Undo';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { GlassCard } from '../components/common/GlassCard';
import { KpiCard } from '../components/common/KpiCard';
import { StatusPill } from '../components/common/StatusPill';
import { EmptyState } from '../components/feedback/EmptyState';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { autonomousService } from '../services/platformServices';

// ── Confidence bar ────────────────────────────────────────────────────────────
function ConfidenceBar({ value, label }: { value: number; label: string }) {
  const color = value >= 80 ? '#10B981' : value >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <Box sx={{ py: 0.75 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="caption" fontWeight={600} noWrap sx={{ flex: 1, mr: 1 }}>{label}</Typography>
        <Typography variant="caption" fontWeight={800} sx={{ color, flexShrink: 0 }}>{value}%</Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, value)}
        sx={{
          height: 6, borderRadius: 99, bgcolor: alpha(color, 0.12),
          '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: color },
        }}
      />
    </Box>
  );
}

// ── Action status badge ───────────────────────────────────────────────────────
function ActionBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    EXECUTED:  { bg: 'rgba(16,185,129,0.1)',  color: '#10B981' },
    PENDING:   { bg: 'rgba(245,158,11,0.1)',  color: '#F59E0B' },
    APPROVED:  { bg: 'rgba(59,130,246,0.1)',  color: '#3B82F6' },
    BLOCKED:   { bg: 'rgba(239,68,68,0.1)',   color: '#EF4444' },
    SIMULATED: { bg: 'rgba(99,102,241,0.1)',  color: '#818CF8' },
    READY:     { bg: 'rgba(16,185,129,0.08)', color: '#34D399' },
  };
  const s = cfg[status?.toUpperCase()] ?? { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8' };
  return (
    <Chip
      label={status}
      size="small"
      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.65rem', height: 22 }}
    />
  );
}

export function AutonomousPage() {
  useDocumentTitle('Autonomous Operations');

  const actions       = usePlatformQuery(['auto-actions'], autonomousService.actions);
  const actionSummary = usePlatformQuery(['auto-summary'], autonomousService.actionSummary);
  const actionExec    = usePlatformQuery(['auto-exec-summary'], autonomousService.actionExecutiveSummary);
  const execPlans     = usePlatformQuery(['auto-exec-plans'], autonomousService.executionPlans);
  const orchDash      = usePlatformQuery(['auto-orch-dash'], autonomousService.orchestratorDashboard);
  const readiness     = usePlatformQuery(['auto-readiness'], autonomousService.readiness);
  const readinessDash = usePlatformQuery(['auto-readiness-dash'], autonomousService.readinessDashboard);
  const selfHealing   = usePlatformQuery(['auto-self-healing'], autonomousService.selfHealing);

  const isLoading = actions.isLoading || actionSummary.isLoading || execPlans.isLoading;

  if (isLoading) return <LoadingState cards={6} />;
  if (actions.isError) {
    return (
      <ErrorState
        queryKey={['auto-actions']}
        title="Autonomous Operations Unavailable"
        description="Unable to reach the autonomous execution engine. Ensure backend services are running."
      />
    );
  }

  const totalActions   = actionSummary.data?.totalActions ?? 0;
  const criticalActions = actionSummary.data?.criticalActions ?? 0;
  const pendingActions = actionSummary.data?.pendingActions ?? 0;
  const readyPlans     = orchDash.data?.summary?.readyPlans ?? 0;
  const pendingApproval = orchDash.data?.summary?.pendingApprovalPlans ?? 0;
  const avgConfidence  = readinessDash.data?.averageExecutionConfidence ?? 0;
  const overallScore   = readinessDash.data?.overallAutomationReadinessScore ?? 0;

  const allActions = actions.data ?? [];
  const executedActions  = allActions.filter((a) => a.status === 'EXECUTED' || a.status === 'COMPLETED');
  const pendingActionsArr = allActions.filter((a) => a.status === 'PENDING' || a.status === 'AWAITING_APPROVAL');
  const blockedActions   = allActions.filter((a) => a.status === 'BLOCKED' || a.status === 'ROLLBACK');

  return (
    <>
      <PageHeader
        eyebrow="Autonomous Operations"
        title="AI Remediation Engine"
        description="AI-driven remediation intelligence — from suggested actions to autonomous execution and continuous self-healing."
        action={
          <Chip
            label={`Grade: ${readinessDash.data?.platformAutomationGrade ?? 'N/A'}`}
            sx={{
              fontWeight: 800, fontSize: 13,
              bgcolor: 'rgba(99,102,241,0.1)',
              color: '#818CF8',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          />
        }
      />

      <Stack spacing={3}>
        {/* ── Executive AI summary ─────────────────────────────────────── */}
        {actionExec.data?.summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard glow="#6366F1">
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{
                    p: 1.5, borderRadius: 2.5, flexShrink: 0,
                    bgcolor: 'rgba(99,102,241,0.12)', color: '#818CF8',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <PsychologyIcon />
                  </Box>
                  <Box>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      AI Assessment
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="text.primary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                      {actionExec.data.summary}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </GlassCard>
          </motion.div>
        )}

        {/* ── KPI row ──────────────────────────────────────────────────── */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Total Actions"
              value={totalActions}
              helper={`${criticalActions} critical — Top: ${actionSummary.data?.topActionType ?? 'N/A'}`}
              icon={<AutoFixHighIcon />}
              accent="#6366F1"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Pending Approval"
              value={pendingActions}
              helper="Actions awaiting human authorization"
              icon={<PendingActionsIcon />}
              accent="#F59E0B"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Autonomous Ready"
              value={readyPlans}
              helper={`${pendingApproval} require approval`}
              icon={<CheckCircleIcon />}
              accent="#10B981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="AI Confidence"
              value={avgConfidence}
              suffix="%"
              helper={`Overall readiness: ${overallScore}%`}
              progress={avgConfidence}
              icon={<SpeedIcon />}
              accent="#3B82F6"
            />
          </Grid>
        </Grid>

        {/* ── Recommended actions + AI confidence ──────────────────────── */}
        <Grid container spacing={2.2}>
          {/* Self-healing recommendations */}
          <Grid item xs={12} lg={7}>
            <GlassCard glow="#6366F1">
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>Recommended Actions</Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI-generated remediation suggestions, ranked by priority
                    </Typography>
                  </Box>
                </Stack>
                {selfHealing.isLoading ? (
                  <Stack spacing={1}>{[1, 2, 3].map((i) => <Box key={i} sx={{ height: 60, bgcolor: 'action.hover', borderRadius: 1 }} />)}</Stack>
                ) : !selfHealing.data?.recommendations?.length ? (
                  <EmptyState
                    icon={<AutoFixHighIcon sx={{ fontSize: 44, opacity: 0.3 }} />}
                    title="No recommendations at this time"
                    description="Your platform is operating within normal parameters. AI will surface recommendations when anomalies are detected."
                    compact
                  />
                ) : (
                  <Stack spacing={0} divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
                    {selfHealing.data.recommendations.slice(0, 6).map((r, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ py: 1.75 }}>
                          <Box sx={{
                            mt: 0.25, width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                            bgcolor: r.automationEligible ? '#10B981' : '#F59E0B',
                          }} />
                          <Box flex={1} minWidth={0}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography variant="body2" fontWeight={700}>{r.serviceName}</Typography>
                              <StatusPill value={r.priority} />
                              {r.automationEligible && (
                                <Chip label="Auto-eligible" size="small" sx={{
                                  bgcolor: 'rgba(16,185,129,0.1)', color: '#10B981',
                                  fontWeight: 700, fontSize: '0.6rem', height: 18,
                                }} />
                              )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                              {r.action}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              Trigger: {r.triggerReason}
                            </Typography>
                          </Box>
                        </Stack>
                      </motion.div>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </GlassCard>
          </Grid>

          {/* AI confidence dashboard */}
          <Grid item xs={12} lg={5}>
            <GlassCard glow="#3B82F6">
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(59,130,246,0.1)', color: 'primary.main' }}>
                    <SpeedIcon />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>AI Confidence Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">Execution confidence per service</Typography>
                  </Box>
                </Stack>
                {readiness.isLoading ? (
                  <Stack spacing={1.5}>{[1,2,3,4].map(i => <Box key={i} sx={{ height: 28, bgcolor: 'action.hover', borderRadius: 1 }} />)}</Stack>
                ) : !readiness.data?.length ? (
                  <EmptyState compact title="No confidence data available" description="Awaiting automation readiness assessments from the AI engine." />
                ) : (
                  <Stack spacing={1}>
                    {readiness.data.slice(0, 7).map((r, i) => (
                      <ConfidenceBar
                        key={i}
                        label={r.serviceName}
                        value={r.executionConfidence}
                      />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* ── Execution plans table ─────────────────────────────────────── */}
        <GlassCard glow="#10B981">
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Execution Plans</Typography>
                <Typography variant="body2" color="text.secondary">
                  All AI-generated remediation plans and their current execution status
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {orchDash.data?.summary && (
                  <>
                    <Chip label={`${orchDash.data.summary.readyPlans} ready`} size="small"
                      sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10B981', fontWeight: 700 }} />
                    <Chip label={`${orchDash.data.summary.pendingApprovalPlans} pending`} size="small"
                      sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontWeight: 700 }} />
                  </>
                )}
              </Stack>
            </Stack>
            {!execPlans.data?.length ? (
              <EmptyState
                icon={<HistoryIcon sx={{ fontSize: 44, opacity: 0.3 }} />}
                title="No execution plans available"
                description="Autonomous execution plans will appear here once the AI engine generates remediation strategies."
              />
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {['Service', 'Recommended Action', 'Strategy', 'Confidence', 'Approval Required', 'Status'].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary' }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {execPlans.data.map((p, i) => (
                      <TableRow key={i} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell sx={{ fontWeight: 600 }}>{p.serviceName}</TableCell>
                        <TableCell sx={{ maxWidth: 260 }}>
                          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{p.recommendedAction}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{p.executionStrategy}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ width: 80 }}>
                            <ConfidenceBar label="" value={p.executionConfidence} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.approvalRequired ? 'Yes' : 'No'}
                            size="small"
                            sx={{
                              bgcolor: p.approvalRequired ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                              color: p.approvalRequired ? '#F59E0B' : '#10B981',
                              fontWeight: 700, fontSize: '0.65rem',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <ActionBadge status={p.executionStatus} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </GlassCard>

        {/* ── Executed actions history ──────────────────────────────────── */}
        <GlassCard glow="#6366F1">
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(99,102,241,0.1)', color: '#818CF8' }}>
                <HistoryIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>Action History</Typography>
                <Typography variant="body2" color="text.secondary">
                  All autonomous and approved remediation actions
                </Typography>
              </Box>
            </Stack>
            {!allActions.length ? (
              <EmptyState
                icon={<UndoIcon sx={{ fontSize: 44, opacity: 0.3 }} />}
                title="No actions recorded yet"
                description="Autonomous and operator-approved actions will be logged here as they execute."
              />
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {['Action Type', 'Service', 'Trigger', 'Severity', 'Recommendation', 'Status'].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary' }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allActions.map((a, i) => (
                      <TableRow key={i} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{a.actionType}</Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{a.serviceName}</TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">{a.triggerSource}</Typography>
                        </TableCell>
                        <TableCell><StatusPill value={a.severity} /></TableCell>
                        <TableCell sx={{ maxWidth: 240 }}>
                          <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{a.recommendedAction}</Typography>
                        </TableCell>
                        <TableCell><ActionBadge status={a.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </GlassCard>

        {/* ── Success metrics ──────────────────────────────────────────── */}
        {orchDash.data?.executiveSummary && (
          <GlassCard glow="#10B981">
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Orchestrator Health</Typography>
              <Grid container spacing={3}>
                {[
                  { label: 'Orchestrator Health', value: orchDash.data.executiveSummary.orchestratorHealth },
                  { label: 'Execution Readiness', value: orchDash.data.executiveSummary.executionReadiness },
                  { label: 'Approval Risk', value: orchDash.data.executiveSummary.approvalRiskLevel },
                  { label: 'Confidence Assessment', value: orchDash.data.executiveSummary.confidenceAssessment },
                ].map(({ label, value }) => (
                  <Grid item xs={6} md={3} key={label}>
                    <Stack spacing={0.5}>
                      <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                        {label}
                      </Typography>
                      <Typography variant="body1" fontWeight={700}>{value ?? 'N/A'}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
              {orchDash.data.executiveSummary.executiveRecommendation && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    <strong>Recommendation: </strong>
                    {orchDash.data.executiveSummary.executiveRecommendation}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </GlassCard>
        )}
      </Stack>
    </>
  );
}
