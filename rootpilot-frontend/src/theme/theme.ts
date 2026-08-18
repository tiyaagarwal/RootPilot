import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => {
  const isLight = mode === 'light';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#3B82F6', // Observability Blue
        dark: '#1D4ED8',
        light: '#60A5FA',
      },
      secondary: {
        main: '#64748B', // Slate Grey
        dark: '#475569',
        light: '#94A3B8',
      },
      background: {
        default: isLight ? '#F8FAFC' : '#0B0E14',
        paper: isLight ? '#FFFFFF' : '#111622',
      },
      divider: isLight ? '#E2E8F0' : '#242C3F',
      text: {
        primary: isLight ? '#0F172A' : '#E2E8F0',
        secondary: isLight ? '#475569' : '#94A3B8',
        disabled: isLight ? '#94A3B8' : '#64748B',
      },
      error: {
        main: '#EF4444',
        light: '#F87171',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
      },
      info: {
        main: '#3B82F6',
        light: '#60A5FA',
      },
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      fontSize: 13,
      htmlFontSize: 16,
      h1: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' },
      h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0em' },
      subtitle1: { fontSize: '0.85rem', fontWeight: 500 },
      subtitle2: { fontSize: '0.75rem', fontWeight: 500 },
      body1: { fontSize: '0.85rem', lineHeight: 1.6 }, // Increased line spacing to declutter
      body2: { fontSize: '0.75rem', lineHeight: 1.5, color: isLight ? '#475569' : '#94A3B8' },
      caption: { fontSize: '0.68rem', lineHeight: 1.3 },
      button: { textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' },
    },
    shape: {
      borderRadius: 8, // Premium softer rounded corners
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isLight ? '#FFFFFF' : '#111622',
            border: isLight ? '1px solid #E2E8F0' : '1px solid #242C3F',
            boxShadow: isLight ? '0 2px 4px rgba(0,0,0,0.02)' : 'none',
            transition: 'transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.22s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isLight 
                ? '0 12px 20px -8px rgba(0, 0, 0, 0.08)' 
                : '0 12px 24px -10px rgba(0, 0, 0, 0.5)',
              borderColor: '#3B82F6',
            },
          },
        },
      },
      MuiCardHeader: {
        styleOverrides: {
          root: {
            padding: '12px 16px',
            borderBottom: isLight ? '1px solid #E2E8F0' : '1px solid #242C3F',
            backgroundColor: isLight ? '#F1F5F9' : '#151C2C',
          },
          title: {
            fontSize: '0.82rem',
            fontWeight: 700,
            color: isLight ? '#0F172A' : '#E2E8F0',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            padding: '16px',
            '&:last-child': {
              paddingBottom: '16px',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            borderRadius: 6,
            padding: '5px 12px',
            transition: 'all 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            textTransform: 'none',
            fontWeight: 600,
            '&:active': {
              transform: 'scale(0.96)',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isLight 
                ? '0 4px 10px rgba(59, 130, 246, 0.2)' 
                : '0 4px 12px rgba(59, 130, 246, 0.35)',
              filter: 'brightness(1.06)',
            },
          },
          outlined: {
            '&:hover': {
              backgroundColor: isLight ? 'rgba(59, 130, 246, 0.04)' : 'rgba(59, 130, 246, 0.08)',
              borderColor: '#3B82F6',
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '10px 16px', // Spacious cells to declutter dense listings
            borderColor: isLight ? '#E2E8F0' : '#242C3F',
            fontSize: '0.78rem',
            color: isLight ? '#334155' : '#E2E8F0',
          },
          head: {
            backgroundColor: isLight ? '#F1F5F9' : '#151C2C',
            fontWeight: 750,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isLight ? '#475569' : '#94A3B8',
            paddingTop: '10px',
            paddingBottom: '10px',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isLight ? 'rgba(0, 0, 0, 0.01)' : 'rgba(255, 255, 255, 0.015)',
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              fontSize: '0.8rem',
              backgroundColor: isLight ? '#FFFFFF' : '#0B0E14',
              '& fieldset': {
                borderColor: isLight ? '#E2E8F0' : '#242C3F',
              },
              '&:hover fieldset': {
                borderColor: '#3B82F6',
              },
            },
          },
        },
      },
      MuiChip: {
        defaultProps: {
          size: 'small',
        },
        styleOverrides: {
          root: {
            borderRadius: 4,
            fontWeight: 600,
            fontSize: '0.68rem',
            height: '20px',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isLight ? '#E2E8F0' : '#242C3F',
          },
        },
      },
    },
  });
};
