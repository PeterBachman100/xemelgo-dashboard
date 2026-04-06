import { AppBar, Toolbar, Box } from "@mui/material";
import BreadcrumbsNav from "./BreadcrumbsNav";
import UserMenu from "./UserMenu"; 
import { LAYOUT } from "../../theme/tokens";

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "transparent", // Blends with MainLayout background
        color: "text.primary",
        border: "none", // No line, just clean space
      }}
    >
      <Toolbar 
        sx={{ 
          height: LAYOUT.headerHeight,
          display: "flex", 
          justifyContent: "space-between",
          px: LAYOUT.pagePadding
        }}
      >
        <BreadcrumbsNav />
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;