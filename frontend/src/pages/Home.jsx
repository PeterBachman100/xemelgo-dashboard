import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Smart List components
import ItemList from '../components/tables/ItemList';
import EventList from '../components/tables/EventList';
import UserList from '../components/tables/UserList';
import LocationList from '../components/tables/LocationList';

/**
 * SectionHeader: A reusable sub-component for dashboard widget titles.
 */
const SectionHeader = ({ title, path, navigate }) => (
  <Box 
    sx={{ 
      mb: 2, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    }}
  >
    <Typography 
      variant="h6" 
      sx={{ 
        fontWeight: 800, 
        letterSpacing: '-0.01em'
      }}
    >
      {title}
    </Typography>
    <Button 
      size="small" 
      endIcon={<ArrowForwardIcon />} 
      onClick={() => navigate(path)}
      sx={{ 
        fontWeight: 700, 
        textTransform: 'none', 
        borderRadius: 2,
        '&:hover': { bgcolor: 'action.hover' }
      }}
    >
      View All
    </Button>
  </Box>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, pb: 8 }}>
      <Grid container spacing={5}>
        
        {/* --- TOP ROW: PRIMARY LOGISTICS --- */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionHeader 
            title="Items" 
            path="/items" 
            navigate={navigate} 
          />
          <ItemList 
            height={600} 
            showToolbar={false} 
            limit={10} 
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionHeader 
            title="Events" 
            path="/events" 
            navigate={navigate} 
          />
          <EventList 
            height={600} 
            showToolbar={false} 
            limit={10} 
          />
        </Grid>

        {/* --- BOTTOM ROW: DIRECTORIES --- */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionHeader 
            title="Users" 
            path="/users" 
            navigate={navigate} 
          />
          <UserList 
            height={380} 
            showToolbar={false} 
            limit={5} 
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionHeader 
            title="Locations" 
            path="/locations" 
            navigate={navigate} 
          />
          <LocationList 
            height={380} 
            showToolbar={false} 
            limit={5} 
          />
        </Grid>

      </Grid>
    </Box>
  );
};

export default Home;