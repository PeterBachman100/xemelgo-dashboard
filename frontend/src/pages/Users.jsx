import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Users = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Users</Typography>
    <Paper sx={{ p: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="textSecondary">User Permissions & Directory (Coming Soon)</Typography>
    </Paper>
  </Box>
);

export default Users;