import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Avatar,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import UserSwitchModal from "./UserSwitchModal";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "../../api/axiosConfig";

const Header = () => {
  const { user, logout } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingUser, setPendingUser] = useState("");

  useEffect(() => {
    api.get("/users").then((res) => setStaffList(res.data));
  }, []);

  // This is the trigger for the User Switch flow we planned
  const handleUserChange = (event) => {
    const selectedName = event.target.value;
    if (selectedName !== user.name) {
      setPendingUser(selectedName);
      setModalOpen(true);
    }
  };

  const handleModalClose = (success) => {
    setModalOpen(false);
    if (!success) setPendingUser(""); // Reset if they cancelled
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: "1px solid #e0e0e0",
        bgcolor: "white",
        color: "text.primary",
      }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700 }}>
          XEMELGO{" "}
          <span style={{ fontWeight: 300, color: "#666" }}>| Dashboard</span>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <Select
              value={user?.name || ""}
              onChange={handleUserChange}
              displayEmpty
              sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
              {staffList.map((u) => (
                <MenuItem key={u._id} value={u.name}>
                  {u.name} ({u.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            onClick={logout}
            color="inherit"
            startIcon={<LogoutIcon />}
            sx={{ textTransform: "none" }}>
            Logout
          </Button>
        </Box>

        <UserSwitchModal 
            open={modalOpen} 
            onClose={handleModalClose} 
            targetUser={pendingUser} 
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
