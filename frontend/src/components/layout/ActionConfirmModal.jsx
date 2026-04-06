import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Box 
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const ActionConfirmModal = ({ open, onClose, onConfirm, action }) => {
  // Configuration for terminal states only
  const actionConfigs = {
    consume: {
      title: "Confirm Consumption",
      text: "Are you sure you want to consume this item? This action is permanent and will remove the item from active inventory tracking.",
      color: "error",
      icon: <WarningAmberIcon color="error" />,
      buttonText: "Confirm Consumption"
    },
    complete: {
      title: "Mark as Completed",
      text: "Setting this item to 'Completed' signifies all work is finished. This moves the item to a terminal history state.",
      color: "success",
      icon: <CheckCircleOutlineIcon color="success" />,
      buttonText: "Mark Completed"
    }
  };

  // Identify current config or return null if action isn't terminal (like 'missing')
  const current = actionConfigs[action];

  if (!current) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, px: 1, py: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {current.icon}
        {current.title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: 'text.primary', fontSize: '0.95rem' }}>
          {current.text}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit" 
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={current.color}
          autoFocus
          sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
        >
          {current.buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionConfirmModal;
