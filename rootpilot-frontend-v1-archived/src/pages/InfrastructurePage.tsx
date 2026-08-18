import { useState } from 'react';
import { Grid, Stack, Typography, Tab, Tabs, Box, CardContent, LinearProgress, Chip } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import ComputerIcon from '@mui/icons-material/Computer';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import DatabaseIcon from '@mui/icons-material/Storage';
import HubIcon from '@mui/icons-material/Hub';
import { PageHeader } from '../components/common/PageHeader';
import { KpiCard } from '../components/common/KpiCard';
import { SortableTable } from '../components/common/SortableTable';
import { GlassCard } from '../components/common/GlassCard';
import { ServiceGraph } from '../components/graphs/ServiceGraph';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { infrastructureService } from '../services/platformServices';
import { LoadingState } from '../components/feedback/LoadingState';
import { ErrorState } from '../components/feedback/ErrorState';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`infra-tabpanel-${index}`}
      aria-labelledby={`infra-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function InfrastructurePage() {
  useDocumentTitle('Infrastructure');
  const [tabValue, setTabValue] = useState(0);

  const summary = usePlatformQuery(['infra-summary'], infrastructureService.summary);
  const hosts = usePlatformQuery(['infra-hosts'], infrastructureService.hosts);
  const services = usePlatformQuery(['infra-services'], infrastructureService.services);
  const dependencies = usePlatformQuery(['infra-deps'], infrastructureService.dependencies);

  if (summary.isLoading || hosts.isLoading || services.isLoading || dependencies.isLoading) {
    return <LoadingState cards={4} />;
  }

  if (summary.isError || hosts.isError || services.isError || dependencies.isError) {
    return <ErrorState queryKey={['infra-summary']} title="Infrastructure Data Offline" />;
  }

  const s = summary.data;
  const hList = hosts.data ?? [];
  const sList = services.data ?? [];
  const dList = dependencies.data ?? [];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Map infrastructure dependencies to ServiceDependency structure for ServiceGraph
  const serviceDepsForGraph = dList.map(dep => ({
    sourceService: dep.sourceName,
    targetService: dep.targetName,
    dependencyCount: Math.round(dep.confidenceScore)
  }));

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="Auto-Discovered Infrastructure Inventory"
        description="Real-time map and list of all server hosts, running microservices, databases, queues, and APIs discovered automatically from OpenTelemetry traces and agent metrics."
      />

      <Stack spacing={2.5}>
        {/* Summary KPIs */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={4}>
            <KpiCard
              label="System Health Index"
              value={s?.systemHealthIndex ?? 100.0}
              suffix="%"
              helper="Discovered nodes operational"
              progress={s?.systemHealthIndex}
              icon={<StorageIcon />}
              accent="#10B981"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <KpiCard
              label="Active Hosts"
              value={s?.totalHosts ?? 0}
              helper="Otel/Agent monitored servers"
              accent="#2563EB"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <KpiCard
              label="Discovered Services"
              value={s?.totalServices ?? 0}
              helper="Application microservices"
              accent="#3B82F6"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <KpiCard
              label="Databases"
              value={s?.totalDatabases ?? 0}
              helper="Dynamic DB instances"
              accent="#8B5CF6"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <KpiCard
              label="Message Brokers"
              value={s?.totalMessageBrokers ?? 0}
              helper="RabbitMQ/Kafka brokers"
              accent="#F59E0B"
            />
          </Grid>
        </Grid>

        {/* Tabbed content */}
        <GlassCard>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Infrastructure sections"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab icon={<ComputerIcon />} iconPosition="start" label="Hosts" />
                <Tab icon={<SettingsInputComponentIcon />} iconPosition="start" label="Services" />
                <Tab icon={<HubIcon />} iconPosition="start" label="Discovered Topology" />
              </Tabs>
            </Box>

            {/* Hosts Tab */}
            <CustomTabPanel value={tabValue} index={0}>
              <SortableTable
                title="Monitored Server Hosts"
                rows={hList.map(h => ({
                  ...h,
                  cpuDisplay: (
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={h.cpuUsage} color={h.cpuUsage > 90 ? 'error' : h.cpuUsage > 75 ? 'warning' : 'success'} />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{h.cpuUsage}%</Typography>
                      </Box>
                    </Box>
                  ),
                  memDisplay: (
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={h.memoryUsage} color={h.memoryUsage > 90 ? 'error' : h.memoryUsage > 75 ? 'warning' : 'success'} />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{h.memoryUsage}%</Typography>
                      </Box>
                    </Box>
                  ),
                  statusDisplay: (
                    <Chip
                      label={h.status}
                      size="small"
                      color={h.status === 'HEALTHY' ? 'success' : h.status === 'WARNING' ? 'warning' : 'error'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  )
                }))}
                columns={[
                  { key: 'hostName', label: 'Host Name' },
                  { key: 'ipAddress', label: 'IP Address' },
                  { key: 'os', label: 'Operating System' },
                  { key: 'cpuCores', label: 'CPU Cores', numeric: true },
                  { key: 'cpuDisplay', label: 'CPU Usage' },
                  { key: 'memDisplay', label: 'Memory Usage' },
                  { key: 'statusDisplay', label: 'Status' }
                ]}
                defaultSort="hostName"
              />
            </CustomTabPanel>

            {/* Services Tab */}
            <CustomTabPanel value={tabValue} index={1}>
              <SortableTable
                title="Running Applications & Services"
                rows={sList.map(srv => ({
                  ...srv,
                  statusDisplay: (
                    <Chip
                      label={srv.status}
                      size="small"
                      color={srv.status === 'HEALTHY' ? 'success' : srv.status === 'DEGRADED' ? 'warning' : 'error'}
                      sx={{ fontWeight: 'bold' }}
                    />
                  ),
                  techDisplay: (
                    <Chip
                      label={srv.type}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  )
                }))}
                columns={[
                  { key: 'serviceName', label: 'Service' },
                  { key: 'techDisplay', label: 'Type' },
                  { key: 'hostName', label: 'Host Hostname' },
                  { key: 'containerName', label: 'Container/Namespace' },
                  { key: 'statusDisplay', label: 'Status' }
                ]}
                defaultSort="serviceName"
              />
            </CustomTabPanel>

            {/* Topology Map Tab */}
            <CustomTabPanel value={tabValue} index={2}>
              <Grid container spacing={3.2}>
                <Grid item xs={12} lg={8}>
                  <ServiceGraph
                    title="Interactive Infrastructure Map"
                    dependencies={serviceDepsForGraph}
                    mode="dependency"
                  />
                </Grid>
                <Grid item xs={12} lg={4}>
                  <SortableTable
                    title="Discovered Dependencies"
                    rows={dList.map(dep => ({
                      ...dep,
                      confidenceDisplay: (
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: dep.confidenceScore > 90 ? '#10B981' : dep.confidenceScore > 75 ? '#F59E0B' : '#6B7280' }}>
                          {dep.confidenceScore}%
                        </Typography>
                      )
                    }))}
                    columns={[
                      { key: 'sourceName', label: 'Source' },
                      { key: 'targetName', label: 'Target' },
                      { key: 'relationshipType', label: 'Link Type' },
                      { key: 'confidenceDisplay', label: 'Confidence' }
                    ]}
                    defaultSort="confidenceScore"
                  />
                </Grid>
              </Grid>
            </CustomTabPanel>
          </CardContent>
        </GlassCard>
      </Stack>
    </>
  );
}
