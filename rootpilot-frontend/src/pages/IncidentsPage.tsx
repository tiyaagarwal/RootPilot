import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Chip,
  Drawer,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';

import { PageHeader } from '../components/common/PageHeader';
import { StatusPill } from '../components/common/StatusPill';
import { useUiStore } from '../store/uiStore';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { incidentService, changeService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import type { Incident } from '../types/backend';

export function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | '5XX' | '4XX'>('ALL');
  
  const { openCopilot } = useUiStore();

  // Load incidents list
  const incidentsQuery = usePlatformQuery(['incidents-list'], incidentService.list);

  // Queries for the selected incident detail drawer
  const replayQuery = usePlatformQuery(
    ['incident-replay', selectedIncident?.id],
    () => incidentService.replay(selectedIncident!.id),
    { enabled: !!selectedIncident }
  );

  const similarQuery = usePlatformQuery(
    ['incident-similar', selectedIncident?.id],
    () => incidentService.similar(selectedIncident!.id),
    { enabled: !!selectedIncident }
  );

  const narrativeQuery = usePlatformQuery(
    ['incident-narrative', selectedIncident?.id],
    () => changeService.narrative(selectedIncident!.id),
    { enabled: !!selectedIncident }
  );

  if (incidentsQuery.isLoading) return <LoadingState cards={2} />;
  if (incidentsQuery.isError) {
    return <ErrorState title="Incident Service Offline" refetch={() => incidentsQuery.refetch()} />;
  }

  const incidents = incidentsQuery.data || [];

  // Filter list
  const filteredIncidents = incidents.filter((inc) => {
    if (statusFilter === '5XX') return inc.statusCode >= 500;
    if (statusFilter === '4XX') return inc.statusCode >= 400 && inc.statusCode < 500;
    return true;
  });

  const getSeverity = (statusCode: number) => {
    return statusCode >= 500 ? 'CRITICAL' : 'WARNING';
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Triage queue"
        title="Incident Management"
        description="Real-time incident response. Triage active status exceptions, explore cascades, and consult Copilot."
      />

      <Stack spacing={2}>
        {/* Filters */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Button
            size="small"
            variant={statusFilter === 'ALL' ? 'contained' : 'outlined'}
            onClick={() => setStatusFilter('ALL')}
            sx={{ borderColor: '#242C3F', fontSize: '11px' }}
          >
            All Incidents ({incidents.length})
          </Button>
          <Button
            size="small"
            variant={statusFilter === '5XX' ? 'contained' : 'outlined'}
            color="error"
            onClick={() => setStatusFilter('5XX')}
            sx={{ fontSize: '11px' }}
          >
            5xx Server Errors ({incidents.filter((i) => i.statusCode >= 500).length})
          </Button>
          <Button
            size="small"
            variant={statusFilter === '4XX' ? 'contained' : 'outlined'}
            color="warning"
            onClick={() => setStatusFilter('4XX')}
            sx={{ fontSize: '11px' }}
          >
            4xx Client Errors ({incidents.filter((i) => i.statusCode >= 400 && i.statusCode < 500).length})
          </Button>
        </Stack>

        {/* Incidents Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {filteredIncidents.length > 0 ? (
              <Table className="compact-table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Service Name</TableCell>
                    <TableCell>Endpoint</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Latency</TableCell>
                    <TableCell>Exception</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredIncidents.map((inc) => (
                    <TableRow
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      selected={selectedIncident?.id === inc.id}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedIncident?.id === inc.id ? 'rgba(59, 130, 246, 0.05)' : 'inherit',
                      }}
                    >
                      <TableCell sx={{ fontFamily: 'var(--font-mono)', color: '#60A5FA', fontWeight: 650 }}>
                        #{inc.id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#E2E8F0' }}>{inc.serviceName}</TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{inc.endpoint}</TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)' }}>{inc.statusCode}</TableCell>
                      <TableCell>
                        <StatusPill value={getSeverity(inc.statusCode)} />
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)' }}>{inc.latency}ms</TableCell>
                      <TableCell sx={{ color: '#FCA5A5', fontWeight: 500 }}>{inc.exceptionType}</TableCell>
                      <TableCell sx={{ fontSize: '11px', color: 'text.secondary' }}>
                        {new Date(inc.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="No active incidents" description="No telemetry anomalies match the current search filters." />
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Incident Detail Slide-over Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', md: 540 },
            backgroundColor: '#0F121C',
            borderLeft: '1px solid #242C3F',
            p: 0,
          },
        }}
      >
        {selectedIncident && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
            {/* Drawer Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #242C3F', backgroundColor: '#151C2C' }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h4" sx={{ fontSize: '0.9rem', color: '#F1F5F9', fontWeight: 700 }}>
                  Incident #{selectedIncident.id} Triage
                </Typography>
                <Chip label={`v${selectedIncident.version}`} size="small" sx={{ height: 16, fontSize: '9px', bgcolor: '#2E394E' }} />
              </Stack>
              <IconButton size="small" onClick={() => setSelectedIncident(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Telemetry Snapshot Card */}
              <Card sx={{ border: '1px solid #242C3F', backgroundColor: '#111622' }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 700 }}>
                    Telemetry Snapshot
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">Service Name</Typography>
                      <Typography variant="body2" fontWeight={700} color="#E2E8F0">{selectedIncident.serviceName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">HTTP Status</Typography>
                      <Typography variant="body2" fontWeight={750} sx={{ fontFamily: 'var(--font-mono)', color: selectedIncident.statusCode >= 500 ? '#EF4444' : '#F59E0B' }}>
                        {selectedIncident.statusCode}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">API Endpoint</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{selectedIncident.endpoint}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">Latency Response</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'var(--font-mono)' }}>{selectedIncident.latency}ms</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Contextual Copilot Insight Block */}
              <Card sx={{ border: '1px solid rgba(59, 130, 246, 0.2)', backgroundColor: 'rgba(59, 130, 246, 0.03)' }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <SmartToyIcon color="primary" sx={{ fontSize: 16 }} />
                    <Typography variant="subtitle2" fontWeight={800} color="#60A5FA">
                      Copilot Automated Narrative
                    </Typography>
                  </Stack>
                  
                  {narrativeQuery.isLoading ? (
                    <Box sx={{ py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={12} />
                      <Typography variant="caption" color="text.secondary">Fetching narrative engine details...</Typography>
                    </Box>
                  ) : narrativeQuery.data ? (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#F1F5F9', mb: 1.5 }}>
                        {narrativeQuery.data.narrative}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Confidence:
                        </Typography>
                        <Chip
                          label={narrativeQuery.data.confidence}
                          size="small"
                          sx={{
                            height: 14,
                            fontSize: '8px',
                            fontWeight: 700,
                            bgcolor: narrativeQuery.data.confidence === 'HIGH' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: narrativeQuery.data.confidence === 'HIGH' ? '#10B981' : '#F59E0B',
                          }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openCopilot({
                            type: 'incident',
                            id: selectedIncident.id,
                            name: selectedIncident.exceptionType
                          })}
                          sx={{ ml: 'auto', fontSize: '10px', py: 0.1, px: 0.5, borderColor: '#242C3F' }}
                        >
                          Ask Copilot about resolution
                        </Button>
                      </Stack>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">Narrative resolution unavailable.</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Incident Timeline Replay */}
              <Box>
                <Typography variant="subtitle2" fontWeight={750} sx={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.04em', color: 'text.secondary', mb: 1.5 }}>
                  Incident Replay Timeline
                </Typography>
                
                {replayQuery.isLoading ? (
                  <CircularProgress size={16} sx={{ my: 1 }} />
                ) : replayQuery.data?.phases ? (
                  <Stack spacing={1.5} sx={{ pl: 1, borderLeft: '1px solid #242C3F', ml: 1 }}>
                    {replayQuery.data.phases.map((phase, idx) => (
                      <Box key={idx} sx={{ position: 'relative', pl: 1.5 }}>
                        {/* Dot indicator */}
                        <Box
                          sx={{
                            position: 'absolute',
                            left: -18,
                            top: 4,
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            backgroundColor: phase.severity === 'CRITICAL' ? '#EF4444' : phase.severity === 'WARNING' ? '#F59E0B' : '#3B82F6',
                            border: '2px solid #0F121C',
                          }}
                        />
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.25 }}>
                          <Typography variant="body2" fontWeight={700} sx={{ color: '#E2E8F0' }}>
                            {phase.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(phase.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontSize: '11px', color: 'text.secondary', mb: 0.5 }}>
                          {phase.description}
                        </Typography>
                        {phase.evidenceDetail && (
                          <Chip
                            label={`${phase.evidenceType}: ${phase.evidenceDetail}`}
                            size="small"
                            sx={{ height: 14, fontSize: '8px', bgcolor: '#1A2333', border: '1px solid #242C3F' }}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="caption" color="text.secondary">Replay timeline unavailable.</Typography>
                )}
              </Box>

              <Divider />

              {/* Similar Incidents */}
              <Box>
                <Typography variant="subtitle2" fontWeight={750} sx={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.04em', color: 'text.secondary', mb: 1.5 }}>
                  Similar Past Incidents (Operational Memory)
                </Typography>

                {similarQuery.isLoading ? (
                  <CircularProgress size={16} />
                ) : similarQuery.data && similarQuery.data.length > 0 ? (
                  <Stack spacing={1}>
                    {similarQuery.data.map((sim, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          p: 1.2,
                          backgroundColor: '#111622',
                          border: '1px solid #242C3F',
                          borderRadius: 0.5,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={700} color="#60A5FA">
                            Incident #{sim.incidentId}
                          </Typography>
                          <Typography variant="caption" fontWeight={700} color="#10B981">
                            {Math.round(sim.matchScore * 100)}% Similarity Match
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ fontSize: '11px', mb: 0.75, color: '#E2E8F0' }}>
                          {sim.serviceName} • {sim.exceptionType} (Status {sim.statusCode})
                        </Typography>
                        
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
                          {sim.matchFactors.map((fact, fIdx) => (
                            <Chip key={fIdx} label={fact} size="small" sx={{ height: 12, fontSize: '7px', bgcolor: 'rgba(59,130,246,0.08)' }} />
                          ))}
                        </Stack>

                        {sim.estimatedRecoveryPattern && (
                          <Typography variant="caption" sx={{ color: '#FBBF24', display: 'block', mt: 1, fontWeight: 600 }}>
                            Pattern: {sim.estimatedRecoveryPattern}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="caption" color="text.secondary">No matching historical incidents found.</Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
