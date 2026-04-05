import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useLocation } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from "../api/axiosConfig";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlight, setHighlight] = useState(null);
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
    { field: "name", headerName: "Item Name", flex: 1, fontWeight: "bold" },
    {
      field: "solutionType",
      headerName: "Type",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
          {params.value === "workOrder" ? "Work Order" : params.value}
        </Typography>
      ),
    },
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
            color={colors[params.value]}
            size="small"
          />
        );
      },
    },
    { 
      field: 'currentLocation', 
      headerName: 'Location', 
      flex: 1,
      // Fixed valueGetter for nested data
      valueGetter: (value) => value?.name || 'N/A'
    },
    {
      field: "actions",
      headerName: "View",
      sortable: false,
      width: 80,
      renderCell: (params) => (
        <Tooltip title="See Details">
          <IconButton onClick={() => navigate(`/items/${params.row._id}`)}>
            <VisibilityIcon color="primary" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Items
      </Typography>

      <Paper elevation={2} sx={{ height: 600, width: "100%", borderRadius: 2 }}>
        <DataGrid
          rows={items}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          hideFooterSelectedRowCount
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          
          getRowClassName={(params) => 
            params.row.solutionType === highlight ? 'highlighted-row' : ''
          }
          
          slotProps={{
            row: {
              onMouseEnter: (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const targetRow = items.find(r => r._id === id);
                if (targetRow) setHighlight(targetRow.solutionType);
              },
              onMouseLeave: () => setHighlight(null),
              onClick: (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const targetRow = items.find(r => r._id === id);
                if (targetRow) setHighlight(targetRow.solutionType);
              }
            }
          }}
          
          sx={{
            border: "none",
            "& .highlighted-row": {
              bgcolor: "rgba(25, 118, 210, 0.08) !important", // !important ensures it beats default row zebra striping
              transition: "background-color 0.15s ease",
              cursor: 'pointer'
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Items;