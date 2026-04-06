import React, { useEffect, useState } from "react";
import { Typography, IconButton, Tooltip, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AppDataGrid from "../components/common/AppDataGrid"; 
import StatusChip from "../components/common/StatusChip";
import { formatLabel } from "../utils/stringUtils";
import { TOKENS } from "../theme/tokens";
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
      width: 140,
      renderCell: (params) => <StatusChip status={params.value} />
    },
    { 
      field: "name", 
      headerName: "Item Name", 
      flex: 1, 
      // Using theme typography for consistent weight
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: "solutionType",
      headerName: "Type",
      width: 140,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary", 
            fontWeight: 600,
            fontSize: '0.85rem' 
          }}
        >
          {formatLabel(params.value)}
        </Typography>
      ),
    },
    { 
      field: 'currentLocation', 
      headerName: 'Location', 
      flex: 1,
      valueGetter: (value) => value?.name || 'N/A',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ color: TOKENS.neutral.text }}>
          {params.value}
        </Typography>
      )
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
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title="See Details">
          <IconButton 
            onClick={() => navigate(`/items/${params.row._id}`)}
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)', color: 'primary.main' } 
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <AppDataGrid
        rows={items}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        getHighlightValue={(row) => row.solutionType} 
        showToolbar
        initialState={{
          pagination: { paginationModel: { pageSize: 15 } },
        }}
        sx={{ 
          height: 750, 
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          // Soften the header look to match the "blended" layout
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: (theme) => theme.palette.grey[50],
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: (theme) => `1px solid ${theme.palette.grey[100]}`,
          }
        }}
      />
    </Box>
  );
};

export default Items;