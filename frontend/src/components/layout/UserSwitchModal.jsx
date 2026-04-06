import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

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
      onClose(true); // Success
    } catch (err) {
      setError('Invalid password for ' + targetUser);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="xs">
      <DialogTitle>Confirm Switch to {targetUser}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          inputRef={passwordInputRef}
          autoFocus
          margin="dense"
          label="Enter Password"
          type="password"
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Verify & Switch
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserSwitchModal;