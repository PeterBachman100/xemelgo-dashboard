import React, { useState, useEffect } from "react";
import { Box, Select, MenuItem, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";
import UserSwitchModal from "./UserSwitchModal";
import api from "../../api/axiosConfig";

const UserMenu = () => {
  const { user, logout } = useAuth();
  const [staffList, setStaffList] = useState([]);
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
      <Select
        value={user?.name || ""}
        onChange={handleUserChange}
        variant="standard"
        disableUnderline
        sx={{ 
          fontSize: "0.85rem", 
          fontWeight: 600, 
          color: "text.secondary",
          "& .MuiSelect-select:focus": { bgcolor: "transparent" } 
        }}
      >
        {staffList.map((u) => (
          <MenuItem key={u._id} value={u.name}>
            {u.name}
          </MenuItem>
        ))}
      </Select>

      <Button
        onClick={logout}
        color="inherit"
        size="small"
        startIcon={<LogoutIcon />}
        sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary", ml: 1 }}
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