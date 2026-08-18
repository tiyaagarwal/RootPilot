import React from 'react';
import { Box, Card, CardContent, CardHeader, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow, LinearProgress, Stack, IconButton } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ComputerIcon from '@mui/icons-material/Computer';
import StorageIcon from '@mui/icons-material/Storage';
import HubIcon from '@mui/icons-material/Hub';

import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { StatusPill } from '../components/common/StatusPill';
import { useUiStore } from '../store/uiStore';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { infrastructureService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';
import { EmptyState } from '../components/feedback/EmptyState';

export function InfrastructurePage() {
  const { openCopilot } = useUiStore();

  const summaryQuery = usePlatformQuery(['infra-summary-page'], infrastructureService.summary);
  const hostsQuery = usePlatformQuery(['infra-hosts-page'], infrastructureService.hosts);

  const isLoading = summaryQuery.isLoading || hostsQuery.isLoading;

  if (isLoading) return <LoadingState cards={4} />;
  if (summaryQuery.isError) {
    return <ErrorState title="Infrastructure Services Offline" refetch={() => summaryQuery.refetch()} />;
  }

  const summary = summaryQuery.data;
  const hosts = hostsQuery.data || [];

  const getMetricColor = (val: number) => {
    if (val > 85) return '#EF4444'; // Red
    if (val > 70) return '#F59E0B'; // Amber
    return '#10B981'; // Green
  };

  return (
    <Box>
      <PageHeader
        eyebrow="infrastructure discovery"
        title="Physical & Virtual Resources"
        description="Monitor physical servers, virtual nodes, containers, and data stores running across the production environment."
      />

      <Stack spacing={2}>
        {/* KPI Inventory Grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Hosts Monitored"
              value={summary?.totalHosts || hosts.length}
              helper="Kubernetes nodes & physical VM hosts"
              accent="#3B82F6"
              icon={<ComputerIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Containers"
              value={summary?.totalContainers || 24}
              helper="Microservice docker containers"
              accent="#3B82F6"
              icon={<HubIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="Databases"
              value={summary?.totalDatabases || 2}
              helper="Postgres replicas & Redis caches"
              accent="#3B82F6"
              icon={<StorageIcon sx={{ fontSize: 16 }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              label="System Health Index"
              value={summary?.systemHealthIndex || 100}
              suffix="%"
              helper="Infrastructure node health score"
              progress={summary?.systemHealthIndex || 100}
              accent={(summary?.systemHealthIndex || 100) > 85 ? '#10B981' : '#F59E0B'}
            />
          </Grid>
        </Grid>

        {/* Hosts Table */}
        <Card>
          <CardHeader title="Hosts Catalog & Telemetry Saturation" />
          <CardContent sx={{ p: 0 }}>
            {hosts.length > 0 ? (
              <Table className="compact-table">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Hostname</TableCell>
                    <TableCell>IP Address</TableCell>
                    <TableCell>Operating System</TableCell>
                    <TableCell>CPU Usage</TableCell>
                    <TableCell>Memory Usage</TableCell>
                    <TableCell>Disk Capacity</TableCell>
                    <TableCell align="right">Diagnostic</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hosts.map((host) => (
                    <TableRow key={host.id}>
                      <TableCell>
                        <StatusPill value={host.status} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#E2E8F0' }}>{host.hostName}</TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)' }}>{host.ipAddress}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '11px' }}>{host.os}</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-mono)' }}>
                              {host.cpuUsage}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {host.cpuCores} Cores
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={host.cpuUsage}
                            sx={{
                              height: 3,
                              borderRadius: 0.5,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getMetricColor(host.cpuUsage),
                              },
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" sx={{ fontFamily: 'var(--font-mono)' }}>
                              {host.memoryUsage}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {host.totalMemoryGb} GB
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={host.memoryUsage}
                            sx={{
                              height: 3,
                              borderRadius: 0.5,
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getMetricColor(host.memoryUsage),
                              },
                            }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'var(--font-mono)' }}>{host.totalDiskGb} GB</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => openCopilot({
                            type: 'infrastructure',
                            name: host.hostName
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
              <EmptyState title="No active hosts" description="No VM nodes or hardware profiles mapped in the operational registry." />
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
