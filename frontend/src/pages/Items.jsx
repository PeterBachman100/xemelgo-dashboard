import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip, IconButton, Tooltip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AppDataGrid from "../components/common/AppDataGrid"; // Import our wrapper
import api from "../api/axiosConfig";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items");
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [location]);

  const columns = [
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const colors = {
          active: "success",
          missing: "warning",
          consumed: "default",
          complete: "primary",
        };
        return (
          <Chip
            label={params.value.toUpperCase()}
            color={colors[params.value] || "default"}
            size="small"
          />
        );
      },
    },
    { field: "name", headerName: "Item Name", flex: 1, fontWeight: "bold" },
    {
      field: "solutionType",
      headerName: "Type",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
          {params.value === "workOrder" ? "Work Order" : params.value}
        </Typography>
      ),
    },
    { 
      field: 'currentLocation', 
      headerName: 'Location', 
      flex: 1,
      valueGetter: (value) => value?.name || 'N/A'
    },
    {
      field: "lastUpdatedAt",
      headerName: "Last Update",
      width: 180,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleString([], { 
          dateStyle: 'short', 
          timeStyle: 'short' 
        });
      },
    },
    {
      field: "lastUpdatedBy",
      headerName: "Updated By",
      width: 150,
      valueGetter: (value) => value?.name || "System",
    },
    {
      field: "actions",
      headerName: "View",
      sortable: false,
      width: 70,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title="See Details">
          <IconButton onClick={() => navigate(`/items/${params.row._id}`)}>
            <VisibilityIcon color="primary" fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>Inventory</Typography>
      
      <AppDataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        // This replaces all that manual onMouseEnter logic
        getHighlightValue={(row) => row.solutionType} 
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        // Override the autoHeight if you want a fixed-height scrollable list for the main view
        sx={{ height: 700, bgcolor: 'background.paper' }}
      />
    </Box>
  );
};

export default Items;