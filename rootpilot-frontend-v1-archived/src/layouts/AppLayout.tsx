import { useState, useEffect, useRef } from 'react';
import {
  Box, Divider, IconButton, InputBase, Stack, Tooltip,
  Typography, Avatar, Skeleton, Snackbar, Alert, Paper,
  List, ListItem, ListItemText, ClickAwayListener, Chip,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useThemeMode, ThemeMode } from '../context/ThemeContext';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HubIcon from '@mui/icons-material/Hub';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage';
import { AskRootPilot } from '../components/ai/AskRootPilot';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import BoltIcon from '@mui/icons-material/Bolt';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';
import { useUiStore } from '../store/uiStore';
import { StatusPill } from '../components/common/StatusPill';
import { NotificationCenter } from '../components/common/NotificationCenter';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { autonomousService, dashboardService } from '../services/platformServices';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL, apiClient } from '../api/client';

const nav = [
  ['Dashboard', '/', DashboardIcon],
  ['Executive Overview', '/executive', BarChartIcon],
  ['Infrastructure', '/infrastructure', StorageIcon],
  ['Incidents', '/incidents', ReportProblemIcon],
  ['Service Intelligence', '/service-intelligence', InsightsIcon],
  ['War Room', '/war-room', ReportProblemIcon],
  ['Incident Correlation', '/correlation', HubIcon],
  ['Root Cause Analysis', '/root-cause', PsychologyIcon],
  ['Predictive Analytics', '/predictive', InsightsIcon],
  ['Service Map', '/knowledge-graph', AccountTreeIcon],
  ['Impact Analysis', '/dependencies', HubIcon],
  ['Service Health', '/service-health', HealthAndSafetyIcon],
  ['Business Impact', '/business-impact', BusinessCenterIcon],
  ['Autonomous Engine', '/autonomous', AutoFixHighIcon],
  ['Operations Command', '/command-center', PsychologyIcon],
  ['Settings', '/settings', SettingsIcon],
] as const;

