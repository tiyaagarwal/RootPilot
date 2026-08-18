import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  title: string;
  description: string;
  compact?: boolean;
  accentColor?: string;
}

export function EmptyState({ title, description, compact = false, accentColor = '#64748B' }: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: compact ? 3 : 6,
        px: 2,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        width: '100%',
        backgroundColor: compact ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
        border: compact ? 'none' : '1px dashed #242C3F',
        borderRadius: 1,
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        {!compact && (
          <Box sx={{ color: accentColor, opacity: 0.6 }}>
            <InboxIcon sx={{ fontSize: 32 }} />
          </Box>
        )}
        <Box>
          <Typography variant={compact ? "subtitle2" : "h5"} color="text.primary" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, fontSize: compact ? '11px' : '12px' }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
