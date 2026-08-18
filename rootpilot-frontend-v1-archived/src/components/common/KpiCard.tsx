import { Box, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { GlassCard } from './GlassCard';

function renderValue(value: ReactNode, suffix?: string, prefix?: string) {
  return typeof value === 'number' ? <AnimatedCounter value={value} suffix={suffix} prefix={prefix} /> : value;
}

export function KpiCard({ label, value, helper, icon, accent = '#2563EB', progress, suffix, prefix }: { label: string; value: ReactNode; helper?: string; icon?: ReactNode; accent?: string; progress?: number; suffix?: string; prefix?: string }) {
  return (
    <GlassCard glow={accent} interactive sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '.08em', fontWeight: 600 }}>{label}</Typography>
            <Typography variant="h4" sx={{ mt: 0.5, lineHeight: 1, letterSpacing: '-.02em', fontWeight: 700 }}>{renderValue(value, suffix, prefix)}</Typography>
          </Box>
          {icon && (
            <Box sx={{ color: accent, p: 1, borderRadius: 2, bgcolor: `${accent}12`, display: 'grid', placeItems: 'center' }}>
              {icon}
            </Box>
          )}
        </Stack>
        {helper && <Typography variant="body2" color="text.secondary" sx={{ mt: 1.4, minHeight: 38 }}>{helper}</Typography>}
        {typeof progress === 'number' && (
          <LinearProgress
            variant="determinate"
            value={Math.max(0, Math.min(100, progress))}
            sx={{
              mt: 2.2,
              height: 6,
              borderRadius: 999,
              bgcolor: '#F3F4F6',
              '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: accent }
            }}
          />
        )}
      </CardContent>
    </GlassCard>
  );
}
