import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api/axiosConfig";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [locationHighlight, setLocationHighlight] = useState(null);
  const [userHighlight, setUserHighlight] = useState(null);

  // Unified fetch to get item data and available locations
  const fetchData = useCallback(async () => {
    try {
      const [itemRes, locRes] = await Promise.all([
        api.get(`/items/${id}`),
        api.get("/locations"),
      ]);
      setItem(itemRes.data);
      setLocations(locRes.data);
      
      // Pre-select current location if it exists
      if (itemRes.data.currentLocation) {
        setSelectedLocation(itemRes.data.currentLocation._id);
      }
    } catch (err) {
      console.error("Error fetching detail data", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (actionIntent) => {
    setActionLoading(true);

    // V4.1 Semantic Endpoint Mapping
    const endpointMap = {
      move: "move",
      scan: "scan",
      receive: "receive",
      missing: "mark-missing",
      consume: "consume",
      complete: "complete",
    };

    const endpoint = endpointMap[actionIntent];
    const targetLocation = locations.find((l) => l._id === selectedLocation);

    try {
      // Body only required for physical movements
      const payload = ["move", "scan", "receive"].includes(endpoint) 
        ? { newLocationId: selectedLocation, newLocationName: targetLocation?.name }
        : {};

      await api.patch(`/items/${id}/${endpoint}`, payload);

      // Re-fetch entire object to ensure local state and history stay in sync
      await fetchData();
      
      alert(`Action '${actionIntent}' successful.`);
    } catch (err) {
      console.error("Action failed", err);
      alert(err.response?.data?.message || "Action failed. Check API compliance.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  
  if (!item) return <Alert severity="error">Item not found</Alert>;

  const isTerminal = ["consumed", "complete"].includes(item.status);
  const isMissing = item.status === "missing";

  // Filter history: Location History only shows events where a location was recorded
  const locationHistory = item.history || [];
  const fullActionHistory = item.history || [];

  const historyColumns = [
    {
      field: "createdAt",
      headerName: "Date/Time",
      width: 180,
      valueFormatter: (value) => new Date(value).toLocaleString(),
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value.replace("-", " ").toUpperCase()}
          size="small"
          variant="outlined"
          color={params.value === 'missing' ? 'error' : 'default'}
        />
      ),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      valueGetter: (params) => params?.name || "N/A",
      renderCell: (params) => (
        <Typography variant="body2" color={!params.value || params.value === "N/A" ? "textSecondary" : "textPrimary"}>
          {params.value || "N/A"}
        </Typography>
      )
    },
    {
      field: "user",
      headerName: "Performed By",
      width: 150,
      valueGetter: (value) => value?.name || "System",
    },
  ];

  return (
    <Box sx={{ p: 4, width: '100%', boxSizing: 'border-box' }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate("/")} 
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Grid container spacing={4}>
        
        {/* LEFT COLUMN: ACTION CENTER */}
        <Grid item xs={12} md={4} lg={3}> 
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Action Center
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {isMissing && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Item is MISSING. Update location to recover.
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                select
                fullWidth
                label="Target Location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                disabled={isTerminal}
              >
                {locations.map((loc) => (
                  <MenuItem key={loc._id} value={loc._id}>{loc.name}</MenuItem>
                ))}
              </TextField>

              {/* Primary Movement Button: Maps to semantic intent */}
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleAction(
                  item.solutionType === "inventory" ? "scan" : 
                  item.solutionType === "workOrder" ? "receive" : "move"
                )}
                disabled={isTerminal || actionLoading}
              >
                {isMissing ? "Found & Relocate" : 
                 item.solutionType === "inventory" ? "Scan to Shelf" : 
                 item.solutionType === "workOrder" ? "Receive at Station" : "Move Asset"}
              </Button>

              {/* Mark Missing: Only for Assets */}
              {item.solutionType === "asset" && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleAction("missing")}
                  disabled={isTerminal || isMissing || actionLoading}
                >
                  Mark as Missing
                </Button>
              )}

              <Divider />

              {/* Terminal Actions */}
              {(item.solutionType === "inventory" || item.solutionType === "workOrder") && (
                <Button
                  variant="contained"
                  color={item.solutionType === "workOrder" ? "primary" : "success"}
                  onClick={() => handleAction(item.solutionType === "workOrder" ? "complete" : "consume")}
                  disabled={isTerminal || isMissing || actionLoading}
                >
                  {item.solutionType === "workOrder" ? "Complete Work Order" : "Consume Inventory"}
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: INFO & HISTORY */}
        <Grid item xs={12} md={8} lg={9} sx={{flexGrow: 1}}>
          <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{item.name}</Typography>
              <Chip
                label={item.status.toUpperCase()}
                color={item.status === "active" ? "success" : "default"}
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Solution Type</Typography>
                <Typography variant="body1" sx={{ textTransform: "capitalize" }}>{item.solutionType}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">Current Location</Typography>
                <Typography variant="body1" sx={{ color: !item.currentLocation ? 'text.secondary' : 'text.primary' }}>
                  {item.currentLocation?.name || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Location History</Typography>
            <Box sx={{ height: 350, mb: 4, width: '100%' }}>
              <DataGrid 
                rows={locationHistory} 
                columns={historyColumns} 
                getRowId={(r) => r._id} 
                density="compact" 
                hideFooter 
                autosizeOnMount
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                
                getRowClassName={(params) => {
    // If the row's location ID matches the one in our 'locationHighlight' state
    return params.row.location?._id === locationHighlight ? 'highlighted-row' : '';
  }}

  // 2. The "Dashboard Style" Event Listeners
  slotProps={{
    row: {
      onMouseEnter: (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        // Find the specific history entry we are hovering over
        const targetRow = locationHistory.find(r => r._id === id);
        // If it has a location object, save that location's _id to state
        if (targetRow?.location?._id) {
          setLocationHighlight(targetRow.location._id);
        }
      },
      onMouseLeave: () => setLocationHighlight(null),
      onClick: (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const targetRow = locationHistory.find(r => r._id === id);
        if (targetRow?.location?._id) {
          setLocationHighlight(targetRow.location._id);
        }
      }
    }
  }}

  sx={{
    border: "none",
    "& .highlighted-row": {
      // Using the same blue highlight style as your main dashboard
      bgcolor: "rgba(25, 118, 210, 0.12) !important",
      transition: "background-color 0.15s ease",
      cursor: 'pointer'
    },
    "& .MuiDataGrid-cell:focus": {
      outline: "none",
    },
  }}
              />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Full Action Audit</Typography>
            <Box sx={{ height: 350, width: '100%' }}>
              <DataGrid 
                rows={fullActionHistory} 
                columns={historyColumns} 
                getRowId={(r) => r._id || Math.random()} 
                density="compact" 
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} 
                autosizeOnMount
                hideFooterSelectedRowCount
                disableRowSelectionOnClick
                getRowClassName={(params) => {
    return params.row.user?._id === userHighlight ? 'highlighted-row-user' : '';
  }}

  // 2. The Dashboard Style Event Listeners
  slotProps={{
    row: {
      onMouseEnter: (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        // Find the specific history entry in the audit array
        const targetRow = fullActionHistory.find(r => r._id === id);
        // Save the performing user's _id to state
        if (targetRow?.user?._id) {
          setUserHighlight(targetRow.user._id);
        }
      },
      onMouseLeave: () => setUserHighlight(null),
      onClick: (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const targetRow = fullActionHistory.find(r => r._id === id);
        if (targetRow?.user?._id) {
          setUserHighlight(targetRow.user._id);
        }
      }
    }
  }}

  sx={{
    border: "none",
    // 3. Green tint for User Actions to separate from Blue Location movements
    "& .highlighted-row-user": {
      bgcolor: "rgba(76, 175, 80, 0.12) !important",
      transition: "background-color 0.15s ease",
      cursor: 'pointer'
    },
    "& .MuiDataGrid-cell:focus": {
      outline: "none",
    },
  }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemDetail;