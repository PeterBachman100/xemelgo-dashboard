import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppDataGrid from "../common/AppDataGrid";
import ActionChip from "../common/ActionChip";
import { TOKENS } from "../../theme/tokens";
import api from "../../api/axiosConfig";

const EventList = ({ height = 750, showToolbar = true, limit = null }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        // Apply limit for dashboard "Recent Activity" context
        const data = limit ? response.data.slice(0, limit) : response.data;
        setEvents(data);
      } catch (err) {
        console.error("Audit Log Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [location, limit]);

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 130,
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
      headerName: "Context",
      flex: 1,
      valueGetter: (v) => v?.name || "—",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: TOKENS.neutral.text }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: "user",
      headerName: "User",
      width: 150,
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
      headerName: "Time",
      width: 160,
      valueFormatter: (value) => {
        if (!value) return "—";
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
        showToolbar={showToolbar}
        initialState={{
          pagination: { paginationModel: { pageSize: limit || 25 } },
        }}
        sx={{
          height: height,
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

export default EventList;