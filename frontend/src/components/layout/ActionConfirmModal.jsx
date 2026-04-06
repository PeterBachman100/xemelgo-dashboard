import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogContentText, 
  DialogActions, Button 
} from '@mui/material';
import { TOKENS, ACTION_MAP } from '../../theme/tokens';
import { formatLabel } from '../../utils/stringUtils';

const ActionConfirmModal = ({ open, onClose, onConfirm, action }) => {
  // Derive styling directly from our Action Map
  const token = ACTION_MAP[action];

  // Simplified config focused purely on custom text
  const actionConfigs = {
    consume: {
      text: "Are you sure you want to consume this inventory? This action is permanent.",
      buttonText: "Confirm Consumption",
    },
    complete: {
      text: "Are you sure you want to complete this work order? This action is permanent.",
      buttonText: "Mark Completed",
    },
    missing: {
      text: "Are you sure you want to flag this item as missing? This will trigger an alert.",
      buttonText: "Flag as Missing",
    }
  };

  const config = actionConfigs[action];
  if (!config || !token) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 } 
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 800, 
        // Simple title, colored based on action severity
        color: token.text 
      }}>
        Confirm {formatLabel(action)}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: 'text.primary', fontSize: '0.95rem' }}>
          {config.text}
        </DialogContentText>
      </DialogContent>

      <DialogActions 
        sx={{ 
          pb: 2, 
          px: 3, 
          gap: 2, // Slightly increased gap for centered layout
          // Center the actions horizontally
          justifyContent: 'center' 
        }}
      >
        <Button 
          onClick={onClose} 
          sx={{ 
            textTransform: 'none', 
            fontWeight: 600, 
            color: TOKENS.neutral.text 
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          autoFocus
          sx={{ 
            textTransform: 'none', 
            fontWeight: 700, 
            px: 3,
            borderRadius: 2,
            bgcolor: token.main,
            '&:hover': {
              bgcolor: token.text // Darker shade for hover feedback
            }
          }}
        >
          {config.buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionConfirmModal;