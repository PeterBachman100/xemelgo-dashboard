import React from "react";
import { Breadcrumbs, Link, Typography, alpha } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { formatLabel } from "../../utils/stringUtils";
import { TOKENS } from "../../theme/tokens";

const BreadcrumbsNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs 
      separator={
        <NavigateNextIcon 
          sx={{ 
            fontSize: "1.1rem", 
            color: TOKENS.neutral.main, 
            opacity: 0.5 
          }} 
        />
      } 
      sx={{ 
        '& .MuiBreadcrumbs-li': { 
          fontSize: '0.85rem',
          letterSpacing: '0.01em'
        } 
      }}
    >
      {/* Root Link */}
      <Link 
        component={RouterLink} 
        underline="hover" 
        to="/"
        sx={{ 
          color: TOKENS.neutral.text,
          fontWeight: 500,
          transition: 'color 0.2s',
          "&:hover": { color: "primary.main" }
        }}
      >
        Dashboard
      </Link>
      
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        
        // Use our utility to handle "work-orders" -> "Work Orders"
        const label = formatLabel(value);

        return isLast ? (
          <Typography 
            key={to} 
            sx={{ 
              fontWeight: 700, // Bold current page
              color: "text.primary",
            }}
          >
            {label}
          </Typography>
        ) : (
          <Link 
            key={to} 
            component={RouterLink} 
            underline="hover" 
            to={to}
            sx={{ 
              color: TOKENS.neutral.text,
              fontWeight: 500,
              transition: 'color 0.2s',
              "&:hover": { color: "primary.main" }
            }}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;