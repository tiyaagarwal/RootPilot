import React from 'react';
import { Card, CardContent, Typography, Button, Stack, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorStateProps {
  title?: string;
  queryKey?: string[];
  refetch?: () => void;
}

export function ErrorState({ title = 'Telemetry Stream Offline', refetch }: ErrorStateProps) {
  return (
    <Box sx={{ py: 6, display: 'grid', placeItems: 'center', width: '100%' }}>
      <Card sx={{ maxWidth: 440, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Stack spacing={2.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'grid',
                placeItems: 'center',
                color: '#EF4444',
              }}
            >
              <ErrorOutlineIcon />
            </Box>
            <Box>
              <Typography variant="h4" color="error.main" sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The platform encountered an issue retrieving real-time data from the Spring Boot backend server. Ensure the service is active on your workspace.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => window.location.reload()}
                sx={{ borderColor: '#242C3F', color: 'text.secondary' }}
              >
                Reload Window
              </Button>
              {refetch && (
                <Button variant="contained" color="primary" size="small" onClick={refetch}>
                  Retry Connection
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
