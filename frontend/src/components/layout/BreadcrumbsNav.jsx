import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Map your paths to the labels you want shown in the UI
const breadcrumbNameMap = {
  "/items": "Items",
  "/locations": "Locations",
  "/users": "Users",
  "/events": "Events",
  "/home": "Overview",
};

const BreadcrumbsNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />} 
      sx={{ '& .MuiBreadcrumbs-li': { fontSize: '0.875rem' } }}
    >
      <Link component={RouterLink} underline="hover" color="inherit" to="/">
        Dashboard
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const label = breadcrumbNameMap[to] || value;

        return last ? (
          <Typography 
            key={to} 
            color="text.primary" 
            sx={{ fontWeight: 700, textTransform: "capitalize" }}
          >
            {label}
          </Typography>
        ) : (
          <Link 
            key={to} 
            component={RouterLink} 
            underline="hover" 
            color="inherit" 
            sx={{ textTransform: "capitalize" }} 
            to={to}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;