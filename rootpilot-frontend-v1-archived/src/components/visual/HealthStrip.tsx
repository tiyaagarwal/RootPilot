import { Box, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { motion } from 'framer-motion';
import { StatusPill } from '../common/StatusPill';

interface HealthStripProps {
  /** 0–100 health score from /analysis/dashboard-snapshot */
  score: number;
  /** System status string from /analysis/dashboard-snapshot */
  status: string;
  /** Total incident count from /analysis/dashboard summary */
  totalIncidents?: number;
  /** Scored alert count from /analysis/dashboard summary */
  scoredAlertsCount?: number;
  /** Dominant severity level from /analysis/dashboard summary */
  severity?: string;
  /** Top failing service from /analysis/dashboard summary */
  topService?: string | null;
  /** Dynamic latency indicator (e.g. "p95 42ms") */
  latency?: string;
  /** Dynamic status mapping for nodes */
  nodes?: Record<string, string>;
}

const dotColor = (score: number) => {
  if (score >= 85) return '#059669'; // Healthy green
  if (score >= 60) return '#D97706'; // Warning orange
  return '#DC2626'; // Critical red
};

export function HealthStrip({
  score,
  status,
  totalIncidents,
  scoredAlertsCount,
  severity,
  topService,
  latency,
  nodes,
}: HealthStripProps) {
  const color = dotColor(score);

  return (
    <Stack
      direction="column"
      gap={2}
      sx={{ p: 2.0, borderRadius: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap={2}
        alignItems={{ md: 'center' }}
      >
        {/* Pulse + label */}
        <Stack direction="row" alignItems="center" gap={1.2} sx={{ minWidth: 200 }}>
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: color,
              }}
            />
          </motion.div>
          <Typography fontWeight={600} color="text.primary">System Health</Typography>
          <StatusPill value={status} />
        </Stack>

        {/* Score bar */}
        <Stack sx={{ flex: 1, minWidth: 140 }} gap={0.5}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">Health Score</Typography>
            <Typography variant="caption" fontWeight={600} color={color}>{score}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={score}
            sx={{
              height: 7,
              borderRadius: 999,
              bgcolor: '#F3F4F6',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                bgcolor: color,
              },
            }}
          />
        </Stack>

        {/* Real operational metrics */}
        <Stack direction="row" gap={1} flexWrap="wrap">
          {latency && (
            <Chip
              label={latency}
              size="small"
              sx={{ bgcolor: '#F3F4F6', color: '#4B5563', fontWeight: 600 }}
            />
          )}
          {totalIncidents !== undefined && (
            <Chip
              icon={<CrisisAlertIcon sx={{ '&&': { color: '#DC2626' } }} />}
              label={`${totalIncidents} incidents`}
              size="small"
              sx={{ bgcolor: '#FEE2E2', color: '#DC2626', fontWeight: 600 }}
            />
          )}
          {scoredAlertsCount !== undefined && (
            <Chip
              icon={<WarningAmberIcon sx={{ '&&': { color: '#D97706' } }} />}
              label={`${scoredAlertsCount} alerts`}
              size="small"
              sx={{ bgcolor: '#FEF3C7', color: '#D97706', fontWeight: 600 }}
            />
          )}
          {severity && (
            <Chip
              label={severity}
              size="small"
              sx={{
                bgcolor: severity === 'CRITICAL' || severity === 'HIGH' ? '#FEE2E2' : '#FEF3C7',
                color: severity === 'CRITICAL' || severity === 'HIGH' ? '#DC2626' : '#D97706',
                fontWeight: 700,
                letterSpacing: '.04em',
              }}
            />
          )}
          {topService && (
            <Chip
              label={`Top risk: ${topService}`}
              size="small"
              sx={{ bgcolor: '#DBEAFE', color: '#2563EB', fontWeight: 600 }}
            />
          )}
        </Stack>
      </Stack>

      {/* Dynamic service nodes status strip */}
      {nodes && (
        <Stack
          direction="row"
          gap={1.5}
          flexWrap="wrap"
          sx={{ pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center', mr: 1, fontWeight: 600 }}>
            SERVICES STATUS:
          </Typography>
          {Object.entries(nodes).map(([name, stat]) => {
            const isHealthy = stat === 'HEALTHY';
            return (
              <Chip
                key={name}
                label={`${name}: ${stat}`}
                size="small"
                sx={{
                  bgcolor: isHealthy ? '#D1FAE5' : '#FEE2E2',
                  color: isHealthy ? '#059669' : '#DC2626',
                  fontWeight: 700,
                  fontSize: 10,
                  height: 20,
                  borderRadius: 1,
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
