import { createTheme } from '@mui/material/styles';

const palette = {
  sage: '#6b9080',
  sageLight: '#a4c3b2',
  sageMuted: '#cce3de',
  cream: '#f7f8fa',
  paper: '#ffffff',
  ink: '#3d4a52',
  inkMuted: '#7d8b94',
  border: '#e8edf2',
  blush: '#f0e6df',
  mist: '#eaf4f1',
  warning: '#d4a574',
  error: '#d4918a',
  success: '#8fbc8f',
};

export const appColors = palette;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.sage,
      light: palette.sageLight,
      dark: '#4a6b5d',
      contrastText: '#ffffff',
    },
    secondary: {
      main: palette.sageMuted,
      contrastText: palette.ink,
    },
    background: {
      default: palette.cream,
      paper: palette.paper,
    },
    text: {
      primary: palette.ink,
      secondary: palette.inkMuted,
    },
    divider: palette.border,
    success: { main: palette.success, light: '#e8f5e9' },
    warning: { main: palette.warning, light: '#faf3eb' },
    error: { main: palette.error, light: '#faf0ee' },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), "Segoe UI", system-ui, sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.02em', color: palette.ink },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, fontSize: '1.05rem' },
    subtitle1: { fontWeight: 500 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 1px 3px rgba(61, 74, 82, 0.04)',
    '0 4px 14px rgba(61, 74, 82, 0.06)',
    '0 8px 24px rgba(61, 74, 82, 0.08)',
    ...Array(21).fill('0 8px 24px rgba(61, 74, 82, 0.08)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.cream,
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, ${palette.mist} 0%, transparent 50%)`,
          minHeight: '100vh',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${palette.border}`,
          boxShadow: '0 2px 12px rgba(61, 74, 82, 0.04)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(61, 74, 82, 0.07)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '8px 20px' },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(107, 144, 128, 0.25)' },
        },
        outlined: {
          borderColor: palette.border,
          color: palette.ink,
          '&:hover': { borderColor: palette.sageLight, backgroundColor: palette.mist },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: palette.paper,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
        filled: { border: 'none' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 8, backgroundColor: palette.mist },
        bar: { borderRadius: 8 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 20, padding: 8 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        standardInfo: { backgroundColor: palette.mist, color: palette.ink },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: palette.inkMuted,
          '&:hover': { backgroundColor: palette.mist, color: palette.sage },
        },
      },
    },
  },
});

export const categoryColors = {
  Food: { bg: '#faf3eb', color: '#9a7b5c' },
  Grocery: { bg: '#eaf4f1', color: '#5a7d72' },
  Fuel: { bg: '#eef0f4', color: '#6b7280' },
  Shopping: { bg: '#f5eef8', color: '#8b7a94' },
  EMI: { bg: '#f0f4fa', color: '#6b7d94' },
  Bills: { bg: '#faf0ee', color: '#9a7a72' },
  Entertainment: { bg: '#f8f0f5', color: '#947a8b' },
  Travel: { bg: '#eef6fa', color: '#5a8494' },
  Medical: { bg: '#f0faf0', color: '#5a8a6a' },
  Other: { bg: '#f4f4f5', color: '#7a7a82' },
};
