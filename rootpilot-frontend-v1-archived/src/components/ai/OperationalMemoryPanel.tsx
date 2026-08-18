import React from 'react';
import {
  Box, Typography, Stack, Chip, alpha, LinearProgress, Tooltip,
} from '@mui/material';
import type { SimilarIncident } from '../../types/backend';

interface Props {
  incidents: SimilarIncident[];
  isLoading: boolean;
  onNavigate?: (incidentId: number) => void;
}

function ScoreRing({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const radius = 20;
  const circ = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circ;
  const color = pct >= 80 ? '#ef4444' : pct >= 60 ? '#f59e0b' : '#6366f1';

  return (
    <Tooltip title={`${pct}% similarity score`} arrow>
      <Box sx={{ flexShrink: 0 }}>
        <svg width="52" height="52" viewBox="0 0 52 52">
          <circle cx="26" cy="26" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
          <circle
            cx="26" cy="26" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={`${strokeDash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 26 26)"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
          <text x="26" y="31" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="700">{pct}%</text>
        </svg>
      </Box>
    </Tooltip>
  );
}

export function OperationalMemoryPanel({ incidents, isLoading, onNavigate }: Props) {
  if (isLoading) {
    return (
      <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>🧠 Similar Past Incidents</Typography>
        <LinearProgress sx={{ borderRadius: 4 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Searching operational memory…
        </Typography>
      </Box>
    );
  }

  if (incidents.length === 0) {
    return (
      <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" fontWeight={700} gutterBottom>🧠 Similar Past Incidents</Typography>
        <Typography variant="body2" color="text.secondary">No similar incidents found in operational memory.</Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
          Similarity is scored across service, exception type, dependencies, change events, and status code. Minimum threshold: 40%.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 1.75, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
        <Typography variant="subtitle2" fontWeight={700}>🧠 Similar Past Incidents</Typography>
        {incidents[0]?.estimatedRecoveryPattern && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
            📈 {incidents[0].estimatedRecoveryPattern}
          </Typography>
        )}
      </Box>

      <Box>
        {incidents.map((inc, idx) => (
          <Box
            key={inc.incidentId}
            onClick={() => onNavigate?.(inc.incidentId)}
            sx={{
              p: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start',
              borderBottom: idx < incidents.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              cursor: onNavigate ? 'pointer' : 'default',
              transition: 'background 0.15s',
              '&:hover': onNavigate ? { bgcolor: alpha('#6366f1', 0.04) } : {},
            }}
          >
            <ScoreRing score={inc.matchScore} />

            <Box flex={1} minWidth={0}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.25 }}>
                <Typography variant="body2" fontWeight={700} noWrap>{inc.serviceName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(inc.timestamp).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </Typography>
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                {inc.exceptionType}
              </Typography>

              <Stack direction="row" flexWrap="wrap" spacing={0.5} gap={0.5}>
                {inc.matchFactors.map((f) => (
                  <Chip key={f} label={f} size="small"
                    sx={{ fontSize: '0.65rem', height: 18, bgcolor: alpha('#6366f1', 0.1), color: '#6366f1' }} />
                ))}
                {inc.hadCorrelatedChange && (
                  <Chip label="🚀 Deployment" size="small"
                    sx={{ fontSize: '0.65rem', height: 18, bgcolor: alpha('#f59e0b', 0.12), color: '#f59e0b' }} />
                )}
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
