import React from 'react';
import { Chip, useTheme } from '@mui/material';

const StatusChip = ({ status, size = "small", sx = {}, ...props }) => {
  const theme = useTheme();
  
  // Normalize and find config
  const normalizedStatus = status?.toLowerCase() || 'active';
  const config = theme.palette.status[normalizedStatus] || theme.palette.status.active;

  return (
    <Chip
      label={status?.toUpperCase()}
      size={size}
      sx={{
        // All these values now come directly from your theme "source of truth"
        bgcolor: config.bg,
        color: config.text,
        border: config.border,
        fontWeight: config.fontWeight,
        
        // Consistent structural styles
        fontSize: '0.65rem',
        letterSpacing: '0.05em',
        borderRadius: '6px',
        height: '24px', // Keeps them consistent in tables
        cursor: 'default',
        ...sx
      }}
      {...props}
    />
  );
};

export default StatusChip;