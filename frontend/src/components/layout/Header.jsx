import { AppBar,Toolbar } from "@mui/material";
import BreadcrumbsNav from "./BreadcrumbsNav";
import UserMenu from "./UserMenu"; 

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "transparent",
        color: "text.primary",
        borderBottom: "1px solid #e5e7eb",
        mb: 2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <BreadcrumbsNav />
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default Header;