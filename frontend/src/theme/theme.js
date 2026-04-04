import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // We can toggle this to 'dark' later
    primary: {
      main: '#1976d2', // Classic Enterprise Blue
    },
    secondary: {
      main: '#f50057', // Accent for alerts/missing items
    },
    background: {
      default: '#f4f6f8',
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