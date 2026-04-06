import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Chip } from "@mui/material";
import AppDataGrid from "../components/common/AppDataGrid";
import { TOKENS } from "../theme/tokens";
import api from "../api/axiosConfig";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (err) {
        console.error("User Directory Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "User Name",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "role",
      headerName: "Permissions",
      width: 140,
      renderCell: (params) => {
        const isAdmin = params.value === "admin";
        return (
          <Chip
            label={params.value.toUpperCase()}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.05em",
              borderRadius: "6px",
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
      headerName: "Member Since",
      width: 200,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      },
    },
    {
      field: "_id",
      headerName: "User ID",
      width: 220,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ color: "text.disabled", fontFamily: "monospace" }}>
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <AppDataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        showToolbar
        initialState={{
          pagination: { paginationModel: { pageSize: 15 } },
        }}
        sx={{
          height: 750,
          bgcolor: "background.paper",
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: (theme) => theme.palette.grey[50],
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: (theme) => `1px solid ${theme.palette.grey[100]}`,
          },
        }}
      />
    </Box>
  );
};

export default Users;