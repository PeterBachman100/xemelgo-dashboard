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

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightType, setHighlightType] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch all items on mount
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

  // Columns definition for MUI DataGrid
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
  // MUI DataGrid provides 'row' directly in the params object
  valueGetter: (value, row) => {
    // If your version of MUI is 6+, it uses (value, row)
    // If it's version 5, it uses (params)
    return row?.currentLocation?.name || 'N/A';
  },
  // If the above doesn't work (depending on your MUI version), 
  // use this bulletproof renderCell approach as a fallback:
  renderCell: (params) => params.row?.currentLocation?.name || 'N/A'
},
    {
      field: "actions",
      headerName: "View",
      sortable: false,
      width: 80,
      renderCell: (params) => (
        <Tooltip title="See Details">
          <IconButton onClick={() => navigate(`/inventory/${params.row._id}`)}>
            <VisibilityIcon color="primary" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Inventory Management
      </Typography>

      <Paper elevation={2} sx={{ height: 600, width: "100%", borderRadius: 2 }}>
        <DataGrid
          rows={items}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          // Requirement 1B: Relational Highlighting Logic
          onRowMouseEnter={(params) =>
            setHighlightType(params.row.solutionType)
          }
          onRowMouseLeave={() => setHighlightType(null)}
          getRowClassName={(params) => {
            if (!params || !params.row) return "";
            return params.row.solutionType === highlightType
              ? "highlighted-row"
              : "";
          }}
          sx={{
            border: "none",
            "& .highlighted-row": {
              bgcolor: "rgba(25, 118, 210, 0.08)", // Light blue highlight
              transition: "background-color 0.2s ease",
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

export default Dashboard;
