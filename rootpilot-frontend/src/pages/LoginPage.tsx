import React, { useState } from 'react';
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
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import ShieldIcon from '@mui/icons-material/Shield';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

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
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0B0E14',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 380, px: 2 }}>
        {/* Logo Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 0.5,
              display: 'grid',
              placeItems: 'center',
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            }}
          >
            <BoltIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography variant="h2" fontWeight={850} sx={{ fontSize: '1.25rem', letterSpacing: '-0.03em' }}>
            RootPilot <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary', fontSize: '0.9rem' }}>v2</Box>
          </Typography>
        </Stack>

        <Card sx={{ border: '1px solid #242C3F', backgroundColor: '#111622' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h4" fontWeight={750} sx={{ mb: 0.5 }}>
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Access your AIOps operational command center.
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  py: 0.2,
                  fontSize: '11px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#FCA5A5',
                  '& .MuiAlert-icon': { color: '#EF4444', fontSize: '16px', mt: 'auto', mb: 'auto' },
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  autoFocus
                  InputLabelProps={{ style: { fontSize: '12px' } }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  InputLabelProps={{ style: { fontSize: '12px' } }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ py: 1, fontWeight: 700, fontSize: '13px' }}
                >
                  {loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Log In'}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 2.5 }} />

            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ShieldIcon sx={{ fontSize: 13, color: '#10B981' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
                  JWT-secured console session.
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: '9px' }}>
                Default demo users: admin, sre, operator, viewer (password: rootpilot)
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
