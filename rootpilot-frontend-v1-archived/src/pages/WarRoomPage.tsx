import { useState, useMemo } from 'react';
import {
  Box,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  alpha,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TimelineIcon from '@mui/icons-material/Timeline';
import HubIcon from '@mui/icons-material/Hub';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/common/PageHeader';
import { GlassCard } from '../components/common/GlassCard';
import { StatusPill } from '../components/common/StatusPill';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  incidentService,
  rootCauseService,
  correlationService,
} from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import type { Incident } from '../types/backend';

function deriveSeverity(code: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  if (code >= 500) return 'HIGH';
  if (code >= 400) return 'MEDIUM';
  return 'LOW';
}

const SEV_COLOR: Record<string, string> = {
  HIGH: '#EF4444',
  MEDIUM: '#F59E0B',
  LOW: '#10B981',
};

interface TimelineEvent {
  icon: React.ReactNode;
  title: string;
  detail: string;
  time: string;
  severity: string;
}

function buildTimeline(incident: Incident, rcaCount: number, correlationCount: number): TimelineEvent[] {
  const ts = new Date(incident.timestamp);
  const events: TimelineEvent[] = [
    {
      icon: <WarningAmberIcon />,
      title: 'Incident Detected',
      detail: `${incident.exceptionType} on ${incident.endpoint} — HTTP ${incident.statusCode}`,
      time: ts.toLocaleTimeString(),
      severity: deriveSeverity(incident.statusCode),
    },
    {
      icon: <TimelineIcon />,
      title: 'Latency Spike Captured',
      detail: `Response latency recorded at ${incident.latency}ms — threshold exceeded`,
      time: new Date(ts.getTime() + 30000).toLocaleTimeString(),
      severity: incident.latency > 2000 ? 'HIGH' : 'MEDIUM',
    },
    {
      icon: <HubIcon />,
      title: 'Correlation Engine Triggered',
      detail: `${correlationCount} service correlation(s) evaluated by RootPilot`,
      time: new Date(ts.getTime() + 60000).toLocaleTimeString(),
      severity: 'MEDIUM',
    },
    {
      icon: <PsychologyIcon />,
      title: 'Root Cause Analysis Complete',
      detail: rcaCount > 0
        ? `${rcaCount} recommendation(s) generated for ${incident.serviceName}`
        : 'No RCA match found in the current recommendation window',
      time: new Date(ts.getTime() + 90000).toLocaleTimeString(),
      severity: rcaCount > 0 ? 'LOW' : 'MEDIUM',
    },
    {
      icon: <CheckCircleOutlineIcon />,
      title: 'Remediation Candidates Queued',
      detail: 'Autonomous remediation plan is available for operator review',
      time: new Date(ts.getTime() + 120000).toLocaleTimeString(),
      severity: 'LOW',
    },
  ];
  return events;
}

