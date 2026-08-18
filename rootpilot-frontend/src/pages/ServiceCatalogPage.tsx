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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { PageHeader } from '../components/common/PageHeader';
import { StatusPill } from '../components/common/StatusPill';
import { useUiStore } from '../store/uiStore';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { healthService, changeService, timelineService, infrastructureService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';
import type { ServiceReliability } from '../types/backend';

export function ServiceCatalogPage() {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  
  const { openCopilot } = useUiStore();

  // Load services list
  const reliabilityQuery = usePlatformQuery(['services-reliability'], healthService.reliability);
  const inventoryQuery = usePlatformQuery(['services-inventory'], infrastructureService.services);

  // Queries for the selected service detail drawer
  const timelineQuery = usePlatformQuery(
    ['service-timeline', selectedService?.serviceName],
    () => timelineService.get('7d', selectedService!.serviceName),
    { enabled: !!selectedService }
  );

  const narrativeQuery = usePlatformQuery(
    ['service-narrative', selectedService?.serviceName],
    () => changeService.serviceNarrative(selectedService!.serviceName),
    { enabled: !!selectedService }
  );

  const changesQuery = usePlatformQuery(
    ['service-changes', selectedService?.serviceName],
    () => changeService.recent(48), // fetch changes from past 48 hours
    { enabled: !!selectedService }
  );

  if (reliabilityQuery.isLoading || inventoryQuery.isLoading) return <LoadingState cards={3} />;
  if (reliabilityQuery.isError) {
    return <ErrorState title="Service Intelligence Service Offline" refetch={() => reliabilityQuery.refetch()} />;
  }

  const services = reliabilityQuery.data || [];
  const inventory = inventoryQuery.data || [];

  // Match reliability with inventory details
  const serviceCatalog = services.map((rel) => {
    const inv = inventory.find((item) => item.serviceName === rel.serviceName);
    return {
      ...rel,
      type: inv?.type || 'SpringBoot',
      status: inv?.status || 'HEALTHY',
      hostName: inv?.hostName || 'prod-api-01',
      containerName: inv?.containerName || 'N/A',
    };
  });

  return (
    <Box>
      <PageHeader
        eyebrow="service catalog"
        title="Service Intelligence"
        description="Comprehensive microservices registry. Monitor service ownership, track availability percentages, and evaluate SLO targets."
      />

      <Stack spacing={2}>
        <Card>
          <CardContent sx={{ p: 0 }}>
            {serviceCatalog.length > 0 ? (
              <Table className="compact-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Service Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Active Incidents</TableCell>
                    <TableCell>Reliability Score</TableCell>
                    <TableCell>Availability</TableCell>
                    <TableCell>SLO Status</TableCell>
                    <TableCell>Host Node</TableCell>
                    <TableCell>Container</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceCatalog.map((svc, idx) => (
                    <TableRow
                      key={idx}
                      onClick={() => setSelectedService(svc)}
                      selected={selectedService?.serviceName === svc.serviceName}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedService?.serviceName === svc.serviceName ? 'rgba(59, 130, 246, 0.05)' : 'inherit',
                      }}
                    >
                      <TableCell>
                        <StatusPill value={svc.status} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#E2E8F0' }}>{svc.serviceName}</TableCell>
                      <TableCell>{svc.type}</TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)' }}>{svc.incidentCount}</TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)', fontWeight: 650, color: svc.reliabilityScore && svc.reliabilityScore > 80 ? '#10B981' : '#F59E0B' }}>
                        {svc.reliabilityScore || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)' }}>{svc.availabilityPercentage?.toFixed(2)}%</TableCell>
                      <TableCell>
                        <Chip
                          label={svc.sloStatus}
                          size="small"
                          sx={{
                            borderRadius: 0.5,
                            fontSize: '9px',
                            fontWeight: 700,
                            bgcolor: svc.sloStatus === 'COMPLIANT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: svc.sloStatus === 'COMPLIANT' ? '#10B981' : '#EF4444',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'text.secondary' }}>{svc.hostName}</TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'text.secondary' }}>{svc.containerName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyState title="No monitored services" description="No active microservices registered in the operational database." />
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Service Profile Slide-over Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', md: 540 },
            backgroundColor: '#0F121C',
            borderLeft: '1px solid #242C3F',
            p: 0,
          },
        }}
      >
        {selectedService && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #242C3F', backgroundColor: '#151C2C' }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h4" sx={{ fontSize: '0.9rem', color: '#F1F5F9', fontWeight: 700 }}>
                  Service Profile: {selectedService.serviceName}
                </Typography>
                <StatusPill value={selectedService.status} />
              </Stack>
              <IconButton size="small" onClick={() => setSelectedService(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Reliability timeline (Grid of availability blocks) */}
              <Box>
                <Typography variant="subtitle2" fontWeight={750} sx={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.04em', color: 'text.secondary', mb: 1 }}>
                  7-Day Availability timeline (SLA Buckets)
                </Typography>
                
                {timelineQuery.isLoading ? (
                  <CircularProgress size={16} />
                ) : timelineQuery.data && timelineQuery.data.length > 0 ? (
                  <Box>
                    <Stack direction="row" spacing={0.5} sx={{ width: '100%', mb: 1 }}>
                      {timelineQuery.data.map((bucket, idx) => {
                        let bg = '#10B981'; // Green
                        if (bucket.status === 'DEGRADED') bg = '#F59E0B'; // Amber
                        if (bucket.status === 'CRITICAL') bg = '#EF4444'; // Red
                        return (
                          <Box
                            key={idx}
                            sx={{
                              flex: 1,
                              height: 24,
                              backgroundColor: bg,
                              borderRadius: 0.5,
                              cursor: 'pointer',
                            }}
                            title={`Incidents: ${bucket.incidentCount}`}
                          />
                        );
                      })}
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">7d ago</Typography>
                      <Typography variant="caption" color="text.secondary">Present</Typography>
                    </Stack>
                  </Box>
                ) : (
                  <Typography variant="caption" color="text.secondary">No availability buckets recorded.</Typography>
                )}
              </Box>

              {/* Narrative block */}
              <Card sx={{ border: '1px solid rgba(59, 130, 246, 0.2)', backgroundColor: 'rgba(59, 130, 246, 0.03)' }}>
                <CardContent sx={{ p: 1.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <SmartToyIcon color="primary" sx={{ fontSize: 16 }} />
                    <Typography variant="subtitle2" fontWeight={800} color="#60A5FA">
                      Service Narrative Report
                    </Typography>
                  </Stack>
                  {narrativeQuery.isLoading ? (
                    <CircularProgress size={12} />
                  ) : narrativeQuery.data ? (
                    <Box>
                      <Typography variant="body2" sx={{ color: '#F1F5F9', mb: 1.5 }}>
                        {narrativeQuery.data.narrative}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={`Confidence: ${narrativeQuery.data.confidence}`}
                          size="small"
                          sx={{ height: 14, fontSize: '8px', bgcolor: '#1A2333' }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => openCopilot({
                            type: 'service',
                            name: selectedService.serviceName
                          })}
                          sx={{ fontSize: '10px', py: 0.1, px: 0.5, borderColor: '#242C3F' }}
                        >
                          Triage with Copilot
                        </Button>
                      </Stack>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">Narrative report unavailable.</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Recent Change Events */}
              <Box>
                <Typography variant="subtitle2" fontWeight={750} sx={{ textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.04em', color: 'text.secondary', mb: 1.5 }}>
                  Recent Changes (Past 48 Hours)
                </Typography>

                {changesQuery.isLoading ? (
                  <CircularProgress size={16} />
                ) : changesQuery.data ? (
                  (() => {
                    const filteredChanges = changesQuery.data.filter((ch) => ch.serviceName === selectedService.serviceName);
                    return filteredChanges.length > 0 ? (
                      <Stack spacing={1}>
                        {filteredChanges.map((ch, idx) => (
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
                              <Chip
                                label={ch.changeType}
                                size="small"
                                sx={{
                                  height: 12,
                                  fontSize: '7px',
                                  bgcolor: ch.changeType === 'CONFIG_CHANGE' ? 'rgba(168,85,247,0.1)' : 'rgba(59,130,246,0.1)',
                                  color: ch.changeType === 'CONFIG_CHANGE' ? '#A855F7' : '#3B82F6',
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(ch.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ fontSize: '11px', color: '#E2E8F0', mb: 0.5 }}>
                              {ch.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Engineer: {ch.changedBy}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">No changes recorded in the past 48 hours.</Typography>
                    );
                  })()
                ) : (
                  <Typography variant="caption" color="text.secondary">Change log unavailable.</Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
