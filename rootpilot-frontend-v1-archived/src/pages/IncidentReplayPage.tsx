import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Typography, Stack, Button, Chip, Divider, Skeleton, alpha, IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { incidentService } from '../services/platformServices';
import type { ReplayPhase, ReplayPhaseType } from '../types/backend';

const PHASE_CONFIG: Record<ReplayPhaseType, { color: string; icon: string }> = {
  DETECTION:          { color: '#ef4444', icon: '🔴' },
  CHANGE_EVENT:       { color: '#f59e0b', icon: '🚀' },
  DEPENDENCY_CASCADE: { color: '#f97316', icon: '🔗' },
  RCA:                { color: '#a855f7', icon: '🧠' },
  BLAST_RADIUS:       { color: '#ec4899', icon: '💥' },
  REMEDIATION:        { color: '#06b6d4', icon: '⚙️' },
  RECOVERY:           { color: '#22c55e', icon: '✅' },
};

const SEVERITY_COLORS = { INFO: '#6366f1', WARNING: '#f59e0b', CRITICAL: '#ef4444' };

function PhaseCard({ phase, index, isActive, onClick }: {
  phase: ReplayPhase; index: number; isActive: boolean; onClick: () => void;
}) {
  const cfg = PHASE_CONFIG[phase.phase] ?? PHASE_CONFIG.DETECTION;
  const time = new Date(phase.timestamp).toLocaleString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Box
        onClick={onClick}
        sx={{
          position: 'relative',
          pl: 5, pb: 2.5, cursor: 'pointer',
          borderLeft: '2px solid',
          borderColor: isActive ? cfg.color : alpha(cfg.color, 0.25),
          transition: 'border-color 0.3s',
          ml: 1,
          '&:last-child': { borderLeft: 'none', pb: 0 },
        }}
      >
        {/* Phase dot */}
        <Box sx={{
          position: 'absolute',
          left: -18, top: 0,
          width: 34, height: 34,
          borderRadius: '50%',
          bgcolor: isActive ? cfg.color : alpha(cfg.color, 0.2),
          border: '2px solid',
          borderColor: cfg.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
          transition: 'background 0.3s',
          boxShadow: isActive ? `0 0 12px ${alpha(cfg.color, 0.5)}` : 'none',
        }}>
          {cfg.icon}
        </Box>

        {/* Card body */}
        <Box sx={{
          p: 2, borderRadius: 2,
          border: '1px solid',
          borderColor: isActive ? cfg.color : 'divider',
          bgcolor: isActive ? alpha(cfg.color, 0.06) : 'background.paper',
          transition: 'all 0.3s',
          boxShadow: isActive ? `0 4px 16px ${alpha(cfg.color, 0.15)}` : 'none',
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Typography variant="subtitle2" fontWeight={700}>{phase.title}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">{time}</Typography>
              <Chip
                label={phase.severity}
                size="small"
                sx={{
                  fontSize: '0.65rem', height: 18,
                  bgcolor: alpha(SEVERITY_COLORS[phase.severity], 0.12),
                  color: SEVERITY_COLORS[phase.severity],
                }}
              />
            </Stack>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
            {phase.description}
          </Typography>

          {isActive && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Divider sx={{ my: 1.25 }} />
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.disabled" fontWeight={600}>Evidence Type</Typography>
                  <Chip label={phase.evidenceType} size="small"
                    sx={{ fontSize: '0.65rem', height: 18, bgcolor: 'action.selected' }} />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', wordBreak: 'break-word' }}>
                  {phase.evidenceDetail}
                </Typography>
              </Stack>
            </motion.div>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

export function IncidentReplayPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const incidentId = Number(id);

  const { data: timeline, isLoading, isError } = useQuery({
    queryKey: ['incident-replay', incidentId],
    queryFn: () => incidentService.replay(incidentId),
    enabled: !isNaN(incidentId),
  });

  const [activePhase, setActivePhase] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!isPlaying || !timeline) return;
    const timer = setInterval(() => {
      setActivePhase(prev => {
        if (prev >= timeline.phases.length - 1) { setIsPlaying(false); return prev; }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isPlaying, timeline]);

  const phases = timeline?.phases ?? [];

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  if (isError || !timeline) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Unable to load incident replay</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/incidents')} variant="outlined">
          Back to Incidents
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 780, mx: 'auto', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/incidents')} size="small" sx={{ mb: 1.5 }}>
          Incidents
        </Button>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h5" fontWeight={700}>Incident Replay</Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
              <Chip label={timeline.serviceName} size="small" color="primary" variant="outlined" />
              <Typography variant="caption" color="text.secondary">#{timeline.incidentId}</Typography>
              <Typography variant="caption" color="text.secondary">
                {phases.length} phase{phases.length !== 1 ? 's' : ''} reconstructed
              </Typography>
            </Stack>
          </Box>

          {/* Playback controls */}
          {phases.length > 1 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton size="small" onClick={() => setActivePhase(p => Math.max(0, p - 1))}
                disabled={activePhase === 0} aria-label="Previous phase">
                <ChevronLeftIcon />
              </IconButton>
              <Button
                variant={isPlaying ? 'contained' : 'outlined'}
                startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={() => {
                  if (isPlaying) { setIsPlaying(false); }
                  else { if (activePhase >= phases.length - 1) setActivePhase(0); setIsPlaying(true); }
                }}
                size="small"
                id="incident-replay-play-button"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <IconButton size="small" onClick={() => setActivePhase(p => Math.min(phases.length - 1, p + 1))}
                disabled={activePhase >= phases.length - 1} aria-label="Next phase">
                <ChevronRightIcon />
              </IconButton>
              <Typography variant="caption" color="text.secondary">
                {activePhase + 1} / {phases.length}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Timeline */}
      {phases.length > 0 ? (
        <Box sx={{ pl: 1 }}>
          {phases.map((ph, i) => (
            <PhaseCard
              key={i}
              phase={ph}
              index={i}
              isActive={i === activePhase}
              onClick={() => { setActivePhase(i); setIsPlaying(false); }}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" gutterBottom>Limited Operational History</Typography>
          <Typography variant="body2" color="text.secondary">
            Only the detection phase is available. Map service dependencies and record change events to enable richer timelines.
          </Typography>
        </Box>
      )}

      {/* Disclaimer */}
      <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          All phases are derived from real platform data. "Recovery (Estimated)" phases are clearly labeled heuristic estimates
          based on subsequent telemetry — not fabricated.
        </Typography>
      </Box>
    </Box>
  );
}