interface SearchResult {
  type: string;
  title: string;
  description: string;
  link: string;
}

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar, addNotification } = useUiStore();
  const width = sidebarCollapsed ? 88 : 292;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const { mode, effectiveMode, setMode } = useThemeMode();
  const searchRef = useRef<HTMLInputElement>(null);

  const isDark = effectiveMode === 'dark';

  const cycleTheme = () => {
    const cycle: ThemeMode[] = ['light', 'dark', 'system'];
    const next = cycle[(cycle.indexOf(mode) + 1) % cycle.length];
    setMode(next);
  };

  const ThemeIcon = mode === 'dark' ? DarkModeIcon : mode === 'system' ? SettingsBrightnessIcon : LightModeIcon;
  const themeLabel = mode === 'dark' ? 'Dark Mode' : mode === 'system' ? 'System Theme' : 'Light Mode';

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Toast state (SSE snackbar for immediate alert popup)
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'info' | 'error' | 'success' }>({
    open: false, message: '', severity: 'info',
  });

  // Live backend data
  const snapshot = usePlatformQuery(
    ['layout-snapshot'], dashboardService.snapshot,
    { staleTime: 60_000, refetchInterval: 60_000, retry: false },
  );
  const readiness = usePlatformQuery(
    ['layout-readiness'], autonomousService.readinessDashboard,
    { staleTime: 60_000, refetchInterval: 120_000, retry: false },
  );

  const systemStatus = snapshot.data?.systemStatus ?? snapshot.data?.dashboard?.systemStatus;
  const avgConfidence = readiness.data?.averageExecutionConfidence;

  // ── Ctrl+K / Cmd+K global search shortcut ────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Real-Time SSE listener ────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const sseUrl = `${API_BASE_URL}/api/streaming/alerts${token ? `?token=${token}` : ''}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.addEventListener('INCIDENT_CREATED', (e) => {
      try {
        const incident = JSON.parse(e.data);
        const msg = `New incident in ${incident.serviceName} — ${incident.exceptionType}`;
        setToast({ open: true, message: `🚨 ${msg}`, severity: 'error' });
        addNotification({ severity: 'error', title: 'Incident Detected', message: msg });
      } catch { /* silent */ }
    });

    eventSource.addEventListener('INCIDENT_RESOLVED', (e) => {
      try {
        const d = JSON.parse(e.data);
        const msg = `${d.serviceName ?? 'Service'} incident resolved`;
        addNotification({ severity: 'success', title: 'Incident Resolved', message: msg });
      } catch { /* silent */ }
    });

    eventSource.addEventListener('RCA_COMPLETED', (e) => {
      try {
        const d = JSON.parse(e.data);
        addNotification({ severity: 'info', title: 'RCA Complete', message: d.summary ?? 'Root cause analysis completed.' });
      } catch { /* silent */ }
    });

    eventSource.addEventListener('PREDICTION_GENERATED', (e) => {
      try {
        const d = JSON.parse(e.data);
        addNotification({ severity: 'warning', title: 'Risk Prediction', message: d.message ?? 'New failure prediction generated.' });
      } catch { /* silent */ }
    });

    eventSource.addEventListener('AUTONOMOUS_ACTION', (e) => {
      try {
        const d = JSON.parse(e.data);
        addNotification({ severity: 'info', title: 'Autonomous Action', message: d.action ?? 'Autonomous remediation executed.' });
      } catch { /* silent */ }
    });

    eventSource.addEventListener('SERVICE_DEGRADATION', (e) => {
      try {
        const d = JSON.parse(e.data);
        addNotification({ severity: 'warning', title: 'Service Degradation', message: d.message ?? 'Service performance degraded.' });
      } catch { /* silent */ }
    });

    eventSource.addEventListener('CACHE_INVALIDATION', () => {
      queryClient.invalidateQueries();
    });

    eventSource.onerror = () => { eventSource.close(); };
    return () => { eventSource.close(); };
  }, [queryClient, addNotification]);

  // ── Debounced search ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setShowSearchDropdown(false); return; }
    const t = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await apiClient.get<SearchResult[]>(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data);
        setShowSearchDropdown(true);
      } catch { /* silent */ } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <Box
        component="aside"
        sx={{
          width, transition: 'width .24s ease',
          position: 'fixed', inset: '0 auto 0 0',
          p: 2, borderRight: '1px solid', borderColor: 'divider',
          bgcolor: 'background.paper', zIndex: 10,
          overflowY: 'auto', overflowX: 'hidden',
        }}
      >
        {/* Logo row */}
        <Stack direction="row" alignItems="center" spacing={1.4} sx={{ mb: 2, position: 'relative' }}>
          <motion.div animate={{ rotate: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2,
              display: 'grid', placeItems: 'center',
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              color: '#FFFFFF', boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
            }}>
              <BoltIcon />
            </Box>
          </motion.div>
          {!sidebarCollapsed && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ letterSpacing: '-.02em', lineHeight: 1.2 }}>
                RootPilot
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>Autonomous AIOps</Typography>
            </Box>
          )}
          <IconButton size="small" onClick={toggleSidebar} sx={{ ml: 'auto', color: 'text.secondary' }}>
            <MenuOpenIcon />
          </IconButton>
        </Stack>

        {/* AI agent status */}
        {!sidebarCollapsed && (
          <Stack direction="row" alignItems="center" gap={1} sx={{
            p: 1.15, mb: 2, borderRadius: 2,
            bgcolor: isDark ? 'rgba(16,185,129,0.10)' : '#D1FAE5',
            border: `1px solid ${isDark ? 'rgba(16,185,129,0.25)' : '#A7F3D0'}`,
            color: isDark ? '#34D399' : '#065F46',
          }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
            </motion.div>
            {readiness.isLoading ? (
              <Skeleton width={120} height={16} />
            ) : avgConfidence !== undefined ? (
              <Typography variant="caption" fontWeight={600}>
                AI Agent Online · {avgConfidence}% confidence
              </Typography>
            ) : (
              <Typography variant="caption" fontWeight={600}>AI Agent Online</Typography>
            )}
          </Stack>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Nav links */}
        <Stack spacing={0.5}>
          {nav.map(([label, path, Icon]) => (
            <Tooltip title={sidebarCollapsed ? label : ''} placement="right" key={path}>
              <Box
                component={NavLink}
                to={path}
                end={path === '/'}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.4,
                  px: 1.5, py: 1.0, borderRadius: 2,
                  color: 'text.secondary', textDecoration: 'none',
                  fontWeight: 600, transition: 'all .15s ease',
                  '&.active': {
                    color: 'primary.main',
                    bgcolor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
                    borderLeft: '3px solid', borderLeftColor: 'primary.main',
                    borderRadius: '0 8px 8px 0', pl: 1.2,
                  },
                  '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                }}
              >
                <Icon fontSize="small" />
                {!sidebarCollapsed && (
                  <Typography variant="body2" fontWeight={600}>{label}</Typography>
                )}
              </Box>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <Box sx={{ ml: `${width}px`, flex: 1, transition: 'margin-left .24s ease', minWidth: 0 }}>
        {/* Sticky header */}
        <Stack
          direction="row" alignItems="center" spacing={2}
          sx={{
            position: 'sticky', top: 0, zIndex: 8,
            px: { xs: 2, md: 3.5 }, py: 1.5,
            borderBottom: '1px solid', borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {/* Search with Ctrl+K hint */}
          <ClickAwayListener onClickAway={() => setShowSearchDropdown(false)}>
            <Box sx={{ flex: 1, maxWidth: 680, position: 'relative' }}>
              <Box sx={{
                display: 'flex', alignItems: 'center',
                px: 2, py: 0.8, borderRadius: 2,
                bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider',
                transition: 'border-color 0.15s ease',
                '&:focus-within': { borderColor: 'primary.main', bgcolor: 'background.paper' },
              }}>
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <InputBase
                  inputRef={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search incidents, services, root causes..."
                  sx={{ flex: 1, fontSize: 14, '& input': { bgcolor: 'transparent' } }}
                />
                <Typography variant="caption" color="text.disabled" sx={{ ml: 1, fontSize: '0.65rem', fontWeight: 600, display: { xs: 'none', md: 'block' } }}>
                  Ctrl+K
                </Typography>
              </Box>

              {showSearchDropdown && (
                <Paper elevation={8} sx={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  mt: 1, maxHeight: 400, overflowY: 'auto', zIndex: 100,
                  border: '1px solid', borderColor: 'divider', borderRadius: 2,
                }}>
                  <List dense>
                    {searchLoading ? (
                      <ListItem><ListItemText primary="Searching platform index..." /></ListItem>
                    ) : searchResults.length === 0 ? (
                      <ListItem><ListItemText primary="No matching telemetry found" /></ListItem>
                    ) : (
                      searchResults.map((res, i) => (
                        <ListItem
                          key={i}
                          onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); navigate(res.link); }}
                          sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                        >
                          <ListItemText
                            primary={res.title} secondary={res.description}
                            primaryTypographyProps={{ fontWeight: 600, color: 'primary.main' }}
                          />
                          <Chip label={res.type.toUpperCase()} size="small" color={res.type === 'incident' ? 'error' : 'info'} />
                        </ListItem>
                      ))
                    )}
                  </List>
                </Paper>
              )}
            </Box>
          </ClickAwayListener>

          {/* System status */}
          {snapshot.isLoading ? (
            <Skeleton width={96} height={28} sx={{ borderRadius: 1 }} />
          ) : systemStatus ? (
            <StatusPill value={systemStatus} />
          ) : null}

          {/* Right controls */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {/* Theme toggle */}
            <Tooltip title={themeLabel}>
              <IconButton onClick={cycleTheme} size="small" sx={{
                color: isDark ? 'warning.light' : 'text.secondary',
                bgcolor: isDark ? 'rgba(251,191,36,0.08)' : 'transparent',
                '&:hover': { bgcolor: isDark ? 'rgba(251,191,36,0.15)' : 'action.hover' },
                transition: 'all 0.2s ease',
              }}>
                <ThemeIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Notification center */}
            <NotificationCenter />

            {/* User info */}
            <Tooltip title={`Role: ${user?.role ?? 'VIEWER'}`}>
              <Stack direction="column" alignItems="flex-end" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Typography variant="body2" fontWeight={700} color="text.primary">
                  {user?.username ?? 'Operator'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10, fontWeight: 600 }}>
                  {user?.role ?? 'VIEWER'}
                </Typography>
              </Stack>
            </Tooltip>

            <Avatar sx={{ bgcolor: 'primary.main', color: '#FFFFFF', fontWeight: 600, fontSize: 14 }}>
              {(user?.username ?? 'OP').substring(0, 2).toUpperCase()}
            </Avatar>

            <Tooltip title="Sign Out">
              <IconButton onClick={handleLogout} sx={{ color: 'text.secondary' }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Page outlet */}
        <Box component="main" sx={{ p: { xs: 2, md: 3.5 }, maxWidth: 1720, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>

      {/* SSE immediate alert snackbar */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 10 }}
      >
        <Alert
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* AI Copilot FAB */}
      <AskRootPilot />
    </Box>
  );
}
