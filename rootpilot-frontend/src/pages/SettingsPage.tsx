import React from 'react';
import { CardContent, CardHeader, Card, Grid, Stack, Typography, Box, Divider, Chip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LinkIcon from '@mui/icons-material/Link';

import { PageHeader } from '../components/common/PageHeader';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dashboardService } from '../services/platformServices';
import { API_BASE_URL } from '../api/client';
import { useAuth } from '../context/AuthContext';

const INTEGRATIONS = [
  { name: 'PagerDuty', status: 'stub', color: '#06BE49', description: 'Incident alerting & on-call routing' },
  { name: 'Jira', status: 'stub', color: '#0052CC', description: 'Automated ticket creation from incidents' },
  { name: 'Slack', status: 'stub', color: '#4A154B', description: 'Real-time notifications & runbook prompts' },
  { name: 'OpenTelemetry', status: 'active', color: '#F5A800', description: 'Telemetry ingestion via /api/telemetry/**' },
  { name: 'GitHub Actions', status: 'stub', color: '#24292F', description: 'CI/CD pipeline trigger on remediation' },
  { name: 'Datadog', status: 'stub', color: '#632CA6', description: 'Metrics export and cross-platform correlation' },
];

const ENDPOINTS = [
  ['Incidents', 'GET /incidents'],
  ['Dashboard Summary', 'GET /analysis/dashboard'],
  ['Dashboard Snapshot', 'GET /analysis/dashboard-snapshot'],
  ['Correlations', 'GET /analysis/correlations'],
  ['RCA Recommendations', 'GET /analysis/recommendations'],
  ['Failure Predictions', 'GET /analysis/failure-predictions'],
  ['Anomalies', 'GET /analysis/anomalies'],
  ['Service Reliability', 'GET /analysis/service-reliability'],
  ['Service Resilience', 'GET /analysis/service-resilience'],
  ['Dependency Summary', 'GET /analysis/dependency-summary'],
  ['Dependency Risks', 'GET /analysis/dependency-risks'],
  ['Dependency Impacts', 'GET /analysis/dependency-impacts'],
  ['Knowledge Graph Summary', 'GET /analysis/knowledge-graph-summary'],
  ['Autonomous Actions', 'GET /analysis/autonomous-actions'],
  ['Execution Plans', 'GET /analysis/autonomous-execution-plans'],
  ['Automation Readiness Dashboard', 'GET /analysis/automation-readiness-dashboard'],
  ['Self-Healing Dashboard', 'GET /analysis/self-healing-dashboard'],
  ['AI Ops Dashboard', 'GET /analysis/aiops-dashboard'],
  ['Spike Detection', 'GET /analysis/spike-detection'],
  ['Hourly Trend', 'GET /analysis/hourly-trend'],
  ['Search', 'GET /api/search?q=...'],
  ['SSE Alerts', 'GET /api/streaming/alerts'],
  ['Telemetry Ingest', 'POST /api/telemetry/ingest'],
  ['Audit Logs', 'GET /api/audit-logs'],
];

