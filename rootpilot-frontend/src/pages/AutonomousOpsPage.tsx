import React from 'react';
import { Box, Card, CardContent, CardHeader, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip, Stack, Button, IconButton } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import HealingIcon from '@mui/icons-material/Healing';
import SpeedIcon from '@mui/icons-material/Speed';
import BoltIcon from '@mui/icons-material/Bolt';

import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { StatusPill } from '../components/common/StatusPill';
import { useUiStore } from '../store/uiStore';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { autonomousService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';

export function AutonomousOpsPage() {
  const { openCopilot } = useUiStore();

  const readinessQuery = usePlatformQuery(['readiness-dashboard-page'], autonomousService.readinessDashboard);
  const actionsQuery = usePlatformQuery(['actions-list-page'], autonomousService.actions);
  const plansQuery = usePlatformQuery(['plans-list-page'], autonomousService.executionPlans);

  const isLoading = readinessQuery.isLoading || actionsQuery.isLoading || plansQuery.isLoading;

  if (isLoading) return <LoadingState cards={3} />;
  if (readinessQuery.isError) {
    return <ErrorState title="Autonomous Services Offline" refetch={() => readinessQuery.refetch()} />;
  }

  const read = readinessQuery.data;
  const actions = actionsQuery.data || [];
  const plans = plansQuery.data || [];

  return (
    <Box>
      <PageHeader
        eyebrow="autonomous engine"
        title="Autonomous Operations"
        description="Self-healing orchestration. Approve pending remediation plans, analyze platform readiness metrics, and audit execution logs."
      />

      <Stack spacing={2}>
        {/* KPI Readiness Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Automation Grade"
              value={read?.platformAutomationGrade || 'A-'}
              helper={`Risk Profile: ${read?.topAutomationRisk || 'LOW'}`}
              accent="#10B981"
              icon={<SpeedIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Ready Executions"
              value={read?.autonomousReadyCount || 0}
              helper={`Out of ${read?.totalRecommendations || 0} recommendations`}
              accent="#3B82F6"
              icon={<BoltIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Approval Required"
              value={read?.approvalRequiredCount || 0}
              helper="Remediations pending SRE sign-off"
              accent="#F59E0B"
              icon={<HealingIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Readiness Index"
              value={read?.overallAutomationReadinessScore || 90}
              suffix="%"
              helper={`Maturity: ${read?.automationMaturity || 'ADVANCED'}`}
              progress={read?.overallAutomationReadinessScore || 90}
              accent="#10B981"
            />
          </Grid>
        </Grid>

        {/* Remediations & Execution Plans */}
        <Grid container spacing={2}>
          {/* Action Log */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Remediation Execution Audit Log" />
              <CardContent sx={{ p: 0 }}>
                {actions.length > 0 ? (
                  <Table className="compact-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Action Type</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Trigger Source</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Recommended Action</TableCell>
                        <TableCell>Reason</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {actions.map((act, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontWeight: 700, color: '#E2E8F0' }}>
                            <Chip label={act.actionType} size="small" sx={{ borderRadius: 0.5, fontSize: '8px', height: 14 }} />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 650 }}>{act.serviceName}</TableCell>
                          <TableCell sx={{ fontSize: '11px', color: 'text.secondary' }}>{act.triggerSource}</TableCell>
                          <TableCell>
                            <Chip
                              label={act.status}
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '8px',
                                fontWeight: 800,
                                bgcolor: act.status === 'COMPLETED' || act.status === 'SUCCESS' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                color: act.status === 'COMPLETED' || act.status === 'SUCCESS' ? '#10B981' : '#3B82F6',
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#E2E8F0' }}>{act.recommendedAction}</TableCell>
                          <TableCell sx={{ fontSize: '11px', color: 'text.secondary' }}>{act.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <EmptyState title="No recorded actions" description="Autonomous engine has not executed any self-healing processes." />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Execution Plans */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Orchestrator Plans" />
              <CardContent sx={{ p: 0 }}>
                {plans.length > 0 ? (
                  <Stack spacing={0}>
                    {plans.map((plan, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1.5,
                          borderBottom: idx < plans.length - 1 ? '1px solid #242C3F' : 'none',
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={750} sx={{ color: '#E2E8F0' }}>
                            {plan.serviceName}
                          </Typography>
                          <Chip
                            label={plan.executionStatus}
                            size="small"
                            sx={{ height: 14, fontSize: '8px', bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}
                          />
                        </Stack>
                        <Typography variant="body2" sx={{ fontSize: '11px', color: 'text.secondary', mb: 1.2 }}>
                          {plan.recommendedAction}
                        </Typography>
                        
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            Strategy: <strong>{plan.executionStrategy}</strong>
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<SmartToyIcon sx={{ fontSize: 10 }} />}
                            onClick={() => openCopilot({
                              type: 'service',
                              name: plan.serviceName
                            })}
                            sx={{ fontSize: '9px', py: 0.1, px: 0.5, borderColor: '#242C3F' }}
                          >
                            Analyze Risk
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No execution plans ready.</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
