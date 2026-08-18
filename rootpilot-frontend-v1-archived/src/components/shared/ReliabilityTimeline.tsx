import React from 'react';
import {
  Box, Typography, Stack, ButtonGroup, Button, Tooltip as MuiTooltip, Skeleton, alpha,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { timelineService } from '../../services/platformServices';
import type { TimelineBucket } from '../../types/backend';

interface Props {
  serviceName?: string;
  period?: '24h' | '7d' | '30d' | '90d';
  onPeriodChange?: (p: '24h' | '7d' | '30d' | '90d') => void;
  compact?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  HEALTHY:  '#22c55e',
  DEGRADED: '#f59e0b',
  CRITICAL: '#ef4444',
};

const PERIODS: Array<{ value: '24h' | '7d' | '30d' | '90d'; label: string }> = [
  { value: '24h', label: '24H' },
  { value: '7d',  label: '7D'  },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function ReliabilityTimeline({ serviceName, period = '7d', onPeriodChange, compact }: Props) {
  const [activePeriod, setActivePeriod] = React.useState<'24h' | '7d' | '30d' | '90d'>(period);

  const { data: buckets, isLoading, isError } = useQuery({
    queryKey: ['reliability-timeline', serviceName, activePeriod],
    queryFn: () => timelineService.get(activePeriod, serviceName),
    staleTime: 60_000,
  });

  const handlePeriod = (p: '24h' | '7d' | '30d' | '90d') => {
    setActivePeriod(p);
    onPeriodChange?.(p);
  };

  const totalCount = buckets?.reduce((s, b) => s + b.incidentCount, 0) ?? 0;
  const healthyPct = buckets
    ? Math.round((buckets.filter(b => b.status === 'HEALTHY').length / buckets.length) * 100)
    : null;

  return (
    <Box sx={{
      p: compact ? 1.5 : 2.5,
      border: '1px solid', borderColor: 'divider',
      borderRadius: 2, bgcolor: 'background.paper',
    }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="baseline">
          <Typography variant="subtitle2" fontWeight={700}>Reliability Timeline</Typography>
          {healthyPct !== null && (
            <Typography variant="caption" color={healthyPct >= 80 ? 'success.main' : 'warning.main'} fontWeight={600}>
              {healthyPct}% healthy
            </Typography>
          )}
          {totalCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {totalCount} incident{totalCount !== 1 ? 's' : ''}
            </Typography>
          )}
        </Stack>

        <ButtonGroup size="small" variant="outlined">
          {PERIODS.map(p => (
            <Button
              key={p.value}
              onClick={() => handlePeriod(p.value)}
              variant={activePeriod === p.value ? 'contained' : 'outlined'}
              sx={{ minWidth: 38, fontSize: '0.7rem', py: 0.25 }}
            >
              {p.label}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>

      {/* Segments */}
      {isLoading && (
        <Stack direction="row" spacing={0.25} sx={{ height: compact ? 20 : 28 }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" sx={{ flex: 1, borderRadius: 0.5 }} />
          ))}
        </Stack>
      )}

      {isError && (
        <Typography variant="body2" color="error" sx={{ py: 2, textAlign: 'center' }}>
          Unable to load timeline data
        </Typography>
      )}

      {buckets && !isLoading && (
        <Stack direction="row" spacing={0.25} sx={{ height: compact ? 20 : 28 }}>
          {buckets.map((b: TimelineBucket, i: number) => (
            <MuiTooltip
              key={i}
              title={
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: STATUS_COLORS[b.status] }}>
                    {b.status}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>{formatTime(b.startTime)}</Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    {b.incidentCount === 0 ? 'No incidents' : `${b.incidentCount} incident${b.incidentCount !== 1 ? 's' : ''}`}
                  </Typography>
                </Box>
              }
              arrow
            >
              <Box
                sx={{
                  flex: 1,
                  borderRadius: 0.5,
                  bgcolor: STATUS_COLORS[b.status],
                  opacity: 0.85,
                  cursor: 'default',
                  transition: 'opacity 0.15s',
                  '&:hover': { opacity: 1, transform: 'scaleY(1.1)' },
                }}
              />
            </MuiTooltip>
          ))}
        </Stack>
      )}

      {/* Legend */}
      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <Stack key={status} direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