export function SettingsPage() {
  useDocumentTitle('Settings');
  const ping = usePlatformQuery(['settings-ping-check'], dashboardService.summary, { retry: 0, staleTime: 0 });
  const connected = !ping.isError && ping.data !== undefined;
  const { user } = useAuth();

  return (
    <Box>
      <PageHeader
        eyebrow="Settings"
        title="Platform Configuration"
        description="Backend connection status, API contract mappings, session metadata, and integrations readiness."
        action={<SettingsIcon />}
      />

      <Stack spacing={2}>
        {/* Active Session */}
        <Card>
          <CardHeader title="Active Console Session" />
          <CardContent>
            <Grid container spacing={2}>
              {[
                ['Username', user?.username ?? '—'],
                ['Role', user?.role ?? '—'],
                ['Auth Protocol', 'JWT Bearer Token'],
                ['Session Store', 'localStorage.token'],
              ].map(([k, v]) => (
                <Grid item xs={6} sm={3} key={k}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{k}</Typography>
                  <Typography variant="body2" fontWeight={700} color="#E2E8F0">{v}</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Backend Connection */}
        <Card sx={{ borderLeft: connected ? '3px solid #10B981' : '3px solid #EF4444' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" gap={2}>
              {ping.isLoading ? (
                <Typography color="text.secondary">Testing Spring Boot REST connectivity...</Typography>
              ) : connected ? (
                <>
                  <CheckCircleIcon sx={{ color: '#10B981' }} />
                  <Box>
                    <Typography fontWeight={800} color="#10B981" sx={{ fontSize: '0.85rem' }}>Backend Connected Successfully</Typography>
                    <Typography variant="caption" color="text.secondary">Spring Boot API REST endpoints are reachable on {API_BASE_URL}</Typography>
                  </Box>
                </>
              ) : (
                <>
                  <ErrorOutlineIcon sx={{ color: '#EF4444' }} />
                  <Box>
                    <Typography fontWeight={800} color="#EF4444" sx={{ fontSize: '0.85rem' }}>Backend Unreachable</Typography>
                    <Typography variant="caption" color="text.secondary">Ensure your Spring Boot backend service is running on {API_BASE_URL}</Typography>
                  </Box>
                </>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Configuration variables */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>VITE_API_BASE_URL</Typography>
                <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#60A5FA' }}>{API_BASE_URL}</Typography>
                <Typography variant="caption" color="text.secondary">Endpoint targets will route relative to this base URL.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 700 }}>DATA ENFORCEMENT</Typography>
                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mt: 0.5 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#10B981' }}>STRICT</Typography>
                  <Chip
                    size="small"
                    label="MOCKS DISABLED"
                    sx={{
                      fontWeight: 700,
                      fontSize: '8px',
                      height: 16,
                      bgcolor: 'rgba(16,185,129,0.1)',
                      color: '#10B981',
                      border: '1px solid',
                      borderColor: 'rgba(16,185,129,0.2)'
                    }}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Data is dynamically loaded from active Spring Boot APIs. Failing requests will explicitly throw errors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Integrations */}
        <Card>
          <CardHeader title="Integration Matrix Readiness" />
          <CardContent>
            <Grid container spacing={2}>
              {INTEGRATIONS.map((integration) => (
                <Grid item xs={12} sm={6} md={4} key={integration.name}>
                  <Card sx={{ border: '1px solid #242C3F', backgroundColor: '#151C2C' }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: 0.5,
                              bgcolor: integration.color,
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <LinkIcon sx={{ fontSize: 14, color: '#fff' }} />
                          </Box>
                          <Typography variant="body2" fontWeight={700} color="#E2E8F0">{integration.name}</Typography>
                        </Stack>
                        <Chip
                          size="small"
                          label={integration.status === 'active' ? 'ACTIVE' : 'STUB'}
                          sx={{
                            height: 14,
                            fontSize: '8px',
                            fontWeight: 800,
                            bgcolor: integration.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                            color: integration.status === 'active' ? '#10B981' : 'text.secondary'
                          }}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {integration.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* API Contract Map */}
        <Card>
          <CardHeader title="Spring Boot API Contract Mapping" />
          <CardContent sx={{ p: 0 }}>
            {ENDPOINTS.map(([label, endpoint]) => (
              <Stack
                key={endpoint}
                direction="row"
                justifyContent="space-between"
                sx={{
                  py: 1,
                  px: 2,
                  borderBottom: '1px solid #242C3F',
                  '&:last-child': { borderBottom: 'none' },
                  alignItems: 'center'
                }}
              >
                <Typography variant="body2" fontWeight={500} color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontFamily="var(--font-mono)" color="#60A5FA" sx={{ fontSize: '0.75rem' }}>{endpoint}</Typography>
              </Stack>
            ))}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
