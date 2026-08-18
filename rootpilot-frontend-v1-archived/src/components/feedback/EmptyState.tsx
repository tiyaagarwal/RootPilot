import { Box, Button, Typography, alpha } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
  accentColor?: string;
}

export function EmptyState({
  icon,
  title = 'No Data Available',
  description = 'No activity has been detected yet. Data will appear here as your platform runs.',
  action,
  compact = false,
  accentColor = '#6366F1',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 0.75 : 1.5,
        py: compact ? 3 : 7,
        px: 3,
        color: 'text.secondary',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: compact ? 48 : 72,
          height: compact ? 48 : 72,
          borderRadius: '50%',
          bgcolor: alpha(accentColor, 0.08),
          display: 'grid',
          placeItems: 'center',
          mb: compact ? 0 : 0.5,
          color: alpha(accentColor, 0.5),
        }}
      >
        {icon ?? <InboxIcon sx={{ fontSize: compact ? 22 : 34 }} />}
      </Box>
      <Typography variant={compact ? 'body2' : 'body1'} fontWeight={700} color="text.secondary">
        {title}
      </Typography>
      {description && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ maxWidth: 380, lineHeight: 1.6, fontSize: compact ? '0.7rem' : '0.8rem' }}
        >
          {description}
        </Typography>
      )}
      {action && !compact && <Box sx={{ mt: 1 }}>{action}</Box>}
    </Box>
  );
}
