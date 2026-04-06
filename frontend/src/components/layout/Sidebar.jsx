import React from "react";
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, Box, Divider, ButtonBase, alpha 
} from "@mui/material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { LAYOUT } from "../../theme/tokens";

const drawerWidth = 200;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Items", icon: <InventoryIcon />, path: "/items" },
    { text: "Locations", icon: <LocationOnIcon />, path: "/locations" },
    { text: "Events", icon: <EventNoteIcon />, path: "/events" },
    { text: "Users", icon: <PeopleIcon />, path: "/users" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: "border-box",
          // Using theme variables for borders and background
          borderRight: (theme) => `1px solid ${theme.palette.divider}`, 
          bgcolor: "background.paper"
        },
      }}
    >
      <Box 
        sx={{ 
          height: LAYOUT.headerHeight, 
          display: 'flex', 
          alignItems: 'center', 
          px: 2 // Adjusted slightly to account for ButtonBase internal padding
        }}
      >
        <ButtonBase
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            p: 1, // Provides a nice hit-box for the link
            borderRadius: 2,
            transition: "background-color 0.2s",
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04), 
            },
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800, 
              color: "primary.main",
              letterSpacing: "-0.02em",
              lineHeight: 1 // Keeps it perfectly centered in the fixed-height box
            }}
          >
            XEMELGO
          </Typography>
        </ButtonBase>
      </Box>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => {
          // Check if current path matches item path
          const isSelected = location.pathname === item.path || 
                           (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    // Syncing the active state with our primary brand color
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    color: "primary.main",
                    "& .MuiListItemIcon-root": { color: "primary.main" },
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                    }
                  },
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: "0.9rem", 
                    fontWeight: isSelected ? 700 : 500 // Bolder text for active state
                  }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;