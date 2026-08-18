import React from 'react';
import {
  Box, Typography, Chip, Collapse, IconButton, CircularProgress,
  Stack, alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { NarrativeResult } from '../../types/backend';

interface Props {
  narrative: NarrativeResult;
  isLoading?: boolean;
  compact?: boolean;
}

const CONFIDENCE_CONFIG = {
  HIGH:         { label: 'High Confidence',        color: '#22c55e', icon: '🎯' },
  MEDIUM:       { label: 'Medium Confidence',       color: '#f59e0b', icon: '⚡' },
  LOW:          { label: 'Low Confidence',          color: '#f97316', icon: '📊' },
  INSUFFICIENT: { label: 'Insufficient Evidence',  color: '#6b7280', icon: '🔍' },
};

export function NarrativeBanner({ narrative, isLoading, compact }: Props) {
  const [evidenceOpen, setEvidenceOpen] = React.useState(false);

  if (isLoading) {
    return (
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{
        p: 2, borderRadius: 2, bgcolor: 'action.hover',
        border: '1px solid', borderColor: 'divider',
      }}>
        <CircularProgress size={16} />
        <Typography variant="body2" color="text.secondary">
          Analyzing operational patterns…
        </Typography>
      </Stack>
    );
  }

  const cfg = CONFIDENCE_CONFIG[narrative.confidence] ?? CONFIDENCE_CONFIG.INSUFFICIENT;

  return (
    <Box sx={{
      borderRadius: 2,
      border: '1px solid',
      borderColor: alpha(cfg.color, 0.3),
      bgcolor: alpha(cfg.color, 0.06),
      overflow: 'hidden',
    }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 2.5, py: compact ? 1.25 : 1.5, borderBottom: `1px solid ${alpha(cfg.color, 0.15)}` }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <span>{cfg.icon}</span>
          <Typography variant="subtitle2" fontWeight={700}>AI Narrative</Typography>
        </Stack>
        <Chip
          label={cfg.label}
          size="small"
          sx={{
            bgcolor: alpha(cfg.color, 0.15),
            color: cfg.color,
            fontWeight: 600,
            fontSize: '0.7rem',
            border: `1px solid ${alpha(cfg.color, 0.3)}`,
          }}
        />
      </Stack>

      {/* Body */}
      <Box sx={{ px: 2.5, py: compact ? 1.25 : 1.75 }}>
        <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
          {narrative.narrative}
        </Typography>
      </Box>

      {/* Evidence Sources */}
      {narrative.evidenceSources && narrative.evidenceSources.length > 0 && (
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer', width: 'fit-content' }}
            onClick={() => setEvidenceOpen(o => !o)}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Evidence Sources ({narrative.evidenceSources.length})
            </Typography>
            <IconButton size="small" sx={{ p: 0 }}>
              {evidenceOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </IconButton>
          </Stack>
          <Collapse in={evidenceOpen}>
            <Box component="ul" sx={{ mt: 0.75, pl: 2, m: 0, listStyle: 'none' }}>
              {narrative.evidenceSources.map((src, i) => (
                <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, py: 0.25 }}>
                  <Box sx={{ mt: 0.6, width: 6, height: 6, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
                  <Typography variant="caption" color="text.secondary">{src}</Typography>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Rule tag */}
      <Box sx={{
        px: 2.5, py: 0.75,
        borderTop: `1px solid ${alpha(cfg.color, 0.15)}`,
        bgcolor: alpha(cfg.color, 0.04),
      }}>
        <Typography variant="caption" color="text.disabled">
          Rule: <code style={{ background: 'rgba(0,0,0,0.08)', padding: '0 4px', borderRadius: 4 }}>{narrative.ruleMatched}</code>
        </Typography>
      </Box>
    </Box>
  );
}
