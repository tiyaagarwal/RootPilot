import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore, type AppNotification, type NotificationSeverity } from '../../store/uiStore';

const SEV_COLOR: Record<NotificationSeverity, string> = {
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#6366F1',
};

const SEV_ICON: Record<NotificationSeverity, React.ReactNode> = {
  error: <ErrorIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
  success: <CheckCircleIcon fontSize="small" />,
  info: <InfoIcon fontSize="small" />,
};

function timeAgo(date: Date): string {
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function NotificationRow({ n, onRead }: { n: AppNotification; onRead: (id: string) => void }) {
  const color = SEV_COLOR[n.severity];
  const icon = SEV_ICON[n.severity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.18 }}
    >
      <Box
        onClick={() => onRead(n.id)}
        sx={{
          px: 2.5,
          py: 1.75,
          cursor: 'pointer',
          bgcolor: n.read ? 'transparent' : alpha(color, 0.04),
          borderLeft: '3px solid',
          borderLeftColor: n.read ? 'transparent' : color,
          transition: 'all 0.15s ease',
          '&:hover': { bgcolor: 'action.hover' },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              mt: 0.2,
              p: 0.6,
              borderRadius: '50%',
              bgcolor: alpha(color, 0.12),
              color,
              flexShrink: 0,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {icon}
          </Box>
          <Box flex={1} minWidth={0}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" fontWeight={n.read ? 500 : 700} noWrap sx={{ flex: 1 }}>
                {n.title}
              </Typography>
              {!n.read && (
                <Box
                  sx={{
                    width: 7, height: 7, borderRadius: '50%',
                    bgcolor: color, flexShrink: 0, ml: 1,
                  }}
                />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, lineHeight: 1.5 }}>
              {n.message}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', mt: 0.5, display: 'block' }}>
              {timeAgo(n.timestamp)}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead, clearNotifications } = useUiStore();

  return (
    <>
      {/* Bell button */}
      <Tooltip title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}>
        <IconButton
          onClick={() => setOpen(true)}
          size="small"
          sx={{
            color: unreadCount > 0 ? 'primary.main' : 'text.secondary',
            transition: 'color 0.2s ease',
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={9}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem',
                height: 16,
                minWidth: 16,
                fontWeight: 700,
              },
            }}
          >
            {unreadCount > 0 ? (
              <motion.div
                animate={{ rotate: [-8, 8, -8, 8, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
              >
                <NotificationsActiveIcon fontSize="small" />
              </motion.div>
            ) : (
              <NotificationsIcon fontSize="small" />
            )}
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Notification drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: 'background.paper',
            borderLeft: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2.5,
            py: 2,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.06))',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>Notifications</Typography>
            <Typography variant="caption" color="text.secondary">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5}>
            {unreadCount > 0 && (
              <Tooltip title="Mark all as read">
                <IconButton size="small" onClick={markAllRead} sx={{ color: 'text.secondary' }}>
                  <DoneAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {notifications.length > 0 && (
              <Tooltip title="Clear all">
                <IconButton size="small" onClick={clearNotifications} sx={{ color: 'text.secondary' }}>
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {/* Notification list */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', py: 8, px: 3, textAlign: 'center', height: '100%',
              }}
            >
              <Box sx={{
                width: 64, height: 64, borderRadius: '50%', bgcolor: 'action.hover',
                display: 'grid', placeItems: 'center', mb: 2,
              }}>
                <NotificationsIcon sx={{ fontSize: 32, color: 'text.disabled' }} />
              </Box>
              <Typography variant="body2" fontWeight={700} color="text.secondary" gutterBottom>
                No notifications yet
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ maxWidth: 240 }}>
                Live alerts from your platform will appear here as incidents are detected and resolved.
              </Typography>
            </Box>
          ) : (
            <AnimatePresence>
              {notifications.map((n, i) => (
                <Box key={n.id}>
                  <NotificationRow n={n} onRead={markRead} />
                  {i < notifications.length - 1 && (
                    <Divider sx={{ mx: 2.5, opacity: 0.5 }} />
                  )}
                </Box>
              ))}
            </AnimatePresence>
          )}
        </Box>

        {/* Footer */}
        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={clearNotifications}
              startIcon={<DeleteSweepIcon />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Clear All Notifications
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  );
}
