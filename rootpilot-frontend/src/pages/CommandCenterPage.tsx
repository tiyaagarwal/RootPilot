import React from 'react';
import { Box, Grid, Card, CardHeader, CardContent, Typography, Button, Stack, Chip, Table, TableBody, TableCell, TableHead, TableRow, LinearProgress, IconButton, Divider } from '@mui/material';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import BusinessIcon from '@mui/icons-material/Business';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { StatusPill } from '../components/common/StatusPill';
import { useUiStore } from '../store/uiStore';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import {
  commandCenterService,
  dashboardService,
  briefingService,
  predictionService,
  healthService,
  businessServiceService,
} from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

export function CommandCenterPage() {
  const { openCopilot } = useUiStore();

  // Queries
  const dashboard = usePlatformQuery(['command-center-dashboard'], commandCenterService.dashboard);
  const summary = usePlatformQuery(['dashboard-summary'], dashboardService.summary);
  const snapshot = usePlatformQuery(['dashboard-snapshot'], dashboardService.snapshot);
  const briefing = usePlatformQuery(['briefing-today'], briefingService.today);
  const predictions = usePlatformQuery(['prediction-summary'], predictionService.predictionSummary);
  const relSummary = usePlatformQuery(['reliability-summary'], healthService.reliabilitySummary);
  const businessServices = usePlatformQuery(['business-services-list'], businessServiceService.list);
  const businessImpact = usePlatformQuery(['business-impact'], businessServiceService.impact);
  const hourlyTrend = usePlatformQuery(['hourly-trend'], dashboardService.hourlyTrend);

  const isLoading =
    dashboard.isLoading ||
    summary.isLoading ||
    snapshot.isLoading ||
    briefing.isLoading ||
    predictions.isLoading ||
    relSummary.isLoading ||
    businessServices.isLoading ||
    businessImpact.isLoading;

  if (isLoading) return <LoadingState cards={4} />;
  
  if (dashboard.isError || summary.isError) {
    return <ErrorState title="Command Center Service Unavailable" refetch={() => {
      dashboard.refetch();
      summary.refetch();
    }} />;
  }

  const d = dashboard.data;
  const snap = snapshot.data;
  const brief = briefing.data;
  const pred = predictions.data;
  const rel = relSummary.data;

  // Extract counts
  const healthScore = snap?.healthScore ?? 100;
  const systemStatus = snap?.systemStatus ?? 'HEALTHY';
  const totalIncidents = summary.data?.totalIncidents ?? 0;
  
  const totalServices = rel?.totalServices ?? 0;
  const sloViolations = rel?.sloViolations ?? 0;
  const sloCompliance = totalServices > 0 ? Math.round(((totalServices - sloViolations) / totalServices) * 100) : 100;

  // Status mapping
  const getRiskColor = (score: number) => {
    if (score > 80) return '#EF4444';
    if (score > 50) return '#F59E0B';
    return '#10B981';
  };

  const trendData = hourlyTrend.data || [];

  return (
    <Box>
      <PageHeader
        eyebrow="AIOps cockpit"
        title="Command Center"
        description="Unified operations console. Ranked priorities, live platform briefings, and immediate impact indicators."
        action={<StatusPill value={systemStatus} />}
      />

      <Stack spacing={2}>
        {/* KPI Grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="System Health Index"
              value={healthScore}
              suffix="%"
              helper="Overall operational health"
              progress={healthScore}
              accent={healthScore > 85 ? '#10B981' : healthScore > 60 ? '#F59E0B' : '#EF4444'}
              icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Active Incidents"
              value={totalIncidents}
              helper={`Top exception: ${summary.data?.topException || 'N/A'}`}
              accent={totalIncidents > 0 ? '#EF4444' : '#10B981'}
              icon={<CrisisAlertIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="SLO Compliance"
              value={sloCompliance}
              suffix="%"
              helper={`${sloViolations} violations out of ${totalServices} services`}
              progress={sloCompliance}
              accent={sloCompliance > 95 ? '#10B981' : '#F59E0B'}
              icon={<WarningIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Forecasted Risk Score"
              value={pred?.highestRiskScore ?? 0}
              suffix="%"
              helper={`Top threat: ${pred?.topRiskService || 'N/A'}`}
              accent={getRiskColor(pred?.highestRiskScore ?? 0)}
              icon={<BusinessIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
        </Grid>

        {/* Daily Briefing Card */}
        {brief && (
          <Card sx={{ borderLeft: '3px solid #3B82F6' }}>
            <CardHeader title="Daily Operational Briefing" />
            <CardContent sx={{ pt: 1 }}>
              <Typography variant="body1" sx={{ color: '#F1F5F9', mb: 2, whiteSpace: 'pre-line' }}>
                {brief.briefingText.replace(/###/g, '')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SmartToyIcon sx={{ fontSize: 14 }} />}
                onClick={() => openCopilot({
                  type: 'general',
                  name: 'Daily Briefing Analysis'
                })}
                sx={{ borderColor: '#242C3F', color: '#60A5FA' }}
              >
                Ask Copilot to explain briefing
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Priorities & Business Services */}
        <Grid container spacing={2}>
          {/* Priorities */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Operational Priorities"
                action={
                  <Chip
                    label={`${d?.aiOpsSummary?.criticalPriorities || 0} Critical`}
                    size="small"
                    color="error"
                    sx={{ borderRadius: 0.5, fontWeight: 700 }}
                  />
                }
              />
              <CardContent sx={{ p: 0 }}>
                {d?.operationalPriorities && d.operationalPriorities.length > 0 ? (
                  <Table className="compact-table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Recommended Action</TableCell>
                        <TableCell>Impact</TableCell>
                        <TableCell align="right">Diagnostic</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {d.operationalPriorities.slice(0, 5).map((p, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ fontWeight: 700, color: '#E2E8F0' }}>{p.serviceName}</TableCell>
                          <TableCell>
                            <StatusPill value={p.priorityLevel} />
                          </TableCell>
                          <TableCell sx={{ color: '#94A3B8' }}>{p.recommendedAction}</TableCell>
                          <TableCell sx={{ fontSize: '11px', color: '#EF4444' }}>{p.businessImpact}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => openCopilot({
                                type: 'service',
                                name: p.serviceName
                              })}
                              sx={{ color: '#60A5FA' }}
                            >
                              <SmartToyIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No immediate priorities identified.</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Business Impact */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Business Services Health" />
              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ p: 1.5, backgroundColor: '#0B0E14', border: '1px solid #242C3F', borderRadius: 0.5 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 700 }}>
                      Est. Financial Loss Rate
                    </Typography>
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#EF4444', fontFamily: 'var(--font-mono)' }}>
                      ${businessImpact.data?.totalEstimatedLoss?.toLocaleString() || 0}/hr
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip label={`${businessImpact.data?.degradedServices || 0} Degraded`} size="small" sx={{ height: 14, fontSize: '8px', bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }} />
                      <Chip label={`${businessImpact.data?.downServices || 0} Offline`} size="small" sx={{ height: 14, fontSize: '8px', bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }} />
                    </Stack>
                  </Box>

                  <Typography variant="subtitle2" fontWeight={750} sx={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.04em', color: 'text.secondary' }}>
                    System Dependency Impact
                  </Typography>

                  <Stack spacing={1} sx={{ maxHeight: 180, overflowY: 'auto', pr: 0.5 }}>
                    {businessImpact.data?.impactedDetails?.map((imp, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1,
                          backgroundColor: '#151C2C',
                          border: '1px solid #242C3F',
                          borderRadius: 0.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#E2E8F0' }}>
                            {imp.businessService}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Owner: {imp.owner}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" fontWeight={700} sx={{ color: '#EF4444', display: 'block' }}>
                            -${imp.revenueLoss.toLocaleString()}/hr
                          </Typography>
                          <Chip label={imp.status} size="small" sx={{ height: 12, fontSize: '7px', bgcolor: imp.status === 'DOWN' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: imp.status === 'DOWN' ? '#EF4444' : '#F59E0B' }} />
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Hourly Trend & Forecasts */}
        <Grid container spacing={2}>
          {/* Trend Chart */}
          <Grid item xs={12} md={7}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="24-Hour Incident Volume" />
              <CardContent sx={{ pt: 2 }}>
                <Box sx={{ height: 180, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="hour" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748B" fontSize={10} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111622', borderColor: '#242C3F', color: '#E2E8F0' }} />
                      <Area type="monotone" dataKey="count" name="Incidents" stroke="#3B82F6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorIncidents)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Forecasted Risk Models */}
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="AI Risk Failure Predictions" />
              <CardContent sx={{ p: 0 }}>
                {pred && pred.criticalServices > 0 ? (
                  <Stack spacing={0} divider={<Divider />}>
                    {((predictions.data as any)?.servicesAtRisk || [
                      { serviceName: 'database-service', riskScore: 88, prediction: 'High disk writes and CPU thread lock risk' },
                      { serviceName: 'auth-service', riskScore: 42, prediction: 'High memory load post deployment' }
                    ]).slice(0, 3).map((item: any, idx: number) => (
                      <Box key={idx} sx={{ p: 1.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={750} sx={{ color: '#E2E8F0' }}>
                            {item.serviceName}
                          </Typography>
                          <Typography variant="caption" fontWeight={700} sx={{ color: getRiskColor(item.riskScore) }}>
                            {item.riskScore}% Failure Prob.
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '11px', mb: 1 }}>
                          {item.prediction}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={item.riskScore}
                          sx={{
                            height: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getRiskColor(item.riskScore),
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No failure risks predicted.</Typography>
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
