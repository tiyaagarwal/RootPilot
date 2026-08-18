import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Typography, Stack, Grid, Chip, Skeleton, Button, Paper, Divider, alpha, Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { infrastructureService } from '../services/platformServices';
import { ReliabilityTimeline } from '../components/shared/ReliabilityTimeline';
import { NarrativeBanner } from '../components/ai/NarrativeBanner';

const STATUS_COLORS: Record<string, string> = {
  HEALTHY: '#22c55e', DEGRADED: '#f59e0b', DOWN: '#ef4444', UNKNOWN: '#6b7280',
};

const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  LEARNING:   { label: '🔄 Collecting Baseline', color: '#6b7280' },
  SUFFICIENT: { label: '📊 Calibrating',          color: '#f59e0b' },
  RICH:       { label: '✅ Rich Intelligence',    color: '#22c55e' },
};

const RISK_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e', UNKNOWN: '#6b7280' };

function KpiCard({ label, value, subValue, color }: { label: string; value: string; subValue?: string; color?: string }) {
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, color: color ?? 'text.primary' }}>
        {value}
      </Typography>
      {subValue && (
        <Typography variant="caption" color="text.secondary">{subValue}</Typography>
      )}
    </Paper>
  );
}

export function ServiceProfilePage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const decoded = decodeURIComponent(serviceName ?? '');

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['service-profile', decoded],
    queryFn: () => infrastructureService.serviceProfile(decoded),
    enabled: !!decoded,
    staleTime: 120_000,
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={240} height={36} sx={{ mb: 2 }} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={6} sm={4} key={i}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (isError || !profile) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Profile unavailable for "{decoded}"</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/service-intelligence')} variant="outlined">
          Back to Service Intelligence
        </Button>
      </Box>
    );
  }

  const isLearning = profile.dataAvailability === 'LEARNING';
  const statusColor = STATUS_COLORS[profile.currentStatus] ?? '#6b7280';
  const tier = TIER_CONFIG[profile.dataAvailability] ?? TIER_CONFIG.LEARNING;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      {/* Back */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/service-intelligence')} size="small" sx={{ mb: 2 }}
        aria-label="Back to Service Intelligence">
        Service Intelligence
      </Button>

      {/* Hero */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h5" fontWeight={700}>{profile.serviceName}</Typography>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: statusColor, mt: 0.5 }} aria-label={`Status: ${profile.currentStatus}`} />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>{profile.serviceType}</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Chip label={tier.label} size="small" sx={{ color: tier.color, bgcolor: alpha(tier.color, 0.1), border: `1px solid ${alpha(tier.color, 0.25)}` }} />
          <Chip label={profile.currentStatus} size="small" sx={{ color: statusColor, bgcolor: alpha(statusColor, 0.1) }} />
        </Stack>
      </Stack>

      {/* KPI Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4}>
          <KpiCard
            label="Reliability Score"
            value={isLearning ? '—' : profile.reliabilityScore !== null ? `${profile.reliabilityScore}%` : 'N/A'}
            subValue={isLearning ? `${profile.incidentCount}/5 incidents recorded` : undefined}
            color={profile.reliabilityScore !== null && !isLearning && profile.reliabilityScore < 70 ? '#ef4444' : undefined}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <KpiCard
            label="Operational Risk"
            value={isLearning ? '—' : profile.operationalRiskScore !== null ? `${profile.operationalRiskScore}%` : 'N/A'}
            color={profile.operationalRiskScore !== null && !isLearning && profile.operationalRiskScore > 50 ? '#ef4444' : undefined}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <KpiCard
            label="MTTR (Estimated)"
            value={profile.mttr ?? '—'}
            subValue={profile.mttr ? 'From incident intervals' : 'Need ≥2 incidents'}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <KpiCard
            label="Change Failure Rate"
            value={profile.changeFailureRate !== null ? `${profile.changeFailureRate}%` : '—'}
            subValue={profile.changeFailureRate !== null ? 'Incidents within 30min of changes' : 'No change history'}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <KpiCard
            label="Total Incidents"
            value={`${profile.incidentCount}`}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <KpiCard
            label="Dependency Risk"
            value={profile.dependencyRiskLevel}
            subValue={`${profile.dependencyCount} connected services`}
            color={RISK_COLORS[profile.dependencyRiskLevel]}
          />
        </Grid>
      </Grid>

      {/* Reliability Timeline */}
      <Box sx={{ mb: 3 }}>
        <ReliabilityTimeline serviceName={profile.serviceName} />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Narrative */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>AI Narrative</Typography>
        <NarrativeBanner narrative={profile.serviceNarrative} />
      </Box>

      {/* LEARNING alert */}
      {isLearning && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={700} gutterBottom>Service in Learning Mode</Typography>
          <Typography variant="body2">
            RootPilot has recorded {profile.incidentCount} incident{profile.incidentCount !== 1 ? 's' : ''} for {profile.serviceName}.
            Reliability scoring, MTTR calculation, and change failure rate become available after 5 incidents.
            Continue sending telemetry via OpenTelemetry to unlock full intelligence.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
