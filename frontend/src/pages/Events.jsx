import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Events = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>System Events</Typography>
    <Paper sx={{ p: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="textSecondary">Full Audit Log & System Events (Coming Soon)</Typography>
    </Paper>
  </Box>
);

export default Events;