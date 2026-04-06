import React, { useEffect, useState } from "react";
import { Typography, IconButton, Tooltip, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AppDataGrid from "../common/AppDataGrid"; 
import StatusChip from "../common/StatusChip";
import { formatLabel } from "../../utils/stringUtils";
import { TOKENS } from "../../theme/tokens";
import api from "../../api/axiosConfig";

const ItemList = ({ height = 750, showToolbar = true, limit = null }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/items");
        // Apply limit if passed (useful for dashboard 'Recent Items' view)
        const data = limit ? res.data.slice(0, limit) : res.data;
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [location, limit]);

  const columns = [
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />
    },
    { 
      field: "name", 
      headerName: "Item Name", 
      flex: 1, 
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: "solutionType",
      headerName: "Type",
      width: 120,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ color: "text.secondary", fontWeight: 600, fontSize: '0.85rem' }}
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
      headerName: "Updated",
      width: 160,
      valueFormatter: (value) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleString([], { 
          dateStyle: 'short', 
          timeStyle: 'short' 
        });
      },
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
        showToolbar={showToolbar}
        initialState={{
          pagination: { paginationModel: { pageSize: limit || 15 } },
        }}
        sx={{ 
          height: height, 
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
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

export default ItemList;