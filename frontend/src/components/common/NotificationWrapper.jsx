import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import { ACTION_MAP, TOKENS } from '../../theme/tokens';
import { getNotificationMessage } from '../../utils/notificationUtils';

const NotificationContext = createContext();

/**
 * NotificationProvider
 * Global wrapper to handle descriptive snackbars for Xemelgo actions.
 * Uses design tokens for consistent Slate/Blue/Green/Red styling.
 */
export const NotificationProvider = ({ children }) => {
  const [snack, setSnack] = useState({ 
    open: false, 
    message: '', 
    action: 'move' 
  });

  const notify = (action, item) => {
    setSnack({
      open: true,
      message: getNotificationMessage(action, item),
      action: action,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  // 1. Determine severity for MUI Accessibility icons
  const getSeverity = () => {
    if (snack.action === 'error' || snack.action === 'missing') return 'error';
    if (['complete', 'consume'].includes(snack.action)) return 'success';
    return 'info'; // Default blue for standard operations
  };

  // 2. Map actions to our specific design tokens
  const token = ACTION_MAP[snack.action] || TOKENS.neutral;

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={(props) => <Slide {...props} direction="left" />}
      >
        <Alert 
          onClose={handleClose} 
          severity={getSeverity()}
          variant="filled"
          sx={{ 
            width: '100%', 
            borderRadius: 2,
            fontWeight: 600,
            fontSize: '0.9rem',
            // Custom background logic to stay synced with theme.js
            bgcolor: (theme) => {
              const severity = getSeverity();
              if (severity === 'error') return TOKENS.error.main;
              if (severity === 'info') return theme.palette.primary.main;
              return token.main; // Success/Archive Green
            },
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiAlert-icon': {
              fontSize: '1.25rem'
            }
          }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

/**
 * useNotify Hook
 * Usage: const notify = useNotify();
 * notify('move', itemData);
 */
export const useNotify = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotify must be used within a NotificationProvider');
  }
  return context;
};