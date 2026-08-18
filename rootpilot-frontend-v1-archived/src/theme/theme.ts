import { createTheme, Theme } from '@mui/material/styles';

const baseTypography = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  h3: { fontWeight: 700, letterSpacing: '-.03em' },
  h4: { fontWeight: 700, letterSpacing: '-.02em' },
  h5: { fontWeight: 600, letterSpacing: '-.01em' },
  h6: { fontWeight: 600 },
  button: { fontWeight: 600, letterSpacing: '.01em' },
  overline: { fontWeight: 700, letterSpacing: '.08em', fontSize: '0.7rem' },
};

const baseShape = { borderRadius: 10 };

export function buildTheme(mode: 'light' | 'dark'): Theme {
  const isDark = mode === 'dark';

  // Enterprise palettes — no pure black/white
  const bg = isDark
    ? { default: '#0F1117', paper: '#161B27' }
    : { default: '#F4F6F9', paper: '#FFFFFF' };

  const primary = { main: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8' };
  const success = { main: '#10B981', light: '#34D399', dark: '#059669' };
  const warning = { main: '#F59E0B', light: '#FCD34D', dark: '#D97706' };
  const error   = { main: '#EF4444', light: '#F87171', dark: '#DC2626' };
  const info    = { main: '#6366F1', light: '#818CF8', dark: '#4F46E5' };

  const text = isDark
    ? { primary: '#E2E8F0', secondary: '#94A3B8', disabled: '#475569' }
    : { primary: '#111827', secondary: '#6B7280', disabled: '#9CA3AF' };

  const divider = isDark ? 'rgba(148,163,184,0.10)' : '#E5E7EB';

  return createTheme({
    palette: {
      mode,
      background: bg,
      primary,
      secondary: { main: '#6B7280', light: '#9CA3AF', dark: '#4B5563' },
      success,
      warning,
      error,
      info,
      text,
      divider,
    },
    typography: baseTypography,
    shape: baseShape,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap')",
          body: {
            minHeight: '100vh',
            backgroundColor: bg.default,
            color: text.primary,
            transition: 'background-color 0.2s ease, color 0.2s ease',
          },
          '*::-webkit-scrollbar': { width: 6, height: 6 },
          '*::-webkit-scrollbar-track': {
            background: isDark ? '#1E293B' : '#F1F5F9',
          },
          '*::-webkit-scrollbar-thumb': {
            background: isDark ? '#334155' : '#CBD5E1',
            borderRadius: 99,
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: isDark ? '#475569' : '#94A3B8',
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: bg.paper,
            border: `1px solid ${divider}`,
            boxShadow: isDark
              ? '0 1px 4px rgba(0,0,0,0.4)'
              : '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
            borderRadius: 10,
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${primary.main}, ${primary.dark})`,
            boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: divider,
            padding: '10px 16px',
          },
          head: {
            color: text.secondary,
            backgroundColor: isDark ? '#1E293B' : '#F9FAFB',
            fontWeight: 600,
            borderBottom: `2px solid ${divider}`,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: isDark ? '#161B27' : '#FFFFFF',
            borderRight: `1px solid ${divider}`,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1E293B' : '#F9FAFB',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            fontSize: '0.72rem',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDark ? '#334155' : '#1E293B',
            fontSize: '0.75rem',
            borderRadius: 6,
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundColor: bg.paper,
            backgroundImage: 'none',
            border: `1px solid ${divider}`,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: divider },
        },
      },
    },
  });
}
