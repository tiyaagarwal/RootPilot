import React from 'react';
import { Box, Chip } from '@mui/material';

interface StatusPillProps {
  value: string;
}

export function StatusPill({ value }: StatusPillProps) {
  const normVal = (value || '').toUpperCase().trim();

  let color = '#3B82F6'; // Info blue default
  let bg = 'rgba(59, 130, 246, 0.1)';
  let border = 'rgba(59, 130, 246, 0.2)';

  if (normVal === 'CRITICAL' || normVal === 'DOWN' || normVal === 'VIOLATED') {
    color = '#EF4444'; // Red
    bg = 'rgba(239, 68, 68, 0.1)';
    border = 'rgba(239, 68, 68, 0.25)';
  } else if (normVal === 'WARNING' || normVal === 'DEGRADED' || normVal === 'ELEVATED_RISK' || normVal === 'HIGH') {
    color = '#F59E0B'; // Amber
    bg = 'rgba(245, 158, 11, 0.1)';
    border = 'rgba(245, 158, 11, 0.25)';
  } else if (normVal === 'HEALTHY' || normVal === 'COMPLIANT' || normVal === 'STABLE' || normVal === 'SUCCESS' || normVal === 'UP') {
    color = '#10B981'; // Green
    bg = 'rgba(16, 185, 129, 0.1)';
    border = 'rgba(16, 185, 129, 0.25)';
  } else if (normVal === 'MEDIUM') {
    color = '#A855F7'; // Purple
    bg = 'rgba(168, 85, 247, 0.1)';
    border = 'rgba(168, 85, 247, 0.25)';
  } else if (normVal === 'LOW' || normVal === 'INFO') {
    color = '#3B82F6'; // Blue
    bg = 'rgba(59, 130, 246, 0.1)';
    border = 'rgba(59, 130, 246, 0.25)';
  }

  return (
    <Chip
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
          <span>{value}</span>
        </Box>
      }
      sx={{
        backgroundColor: bg,
        color: color,
        border: '1px solid',
        borderColor: border,
        fontWeight: 700,
        fontSize: '10px',
        fontFamily: 'var(--font-sans)',
      }}
    />
  );
}
