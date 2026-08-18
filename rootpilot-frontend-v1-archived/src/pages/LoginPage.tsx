import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/client';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { motion, AnimatePresence } from 'framer-motion';

// ── Animated canvas particles ─────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Array<{
      x: number; y: number; vx: number; vy: number; r: number; alpha: number;
    }> = [];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
  );
}

// ── Rotating taglines ─────────────────────────────────────────────────────────
const TAGLINES = [
  'Resolve Incidents Before Your Users Notice',
  'AI That Shows Its Work, Every Time',
  'From Alert to Root Cause in Minutes',
  'Autonomous AIOps — Built for Modern Engineering',
];

const STATS = [
  { icon: <SpeedIcon fontSize="small" />, value: '3×', label: 'Faster MTTR' },
  { icon: <AutoFixHighIcon fontSize="small" />, value: '90%', label: 'Noise Reduced' },
  { icon: <ShieldIcon fontSize="small" />, value: '24/7', label: 'Autonomous Watch' },
];

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [taglineIdx, setTaglineIdx] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  // Cycle taglines
  useEffect(() => {
    const t = setInterval(() => setTaglineIdx((i) => (i + 1) % TAGLINES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password });
      const { token, role } = response.data;
      login(token, response.data.username, role);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const msg = (err.response.data as { message?: string })?.message ?? 'Invalid credentials';
        setError(msg);
      } else {
        setError('Connection failed. Verify the backend service is active.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #020817 0%, #0F1117 40%, #0D1340 70%, #050B20 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated network background */}
      <ParticleCanvas />

      {/* Ambient glow orbs */}
      <Box sx={{
        position: 'absolute', top: '10%', left: '15%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        filter: 'blur(40px)', zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute', bottom: '15%', right: '10%',
        width: 350, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
        filter: 'blur(40px)', zIndex: 0,
      }} />

      {/* Left branding panel — hidden on mobile */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          px: 8,
          zIndex: 1,
          position: 'relative',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            <Box
              sx={{
                width: 52, height: 52, borderRadius: 2.5,
                display: 'grid', placeItems: 'center',
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                boxShadow: '0 0 32px rgba(99,102,241,0.5)',
              }}
            >
              <BoltIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#E2E8F0" sx={{ letterSpacing: '-.03em' }}>
                RootPilot
              </Typography>
              <Typography variant="caption" color="rgba(148,163,184,0.8)" fontWeight={600} sx={{ fontSize: 11, letterSpacing: '.08em' }}>
                AUTONOMOUS AIOPS
              </Typography>
            </Box>
          </Stack>
        </motion.div>

        {/* Animated tagline */}
        <Box sx={{ mb: 5, minHeight: 120 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={taglineIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
            >
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  color: '#E2E8F0',
                  letterSpacing: '-.04em',
                  lineHeight: 1.2,
                  fontSize: { lg: '2rem', xl: '2.4rem' },
                  mb: 2,
                }}
              >
                {TAGLINES[taglineIdx]}
              </Typography>
            </motion.div>
          </AnimatePresence>
          <Typography variant="body1" color="rgba(148,163,184,0.85)" sx={{ mt: 1, lineHeight: 1.7 }}>
            Connect telemetry, detect anomalies, and resolve incidents autonomously — all from a single platform built on open standards.
          </Typography>
        </Box>

        {/* Stats row */}
        <Stack direction="row" spacing={4}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              <Stack alignItems="flex-start" spacing={0.5}>
                <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: '#6366F1' }}>
                  {s.icon}
                  <Typography variant="h4" fontWeight={900} color="#E2E8F0" sx={{ letterSpacing: '-.04em' }}>
                    {s.value}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="rgba(148,163,184,0.7)" fontWeight={600} sx={{ letterSpacing: '.04em', fontSize: 10 }}>
                  {s.label}
                </Typography>
              </Stack>
            </motion.div>
          ))}
        </Stack>

        {/* Feature chips */}
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 5, gap: 1 }}>
          {['Real-time SSE', 'AI Root Cause', 'Knowledge Graph', 'Autonomous Healing', 'OpenTelemetry'].map((f) => (
            <Chip
              key={f}
              label={f}
              size="small"
              sx={{
                bgcolor: 'rgba(99,102,241,0.12)',
                color: 'rgba(165,180,252,0.9)',
                border: '1px solid rgba(99,102,241,0.25)',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Right — Login form panel */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: '100%', lg: '480px' },
          flexShrink: 0,
          px: { xs: 3, sm: 4 },
          py: 6,
          zIndex: 1,
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          {/* Mobile logo — only shown on small screens */}
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 5, display: { lg: 'none' } }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2,
              display: 'grid', placeItems: 'center',
              background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            }}>
              <BoltIcon sx={{ color: '#fff' }} />
            </Box>
            <Typography variant="h6" fontWeight={800} color="#E2E8F0">RootPilot</Typography>
          </Stack>

          {/* Card */}
          <Box
            sx={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              background: 'rgba(22, 27, 39, 0.85)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 3,
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
              p: { xs: 3.5, sm: 4.5 },
            }}
          >
            <Typography variant="h5" fontWeight={800} color="#E2E8F0" sx={{ mb: 0.75, letterSpacing: '-.03em' }}>
              Sign in to your workspace
            </Typography>
            <Typography variant="body2" color="rgba(148,163,184,0.8)" sx={{ mb: 3.5 }}>
              Access your AIOps command center
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  bgcolor: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#FCA5A5',
                  borderRadius: 2,
                  '& .MuiAlert-icon': { color: '#EF4444' },
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoFocus
                  autoComplete="username"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'rgba(15,17,23,0.6)',
                      color: '#E2E8F0',
                      '& fieldset': { borderColor: 'rgba(99,102,241,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.4)' },
                      '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(148,163,184,0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#818CF8' },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'rgba(15,17,23,0.6)',
                      color: '#E2E8F0',
                      '& fieldset': { borderColor: 'rgba(99,102,241,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.4)' },
                      '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(148,163,184,0.7)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#818CF8' },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.4,
                    fontWeight: 700,
                    fontSize: 15,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563EB, #4F46E5)',
                      boxShadow: '0 6px 28px rgba(99,102,241,0.55)',
                    },
                    '&.Mui-disabled': { opacity: 0.6 },
                  }}
                >
                  {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3, borderColor: 'rgba(99,102,241,0.15)' }} />

            {/* Trust signals */}
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ShieldIcon sx={{ fontSize: 14, color: '#10B981' }} />
                <Typography variant="caption" color="rgba(148,163,184,0.6)" sx={{ fontSize: '0.72rem' }}>
                  JWT-secured · End-to-end encrypted in transit
                </Typography>
              </Stack>
              <Typography variant="caption" color="rgba(100,116,139,0.5)" sx={{ fontSize: '0.68rem' }}>
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </Typography>
            </Stack>
          </Box>

          {/* Bottom link */}
          <Typography variant="caption" color="rgba(100,116,139,0.5)" textAlign="center" display="block" sx={{ mt: 3 }}>
            Don't have an account?{' '}
            <Box
              component="span"
              sx={{ color: '#818CF8', cursor: 'pointer', '&:hover': { color: '#A5B4FC' } }}
            >
              Contact your administrator
            </Box>
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
}