export function WarRoomPage() {
  useDocumentTitle('War Room');
  const incidents = usePlatformQuery(['war-room-incidents'], incidentService.list);
  const rca = usePlatformQuery(['war-room-rca'], rootCauseService.recommendations);
  const correlations = usePlatformQuery(['war-room-correlations'], correlationService.recentCorrelations);

  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [tab, setTab] = useState(0);

  const criticalIncidents = useMemo(
    () => (incidents.data ?? []).filter((i) => i.statusCode >= 500),
    [incidents.data],
  );

  const selectedIncident = useMemo(
    () => (incidents.data ?? []).find((i) => i.id === selectedId) ?? null,
    [incidents.data, selectedId],
  );

  const selectedRcas = useMemo(
    () => (rca.data ?? []).filter((r) => r.serviceName === selectedIncident?.serviceName),
    [rca.data, selectedIncident],
  );

  const correlationCount = useMemo(
    () => (correlations.data ?? []).filter((c) => {
      const s1 = c['service1'] as string | undefined;
      const s2 = c['service2'] as string | undefined;
      return s1 === selectedIncident?.serviceName || s2 === selectedIncident?.serviceName;
    }).length,
    [correlations.data, selectedIncident],
  );

  const timeline = useMemo(
    () => selectedIncident ? buildTimeline(selectedIncident, selectedRcas.length, correlationCount) : [],
    [selectedIncident, selectedRcas.length, correlationCount],
  );

  const isLoading = incidents.isLoading || rca.isLoading;

  if (isLoading) return <LoadingState cards={4} />;
  if (incidents.isError) {
    return (
      <ErrorState
        queryKey={['war-room-incidents']}
        title="War Room Unavailable"
        description="Cannot load incident data. Verify the backend is running."
      />
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Incident Command"
        title="War Room"
        description="Unified incident command center — real-time chronology, correlation evidence, and AI-driven root cause analysis."
        action={
          <StatusPill
            value={criticalIncidents.length > 0 ? `${criticalIncidents.length} CRITICAL` : 'NO CRITICAL'}
          />
        }
      />

      <Grid container spacing={2.5}>
        {/* Left: Incident Selector + Critical List */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={2}>
            {/* Incident Selector */}
            <GlassCard glow="#EF4444">
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="overline" color="text.secondary" gutterBottom>
                  Select Active Incident
                </Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value as number)}
                  sx={{ mt: 1 }}
                >
                  <MenuItem value="">
                    <Typography color="text.disabled">— Select an incident —</Typography>
                  </MenuItem>
                  {criticalIncidents.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <RadioButtonCheckedIcon fontSize="small" sx={{ color: '#EF4444' }} />
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            #{i.id} — {i.serviceName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {i.exceptionType} · HTTP {i.statusCode}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>

                {criticalIncidents.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No critical incidents (5xx) in the current data window.
                  </Typography>
                )}
              </CardContent>
            </GlassCard>

            {/* Critical Incidents List */}
            {criticalIncidents.length === 0 ? (
              <EmptyState
                title="No Critical Incidents"
                description="All services are operating within normal parameters."
                compact
              />
            ) : (
              criticalIncidents.slice(0, 8).map((i) => (
                <motion.div
                  key={i.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => { setSelectedId(i.id); setTab(0); }}
                  style={{ cursor: 'pointer' }}
                >
                  <GlassCard glow={i.id === selectedId ? '#EF4444' : undefined}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1} minWidth={0}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" fontWeight={700} color="primary.main">
                              #{i.id}
                            </Typography>
                            <Chip
                              label={deriveSeverity(i.statusCode)}
                              size="small"
                              sx={{
                                bgcolor: alpha(SEV_COLOR[deriveSeverity(i.statusCode)], 0.12),
                                color: SEV_COLOR[deriveSeverity(i.statusCode)],
                                fontWeight: 700,
                                fontSize: '0.68rem',
                              }}
                            />
                          </Stack>
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {i.serviceName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {i.exceptionType}
                          </Typography>
                        </Box>
                        <Box textAlign="right" flexShrink={0}>
                          <Typography variant="caption" color="text.disabled">
                            HTTP {i.statusCode}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.disabled">
                            {i.latency}ms
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </Stack>
        </Grid>

        {/* Right: War Room Detail Panel */}
        <Grid item xs={12} lg={8}>
          {!selectedIncident ? (
            <GlassCard sx={{ height: '100%', minHeight: 400 }}>
              <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState
                  title="Select an Incident"
                  description="Choose a critical incident from the left panel to open the War Room command view."
                  compact
                />
              </CardContent>
            </GlassCard>
          ) : (
            <Stack spacing={2}>
              {/* Incident Header */}
              <GlassCard glow={SEV_COLOR[deriveSeverity(selectedIncident.statusCode)]}>
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="h5" fontWeight={800}>
                          Incident #{selectedIncident.id}
                        </Typography>
                        <StatusPill value={deriveSeverity(selectedIncident.statusCode)} />
                      </Stack>
                      <Typography color="text.secondary" variant="body2">
                        {selectedIncident.serviceName} · {selectedIncident.endpoint} · {selectedIncident.version}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {new Date(selectedIncident.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                    <Stack spacing={1} alignItems="flex-end">
                      <Chip
                        label={`${selectedIncident.latency}ms latency`}
                        size="small"
                        color={selectedIncident.latency > 2000 ? 'error' : 'warning'}
                        sx={{ fontWeight: 700 }}
                      />
                      <Chip
                        label={`HTTP ${selectedIncident.statusCode}`}
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>
                  </Stack>

                  {/* Quick metrics row */}
                  <Grid container spacing={2} sx={{ mt: 1.5 }}>
                    {[
                      ['Exception', selectedIncident.exceptionType],
                      ['Endpoint', selectedIncident.endpoint],
                      ['Version', selectedIncident.version ?? 'N/A'],
                      ['RCA Matches', String(selectedRcas.length)],
                    ].map(([k, v]) => (
                      <Grid item xs={6} sm={3} key={k}>
                        <Box>
                          <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {k}
                          </Typography>
                          <Typography variant="body2" fontWeight={700} noWrap>
                            {v}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </GlassCard>

              {/* Tab Panel */}
              <GlassCard>
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  sx={{ px: 2, pt: 1, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <Tab label="Event Timeline" />
                  <Tab label="Root Cause Analysis" />
                  <Tab label="Correlation Evidence" />
                </Tabs>

                <CardContent sx={{ p: 2.5 }}>
                  {/* Tab 0: Timeline */}
                  {tab === 0 && (
                    <Stack spacing={0}>
                      {timeline.map((event, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08 }}
                        >
                          <Stack direction="row" spacing={2}>
                            {/* Timeline stem */}
                            <Stack alignItems="center" sx={{ width: 36, flexShrink: 0 }}>
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  display: 'grid',
                                  placeItems: 'center',
                                  bgcolor: alpha(SEV_COLOR[event.severity] ?? '#6366F1', 0.12),
                                  color: SEV_COLOR[event.severity] ?? '#6366F1',
                                  flexShrink: 0,
                                  '& svg': { fontSize: 18 },
                                }}
                              >
                                {event.icon}
                              </Box>
                              {idx < timeline.length - 1 && (
                                <Box sx={{ width: 2, flex: 1, bgcolor: 'divider', my: 0.5 }} />
                              )}
                            </Stack>

                            {/* Content */}
                            <Box pb={idx < timeline.length - 1 ? 2.5 : 0}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Typography variant="body2" fontWeight={700}>
                                  {event.title}
                                </Typography>
                                <Chip
                                  label={event.severity}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(SEV_COLOR[event.severity] ?? '#6366F1', 0.1),
                                    color: SEV_COLOR[event.severity] ?? '#6366F1',
                                    fontWeight: 700,
                                    fontSize: '0.65rem',
                                  }}
                                />
                              </Stack>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {event.detail}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                {event.time}
                              </Typography>
                            </Box>
                          </Stack>
                        </motion.div>
                      ))}
                    </Stack>
                  )}

                  {/* Tab 1: RCA */}
                  {tab === 1 && (
                    <Stack spacing={2}>
                      {selectedRcas.length === 0 ? (
                        <EmptyState
                          title="No RCA Recommendations"
                          description={`No root cause recommendations found for service "${selectedIncident.serviceName}" in the current data window.`}
                          compact
                        />
                      ) : (
                        selectedRcas.map((r, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                          >
                            <GlassCard glow={SEV_COLOR[r.riskLevel] ?? '#6366F1'}>
                              <CardContent sx={{ p: 2 }}>
                                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                  <Box flex={1}>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                                      <StatusPill value={r.riskLevel} />
                                      <Typography variant="caption" color="text.secondary">
                                        {r.serviceName}
                                      </Typography>
                                    </Stack>
                                    <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                                      {r.recommendation}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {r.reason}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </CardContent>
                            </GlassCard>
                          </motion.div>
                        ))
                      )}
                    </Stack>
                  )}

                  {/* Tab 2: Correlation */}
                  {tab === 2 && (
                    <Stack spacing={2}>
                      {correlationCount === 0 ? (
                        <EmptyState
                          title="No Correlations Found"
                          description={`No correlated service dependencies detected for "${selectedIncident.serviceName}".`}
                          compact
                        />
                      ) : (
                        (correlations.data ?? [])
                          .filter((c) => {
                            const s1 = c['service1'] as string | undefined;
                            const s2 = c['service2'] as string | undefined;
                            return s1 === selectedIncident.serviceName || s2 === selectedIncident.serviceName;
                          })
                          .slice(0, 10)
                          .map((c, i) => {
                            const s1 = c['service1'] as string ?? 'Unknown';
                            const s2 = c['service2'] as string ?? 'Unknown';
                            const score = c['correlationScore'] as number | undefined;
                            const corrType = c['correlationType'] as string | undefined;
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                              >
                                <GlassCard>
                                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <Box>
                                        <Typography variant="body2" fontWeight={700}>
                                          {s1} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>⟷</Box> {s2}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Correlation: {corrType ?? 'SERVICE_DEPENDENCY'}
                                        </Typography>
                                      </Box>
                                      {score !== undefined && (
                                        <Chip
                                          label={`${Math.round(score * 100)}%`}
                                          size="small"
                                          color="primary"
                                          variant="outlined"
                                          sx={{ fontWeight: 700 }}
                                        />
                                      )}
                                    </Stack>
                                    {score !== undefined && (
                                      <LinearProgress
                                        variant="determinate"
                                        value={score * 100}
                                        sx={{ mt: 1, height: 4, borderRadius: 2, bgcolor: 'action.hover' }}
                                      />
                                    )}
                                  </CardContent>
                                </GlassCard>
                              </motion.div>
                            );
                          })
                      )}
                    </Stack>
                  )}
                </CardContent>
              </GlassCard>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
}
