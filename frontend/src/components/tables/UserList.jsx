import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import AppDataGrid from "../common/AppDataGrid";
import { TOKENS } from "../../theme/tokens";
import api from "../../api/axiosConfig";

const UserList = ({ height = 750, showToolbar = true, limit = null }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        const data = limit ? response.data.slice(0, limit) : response.data;
        setUsers(data);
      } catch (err) {
        console.error("User Directory Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [limit]);

  const columns = [
    {
      field: "name",
      headerName: "User",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{params.value}</Typography>
      ),
    },
    {
      field: "role",
      headerName: "Permissions",
      width: 120,
      renderCell: (params) => {
        const isAdmin = params.value === "admin";
        return (
          <Chip
            label={params.value.toUpperCase()}
            size="small"
            sx={{
              fontWeight: 700, fontSize: "0.6rem", borderRadius: "6px",
              bgcolor: isAdmin ? TOKENS.success.bg : TOKENS.neutral.bg,
              color: isAdmin ? TOKENS.success.text : TOKENS.neutral.text,
              border: isAdmin ? TOKENS.success.border : `1px solid ${TOKENS.neutral.main}33`,
            }}
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Joined",
      width: 120,
      valueFormatter: (value) => new Date(value).toLocaleDateString(),
    }
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <AppDataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        showToolbar={showToolbar}
        initialState={{ pagination: { paginationModel: { pageSize: limit || 15 } } }}
        sx={{ 
          height, bgcolor: "background.paper", borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          '& .MuiDataGrid-columnHeaders': { bgcolor: (theme) => theme.palette.grey[50] }
        }}
      />
    </Box>
  );
};

export default UserList;