import React from 'react';
import { Chip, useTheme } from '@mui/material';
import { formatLabel } from '../../utils/stringUtils';

const ActionChip = ({ action, size = "small", sx = {}, ...props }) => {
  const theme = useTheme();
  
  // Use 'move' as a fallback if the action isn't found
  const config = theme.palette.action?.[action] || theme.palette.action.move;

  return (
    <Chip
      label={formatLabel(action)}
      size={size}
      sx={{
        bgcolor: config.bg,
        color: config.text,
        border: config.border,
        fontWeight: config.fontWeight,
        
        // Structural Styles
        fontSize: '0.65rem',
        letterSpacing: '0.05em',
        borderRadius: '6px',
        height: '24px',
        cursor: 'default',
        ...sx
      }}
      {...props}
    />
  );
};

export default ActionChip;