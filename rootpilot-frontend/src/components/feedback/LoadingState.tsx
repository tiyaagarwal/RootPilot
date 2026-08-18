import React from 'react';
import { Box, Card, CardContent, Skeleton, Grid } from '@mui/material';

interface LoadingStateProps {
  cards?: number;
}

export function LoadingState({ cards = 3 }: LoadingStateProps) {
  return (
    <Box sx={{ width: '100%', py: 2 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={120} height={16} />
        <Skeleton variant="text" width={280} height={32} />
        <Skeleton variant="text" width={400} height={20} />
      </Box>

      {/* Grid of Skeleton Cards */}
      <Grid container spacing={2}>
        {Array.from({ length: cards }).map((_, idx) => (
          <Grid item xs={12} md={12 / Math.min(cards, 4)} key={idx}>
            <Card sx={{ height: 160 }}>
              <CardContent sx={{ p: 2 }}>
                <Skeleton variant="circular" width={24} height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="85%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={16} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Table Skeleton */}
      <Card sx={{ mt: 3, p: 2 }}>
        <Skeleton variant="rectangular" height={32} sx={{ mb: 1, borderRadius: 0.5 }} />
        <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 0.5 }} />
      </Card>
    </Box>
  );
}
