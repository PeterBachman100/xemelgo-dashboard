import React, { useState, useEffect } from "react";
import { Box, Select, MenuItem, Button, alpha } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import UserSwitchModal from "./UserSwitchModal";
import api from "../../api/axiosConfig";
import { TOKENS } from "../../theme/tokens"; 

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [staffList, setStaffList] = useState(
    user ? [{ _id: 'current', name: user.name }] : []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState("");

  useEffect(() => {
    api.get("/users").then((res) => setStaffList(res.data));
  }, []);

  const handleUserChange = (event) => {
    const selectedName = event.target.value;
    if (selectedName !== user?.name) {
      setPendingUser(selectedName);
      setModalOpen(true);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* User Selector styled with Neutral Tokens */}
      <Select
        value={user?.name || ""}
        onChange={handleUserChange}
        variant="standard"
        disableUnderline
        sx={{ 
          fontSize: "0.85rem", 
          fontWeight: TOKENS.neutral.fontWeight, 
          color: TOKENS.neutral.text,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
          "& .MuiSelect-select:focus": { bgcolor: "transparent" } 
        }}
      >
        {staffList.map((u) => (
          <MenuItem 
            key={u._id} 
            value={u.name}
            sx={{ fontSize: "0.85rem", fontWeight: 500 }}
          >
            {u.name}
          </MenuItem>
        ))}
      </Select>

      {/* Logout Button matching the sidebar item style */}
      <Button
        onClick={logout}
        size="small"
        startIcon={<LogoutIcon sx={{ fontSize: '1.1rem !important' }} />}
        sx={{ 
          textTransform: "none", 
          fontWeight: TOKENS.neutral.fontWeight, 
          color: TOKENS.neutral.text,
          ml: 1,
          px: 1.5,
          borderRadius: 2,
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
            color: "error.main",
          }
        }}
      >
        Logout
      </Button>

      <UserSwitchModal 
        open={modalOpen} 
        onClose={(success) => {
          setModalOpen(false);
          if (!success) setPendingUser("");
        }} 
        targetUser={pendingUser} 
      />
    </Box>
  );
};

export default UserMenu;