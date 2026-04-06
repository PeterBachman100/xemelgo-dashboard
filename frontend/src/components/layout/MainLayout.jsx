import { Box, CssBaseline, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const routeConfig = {
  "/": "Home",
  "/items": "Items",
  "/locations": "Locations",
  "/users": "Users",
  "/events": "Events",
};

const MainLayout = () => {

  const location = useLocation();
  
  const currentPath = Object.keys(routeConfig).find(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );
  const pageTitle = routeConfig[currentPath] || "Dashboard";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
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
            {pageTitle}
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
