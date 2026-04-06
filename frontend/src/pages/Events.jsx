import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import AppDataGrid from "../components/common/AppDataGrid";
import ActionChip from "../components/common/ActionChip";
import { TOKENS } from "../theme/tokens";
import api from "../api/axiosConfig";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (err) {
        console.error("Audit Log Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 140,
      renderCell: (params) => <ActionChip action={params.value} />
    },
    {
      field: "itemId",
      headerName: "Item",
      flex: 1,
      valueGetter: (v) => v?.name || "Deleted Item",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      valueGetter: (v) => v?.name || "N/A",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: TOKENS.neutral.text }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: "user",
      headerName: "User",
      width: 180,
      valueGetter: (v) => v?.name || "System",
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ color: "text.secondary", fontWeight: 600, fontSize: '0.85rem' }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: "createdAt",
      headerName: "Timestamp",
      width: 200,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleString([], {
          dateStyle: "short",
          timeStyle: "short",
        });
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <AppDataGrid
        rows={events}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        getHighlightValue={(row) => row.itemId?._id || row.itemId}
        showToolbar
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
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

export default Events;