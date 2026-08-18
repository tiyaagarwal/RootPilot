import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Stack } from '@mui/material';

interface KpiCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  helper?: string;
  icon?: React.ReactNode;
  progress?: number;
  accent?: string;
}

export function KpiCard({ label, value, suffix = '', helper, icon, progress, accent = '#3B82F6' }: KpiCardProps) {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Accent strip on top */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: accent }} />
      
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em' }}>
            {label}
          </Typography>
          {icon && <Box sx={{ color: accent, opacity: 0.8, display: 'flex' }}>{icon}</Box>}
        </Stack>

        <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ mb: 0.5 }}>
          <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.03em', fontFamily: 'var(--font-mono)' }}>
            {value}
          </Typography>
          {suffix && (
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {suffix}
            </Typography>
          )}
        </Stack>

        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              borderRadius: 1,
              my: 1.2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: accent,
              },
            }}
          />
        )}

        {helper && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: progress !== undefined ? 0 : 1 }}>
            {helper}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
