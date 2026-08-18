import React from 'react';
import { Chip, Stack, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { usePlatformQuery } from '../../hooks/usePlatformQuery';
import { dashboardService } from '../../services/platformServices';

export function DataSourceIndicator() {
  const ping = usePlatformQuery(['top-bar-snapshot'], dashboardService.snapshot, {
    refetchInterval: 15_000
  });

  const isConnected = !ping.isError && ping.data !== undefined;

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '9px', letterSpacing: '0.05em' }}>
        DATA SOURCE:
      </Typography>
      <Chip
        icon={isConnected ? <StorageIcon sx={{ fontSize: 12 }} /> : <LinkOffIcon sx={{ fontSize: 12 }} />}
        label={ping.isLoading ? 'CONNECTING...' : isConnected ? 'REAL BACKEND' : 'API FAILURE'}
        size="small"
        sx={{
          height: 20,
          fontSize: '9px',
          fontWeight: 800,
          px: 0.5,
          backgroundColor: ping.isLoading ? 'rgba(59,130,246,0.1)' : isConnected ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: ping.isLoading ? '#60A5FA' : isConnected ? '#10B981' : '#EF4444',
          border: '1px solid',
          borderColor: ping.isLoading ? 'rgba(59,130,246,0.3)' : isConnected ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
          '& .MuiChip-icon': {
            color: 'inherit',
            ml: 0.5
          }
        }}
      />
    </Stack>
  );
}
