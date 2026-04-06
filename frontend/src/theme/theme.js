import { createTheme } from '@mui/material/styles';
import { TOKENS } from './tokens';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { 
      main: '#1976d2' 
    },
    secondary: { 
      main: '#f50057' 
    },
    background: { 
      default: '#f4f6f8' 
    },

    status: {
      active:   { ...TOKENS.neutral },
      missing:  { ...TOKENS.error },
      complete: { ...TOKENS.success },
      consumed: { ...TOKENS.archive },
    },

    action: {
      // Standard Operations
      move:    { ...TOKENS.neutral },
      scan:    { ...TOKENS.neutral },
      receive: { ...TOKENS.neutral },

      // Terminal Operations
      consume:  { ...TOKENS.success },
      complete: { ...TOKENS.success },

      // Alert Operations
      missing:  { ...TOKENS.error },
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
});

export default theme;