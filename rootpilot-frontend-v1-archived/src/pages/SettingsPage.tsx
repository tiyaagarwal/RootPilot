import { CardContent, Chip, Grid, Stack, Typography, Box, Divider, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import LinkIcon from '@mui/icons-material/Link';
import { PageHeader } from '../components/common/PageHeader';
import { GlassCard } from '../components/common/GlassCard';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { dashboardService } from '../services/platformServices';
import { API_BASE_URL, USE_MOCKS } from '../api/client';
import { useThemeMode, ThemeMode } from '../context/ThemeContext';
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
  const ping = usePlatformQuery(['settings-ping'], dashboardService.summary, { retry: 0, staleTime: 0 });
  const connected = !ping.isError && ping.data !== undefined;
  const { mode, setMode } = useThemeMode();
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Platform Configuration"
        description="Theme preferences, backend connection status, API contract map, and integration readiness."
        action={<SettingsIcon />}
      />
      <Stack spacing={2.5}>
        {/* Theme Selector */}
        <GlassCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Appearance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select your preferred color theme. Your choice is saved in localStorage and applied immediately.
            </Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={(_, val) => { if (val) setMode(val as ThemeMode); }}
              aria-label="theme mode"
            >
              <ToggleButton value="light" aria-label="light mode" sx={{ gap: 1, px: 2.5 }}>
                <LightModeIcon fontSize="small" />
                <Typography variant="body2" fontWeight={600}>Light</Typography>
              </ToggleButton>
              <ToggleButton value="dark" aria-label="dark mode" sx={{ gap: 1, px: 2.5 }}>
                <DarkModeIcon fontSize="small" />
                <Typography variant="body2" fontWeight={600}>Dark</Typography>
              </ToggleButton>
              <ToggleButton value="system" aria-label="system theme" sx={{ gap: 1, px: 2.5 }}>
                <SettingsBrightnessIcon fontSize="small" />
                <Typography variant="body2" fontWeight={600}>System</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </CardContent>
        </GlassCard>

        {/* Active Session */}
        <GlassCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Active Session</Typography>
            <Grid container spacing={2}>
              {[
                ['Username', user?.username ?? '—'],
                ['Role', user?.role ?? '—'],
                ['Auth', 'JWT Bearer Token'],
                ['Session', 'localStorage.token'],
              ].map(([k, v]) => (
                <Grid item xs={6} sm={3} key={k}>
                  <Typography variant="overline" color="text.secondary">{k}</Typography>
                  <Typography variant="body2" fontWeight={700}>{v}</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </GlassCard>

        {/* Backend Connection */}
        <GlassCard glow={connected ? '#059669' : '#DC2626'}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" gap={2}>
              {ping.isLoading ? (
                <Typography color="text.secondary">Testing connection...</Typography>
              ) : connected ? (
                <>
                  <CheckCircleIcon color="success" />
                  <Box>
                    <Typography fontWeight={700} color="success.main">Backend Connected</Typography>
                    <Typography variant="caption" color="text.secondary">Spring Boot API is reachable at {API_BASE_URL}</Typography>
                  </Box>
                </>
              ) : (
                <>
                  <ErrorOutlineIcon color="error" />
                  <Box>
                    <Typography fontWeight={700} color="error.main">Backend Unreachable</Typography>
                    <Typography variant="caption" color="text.secondary">Ensure the Spring Boot service is running at {API_BASE_URL}</Typography>
                  </Box>
                </>
              )}
            </Stack>
          </CardContent>
        </GlassCard>

        {/* Configuration */}
        <Grid container spacing={2.2}>
          <Grid item xs={12} md={6}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" color="text.secondary">VITE_API_BASE_URL</Typography>
                <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700, fontFamily: 'monospace' }}>{API_BASE_URL}</Typography>
                <Typography variant="caption" color="text.disabled">All API calls are made relative to this base URL.</Typography>
              </CardContent>
            </GlassCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <GlassCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="overline" color="text.secondary">VITE_USE_MOCKS</Typography>
                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mt: 0.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{USE_MOCKS ? 'true' : 'false'}</Typography>
                  <Chip
                    size="small"
                    label={USE_MOCKS ? 'MOCK MODE ACTIVE' : 'LIVE BACKEND'}
                    color={USE_MOCKS ? 'warning' : 'success'}
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <Typography variant="caption" color="text.disabled">
                  {USE_MOCKS ? 'Set VITE_USE_MOCKS=false to connect to the real backend.' : 'All data is sourced from live Spring Boot API responses.'}
                </Typography>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Integrations */}
        <GlassCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Integration Readiness</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              External integrations available for production deployment. Active = wired to backend endpoints. Stub = architecture defined, requires configuration.
            </Typography>
            <Grid container spacing={2}>
              {INTEGRATIONS.map((integration) => (
                <Grid item xs={12} sm={6} md={4} key={integration.name}>
                  <GlassCard>
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: 1.5,
                              bgcolor: integration.color,
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <LinkIcon sx={{ fontSize: 16, color: '#fff' }} />
                          </Box>
                          <Typography variant="body2" fontWeight={700}>{integration.name}</Typography>
                        </Stack>
                        <Chip
                          size="small"
                          label={integration.status === 'active' ? 'ACTIVE' : 'STUB'}
                          color={integration.status === 'active' ? 'success' : 'default'}
                          sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                        />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {integration.description}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </GlassCard>

        {/* API Contract Map */}
        <GlassCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Platform API Contract Map</Typography>
            {ENDPOINTS.map(([label, endpoint]) => (
              <Stack key={endpoint} direction="row" justifyContent="space-between" sx={{ py: 0.7, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontFamily="monospace" color="primary.main" sx={{ fontSize: '0.78rem' }}>{endpoint}</Typography>
              </Stack>
            ))}
          </CardContent>
        </GlassCard>
      </Stack>
    </>
  );
}
