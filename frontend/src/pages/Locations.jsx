import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Locations = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Locations</Typography>
    <Paper sx={{ p: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="textSecondary">Locations Management Table (Coming Soon)</Typography>
    </Paper>
  </Box>
);

export default Locations;