import { Box, CardContent, Skeleton, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { GlassCard } from '../common/GlassCard';
import { ErrorState } from '../feedback/ErrorState';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  glow?: string;
  loading?: boolean;
  error?: boolean;
  queryKey?: readonly unknown[];
  height?: number;
}

export function ChartCard({ title, subtitle, children, glow = '#38bdf8', loading, error, queryKey, height = 320 }: ChartCardProps) {
  return (
    <GlassCard glow={glow} sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ height }}>
          {loading ? (
            <Skeleton variant="rounded" height={height} sx={{ borderRadius: 3, bgcolor: 'rgba(148,163,184,.10)' }} />
          ) : error ? (
            <ErrorState queryKey={queryKey} compact />
          ) : (
            children
          )}
        </Box>
      </CardContent>
    </GlassCard>
  );
}
