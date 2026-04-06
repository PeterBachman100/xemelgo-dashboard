import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Home = () => (
  <Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 4, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="textSecondary">Activity Charts & Key Metrics (Coming Soon)</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 4, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="textSecondary">Quick Stats</Typography>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default Home;