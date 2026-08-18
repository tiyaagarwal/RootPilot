import React, { useEffect } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Button, Stack, Chip, Divider, Avatar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DnsIcon from '@mui/icons-material/Dns';
import ComputerIcon from '@mui/icons-material/Computer';
import BoltIcon from '@mui/icons-material/Bolt';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAuth } from '../context/AuthContext';
import { useUiStore } from '../store/uiStore';
import { ColorModeContext } from '../App';
import { CopilotDrawer } from '../components/copilot/CopilotDrawer';
import { usePlatformQuery } from '../hooks/usePlatformQuery';
import { dashboardService } from '../services/platformServices';
import { DataSourceIndicator } from '../components/common/DataSourceIndicator';

const SIDEBAR_WIDTH = 220;

export function EnterpriseShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isSidebarCollapsed, toggleSidebar, isCopilotOpen, copilotContext, openCopilot, closeCopilot } = useUiStore();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  
  // Real-time system health query for the top status bar
  const snapshot = usePlatformQuery(['top-bar-snapshot'], dashboardService.snapshot, {
    refetchInterval: 15_000 // poll every 15s for top-bar updates
  });
  
  const healthScore = snapshot.data?.healthScore ?? 100;
  const systemStatus = snapshot.data?.systemStatus ?? 'HEALTHY';
  
  const menuItems = [
    { text: 'Command Center', icon: <DashboardIcon fontSize="small" />, path: '/' },
    { text: 'Incidents', icon: <CrisisAlertIcon fontSize="small" />, path: '/incidents' },
    { text: 'Root Cause (RCA)', icon: <AccountTreeIcon fontSize="small" />, path: '/rca' },
    { text: 'Services', icon: <DnsIcon fontSize="small" />, path: '/services' },
    { text: 'Autonomous Ops', icon: <BoltIcon fontSize="small" />, path: '/autonomous' },
    { text: 'Settings', icon: <SettingsIcon fontSize="small" />, path: '/settings' },
  ];

  const getHealthIcon = () => {
    if (systemStatus === 'CRITICAL' || healthScore < 60) return <ErrorIcon sx={{ color: '#EF4444', fontSize: 16 }} />;
    if (systemStatus === 'DEGRADED' || healthScore < 85) return <WarningIcon sx={{ color: '#F59E0B', fontSize: 16 }} />;
    return <CheckCircleIcon sx={{ color: '#10B981', fontSize: 16 }} />;
  };

  const getHealthColor = () => {
    if (systemStatus === 'CRITICAL' || healthScore < 60) return '#EF4444';
    if (systemStatus === 'DEGRADED' || healthScore < 85) return '#F59E0B';
    return '#10B981';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'background.default' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 48, px: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton color="inherit" edge="start" onClick={toggleSidebar} sx={{ mr: 0.5 }}>
              <MenuIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Box
              sx={{
                width: 26, height: 26, borderRadius: 0.5,
                display: 'grid', placeItems: 'center',
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              }}
            >
              <BoltIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography variant="h5" fontWeight={850} sx={{ fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
              RootPilot <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary', fontSize: '0.75rem', ml: 0.5 }}>v2</Box>
            </Typography>
            
            <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto', mx: 1.5 }} />
            
            {/* Live System Health Badge */}
            <Stack direction="row" alignItems="center" spacing={0.75}>
              {getHealthIcon()}
              <Typography variant="body2" sx={{ fontWeight: 650, color: getHealthColor() }}>
                SYSTEM {systemStatus}: {healthScore}%
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            {/* Dark/Light Mode Switcher */}
            <IconButton onClick={colorMode.toggleColorMode} color="inherit" size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              {theme.palette.mode === 'dark' ? <LightModeIcon sx={{ fontSize: 16 }} /> : <DarkModeIcon sx={{ fontSize: 16 }} />}
            </IconButton>

            {/* Strict Data Source Enforcement Indicator */}
            <DataSourceIndicator />
            
            <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto', mx: 0.5, borderColor: 'divider' }} />

            {/* Embedded Context Copilot Launcher Button */}
            <Button
              variant="outlined"
              size="small"
              startIcon={<SmartToyIcon sx={{ fontSize: 14 }} />}
              onClick={() => openCopilot()}
              sx={{
                fontSize: '11px',
                borderColor: 'divider',
                color: 'primary.main',
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(59, 130, 246, 0.03)' : 'rgba(59, 130, 246, 0.05)',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                },
              }}
            >
              Copilot
            </Button>

            {/* Profile Avatar & Details */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: '0.7rem',
                  bgcolor: '#3B82F6',
                  fontWeight: 700,
                }}
              >
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="caption" fontWeight={700} sx={{ display: 'block', lineHeight: 1 }}>
                  {user?.username || 'operator'}
                </Typography>
                <Chip
                  label={user?.role || 'OPERATOR'}
                  size="small"
                  sx={{
                    height: 12,
                    fontSize: '7px',
                    fontWeight: 800,
                    px: 0,
                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.06)' : '#1E293B',
                    color: theme.palette.mode === 'light' ? 'text.secondary' : '#94A3B8',
                    mt: 0.25
                  }}
                />
              </Box>
            </Stack>

            <IconButton size="small" onClick={logout} sx={{ color: 'text.secondary', '&:hover': { color: '#EF4444' } }}>
              <ExitToAppIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Navigation Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isSidebarCollapsed ? 56 : SIDEBAR_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isSidebarCollapsed ? 56 : SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: 'width 0.2s',
            overflowX: 'hidden',
            pt: 6, // space for App Bar
          },
        }}
      >
        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  py: 1,
                  px: 1.5,
                  backgroundColor: isActive ? (theme.palette.mode === 'light' ? 'rgba(59, 130, 246, 0.06)' : 'rgba(59, 130, 246, 0.08)') : 'transparent',
                  borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.02)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 28,
                    color: isActive ? '#3B82F6' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isSidebarCollapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? (theme.palette.mode === 'light' ? 'primary.main' : '#E2E8F0') : 'text.secondary',
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content Pane */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8, overflowY: 'auto', height: '100vh' }}>
        {children}
      </Box>

      {/* Operations Copilot Slide-out Drawer */}
      <CopilotDrawer
        open={isCopilotOpen}
        onClose={closeCopilot}
        contextType={copilotContext.type}
        contextId={copilotContext.id}
        contextName={copilotContext.name}
      />
    </Box>
  );
}
