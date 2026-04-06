import { Box, CssBaseline, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { formatLabel } from "../../utils/stringUtils";

const MainLayout = () => {
  const location = useLocation();

  // Dynamically generate the title from the path
  // e.g., "/work-orders/123" -> "Work Orders"
  const getPageTitle = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return "Dashboard";
    
    // We take the first segment and format it (e.g. "work-orders" -> "Work Orders")
    return formatLabel(pathSegments[0]);
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        minHeight: "100vh", 
        bgcolor: "background.default" 
      }}
    >
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header /> 
        
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 2 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              letterSpacing: '-0.02em', 
              color: 'text.primary' 
            }}
          >
            {getPageTitle()}
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 2, md: 4 }, flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;