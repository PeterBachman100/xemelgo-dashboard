import React from 'react';
import { Chip, useTheme } from '@mui/material';
import { formatLabel } from '../../utils/stringUtils';

const ActionChip = ({ action, size = "small", sx = {}, ...props }) => {
  const theme = useTheme();
  
  // Normalizing the key: mapping the DB 'past tense' to the Theme 'present tense'
  const actionKeyMap = {
    scanned: 'scan',
    received: 'receive',
    moved: 'move',
    consumed: 'consume',
    completed: 'complete',
    missing: 'missing'
  };

  const normalizedAction = actionKeyMap[action] || action;
  const config = theme.palette.action?.[normalizedAction] || theme.palette.action.move;

  return (
    <Chip
      label={formatLabel(action)}
      size={size}
      sx={{
        bgcolor: config.bg,
        color: config.text,
        border: config.border,
        fontWeight: config.fontWeight || 600,
        
        // Structural Styles
        fontSize: '0.65rem',
        letterSpacing: '0.05em',
        borderRadius: '6px',
        height: '24px',
        cursor: 'default',
        textTransform: 'uppercase', // Professional "Kirkland" label look
        ...sx
      }}
      {...props}
    />
  );
};

export default ActionChip;