import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Alert, Typography 
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { TOKENS } from '../../theme/tokens';

const UserSwitchModal = ({ open, onClose, targetUser }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { switchUser } = useAuth();
  const passwordInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setPassword('');
      setError('');
    }
  }, [open]);

  const handleConfirm = async () => {
    try {
      await switchUser(targetUser, password);
      setPassword('');
      setError('');
      onClose(true); 
    } catch (err) {
      setError(`Invalid password for ${targetUser}`);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose(false)} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: { borderRadius: 3, p: 1 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        Confirm Switch
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please verify the password to switch the current session to <strong>{targetUser}</strong>.
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        <TextField
          inputRef={passwordInputRef}
          autoFocus
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: 2 }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={() => onClose(false)} 
          sx={{ 
            textTransform: "none", 
            fontWeight: 600, 
            color: TOKENS.neutral.text 
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="primary" // Reverted to Primary Blue
          sx={{ 
            textTransform: "none", 
            fontWeight: 700,
            borderRadius: 2,
            px: 3
          }}
        >
          Verify & Switch
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSwitchModal;