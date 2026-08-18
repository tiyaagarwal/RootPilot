import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          {eyebrow && (
            <Typography
              variant="overline"
              color="primary"
              sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', display: 'block', mb: 0.25 }}
            >
              {eyebrow}
            </Typography>
          )}
          <Typography variant="h1" sx={{ color: '#F1F5F9', mb: 0.5 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Stack>
    </Box>
  );
}
