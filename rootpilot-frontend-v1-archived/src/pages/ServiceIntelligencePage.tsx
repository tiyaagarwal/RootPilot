import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Typography, Stack, Grid, Card, CardContent, CardActionArea,
  Chip, TextField, InputAdornment, Skeleton, alpha, LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import { infrastructureService } from '../services/platformServices';
import type { ServiceProfile } from '../types/backend';

const STATUS_COLORS: Record<string, string> = {
  HEALTHY: '#22c55e', DEGRADED: '#f59e0b', DOWN: '#ef4444', UNKNOWN: '#6b7280',
};

const TIER_CONFIG: Record<string, { label: string; color: string }> = {
  LEARNING:  { label: '🔄 Collecting Baseline', color: '#6b7280' },
  SUFFICIENT:{ label: '📊 Calibrating',          color: '#f59e0b' },
  RICH:      { label: '✅ Rich Intelligence',    color: '#22c55e' },
};

const RISK_COLORS = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e', UNKNOWN: '#6b7280' };

function ServiceCard({ profile, onClick }: { profile: ServiceProfile; onClick: () => void }) {
  const tier = TIER_CONFIG[profile.dataAvailability] ?? TIER_CONFIG.LEARNING;
  const statusColor = STATUS_COLORS[profile.currentStatus] ?? '#6b7280';
  const isLearning = profile.dataAvailability === 'LEARNING';

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card elevation={0} sx={{
        border: '1px solid', borderColor: 'divider', height: '100%',
        transition: 'all 0.2s',
        '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 20px rgba(99,102,241,0.15)', transform: 'translateY(-2px)' },
      }}>
        <CardActionArea onClick={onClick} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Name + Status */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>{profile.serviceName}</Typography>
                <Typography variant="caption" color="text.secondary">{profile.serviceType}</Typography>
              </Box>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: statusColor, mt: 0.5 }} />
            </Stack>

            {/* Tier */}
            <Typography variant="caption" fontWeight={600} sx={{ color: tier.color }}>
              {tier.label}
            </Typography>

            {/* Metrics or Learning state */}
            {isLearning ? (
              <Box>
                <LinearProgress variant="determinate" value={Math.min((profile.incidentCount / 5) * 100, 100)}
                  sx={{ borderRadius: 4, height: 6, mb: 0.75 }} />
                <Typography variant="caption" color="text.secondary">
                  {profile.incidentCount}/5 incidents recorded to unlock full intelligence
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={1}>
                {[
                  { label: 'Reliability', value: profile.reliabilityScore !== null ? `${profile.reliabilityScore}%` : 'N/A', color: profile.reliabilityScore !== null && profile.reliabilityScore < 70 ? '#ef4444' : '#22c55e' },
                  { label: 'Risk',        value: profile.operationalRiskScore !== null ? `${profile.operationalRiskScore}%` : 'N/A', color: profile.operationalRiskScore !== null && profile.operationalRiskScore > 50 ? '#ef4444' : '#22c55e' },
                ].map(({ label, value, color }) => (
                  <Grid item xs={6} key={label}>
                    <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'action.hover', textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ color }}>{value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Footer */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto', pt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {profile.dependencyCount} dep{profile.dependencyCount !== 1 ? 's' : ''}
              </Typography>
              <Typography variant="caption" fontWeight={600} sx={{ color: RISK_COLORS[profile.dependencyRiskLevel] }}>
                ● {profile.dependencyRiskLevel} dep risk
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}

export function ServiceIntelligencePage() {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState('');

  const { data: profiles, isLoading, isError } = useQuery({
    queryKey: ['service-profiles'],
    queryFn: infrastructureService.serviceProfiles,
    staleTime: 120_000,
  });

  const filtered = profiles?.filter(p =>
    !filter || p.serviceName.toLowerCase().includes(filter.toLowerCase())
  ) ?? [];

  const learningCount = profiles?.filter(p => p.dataAvailability === 'LEARNING').length ?? 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Service Intelligence</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Per-service operational profiles — reliability, risk, MTTR, and AI narratives
          </Typography>
          {learningCount > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
              {learningCount} service{learningCount !== 1 ? 's' : ''} collecting baseline data
            </Typography>
          )}
        </Box>

        {profiles && profiles.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`${profiles.length} Services`} size="small" />
            {learningCount > 0 && (
              <Chip label={`${learningCount} Learning`} size="small"
                sx={{ bgcolor: alpha('#6b7280', 0.12), color: '#6b7280' }} />
            )}
          </Stack>
        )}
      </Stack>

      {/* Search */}
      <TextField
        id="service-intelligence-search"
        size="small"
        placeholder="Filter services…"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
        }}
        sx={{ mb: 3, maxWidth: 320 }}
        aria-label="Filter services"
      />

      {/* Grid */}
      {isLoading && (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      )}

      {isError && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" gutterBottom>Unable to load service profiles</Typography>
          <Typography variant="body2" color="text.secondary">
            Ensure the backend is running and services are sending telemetry via OpenTelemetry.
          </Typography>
        </Box>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" gutterBottom>No services discovered</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto' }}>
            Connect your first service via OpenTelemetry to start building intelligence profiles.
          </Typography>
        </Box>
      )}

      {filtered.length > 0 && (
        <Grid container spacing={2}>
          {filtered.map(profile => (
            <Grid item xs={12} sm={6} lg={4} key={profile.serviceName}>
              <ServiceCard
                profile={profile}
                onClick={() => navigate(`/service-intelligence/${encodeURIComponent(profile.serviceName)}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
