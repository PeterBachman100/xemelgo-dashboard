import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Grid, Paper, Typography, Button, TextField, MenuItem,
  Divider, Chip, Alert, CircularProgress, Snackbar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api/axiosConfig";
import ActionConfirmModal from "../components/layout/ActionConfirmModal";

// 1. ACTION STRATEGY: Define actions by solutionType
const ACTION_CONFIGS = {
  inventory: [
    { label: "Scan to Shelf", action: "scan", color: "primary" },
    { label: "Consume Inventory", action: "consume", color: "success", terminal: true },
  ],
  workOrder: [
    { label: "Receive at Station", action: "receive", color: "primary" },
    { label: "Complete Work Order", action: "complete", color: "primary", terminal: true },
  ],
  asset: [
    { label: "Move Asset", action: "move", color: "primary" },
    { label: "Mark as Missing", action: "missing", color: "error" },
  ],
};

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Highlighting states
  const [locationHighlight, setLocationHighlight] = useState(null);
  const [userHighlight, setUserHighlight] = useState(null);
  
  const [confirmModal, setConfirmModal] = useState({ open: false, action: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchData = useCallback(async () => {
    try {
      const [itemRes, locRes] = await Promise.all([
        api.get(`/items/${id}`),
        api.get("/locations"),
      ]);
      setItem(itemRes.data);
      setLocations(locRes.data);
      if (itemRes.data.currentLocation) setSelectedLocation(itemRes.data.currentLocation._id);
    } catch (err) {
      console.error("Error fetching detail data", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (actionIntent) => {
    setActionLoading(true);
    const endpointMap = {
      move: "move", scan: "scan", receive: "receive",
      missing: "mark-missing", consume: "consume", complete: "complete",
    };

    const endpoint = endpointMap[actionIntent];
    const targetLocation = locations.find((l) => l._id === selectedLocation);

    try {
      const payload = ["move", "scan", "receive"].includes(endpoint) 
        ? { newLocationId: selectedLocation, newLocationName: targetLocation?.name }
        : {};

      await api.patch(`/items/${id}/${endpoint}`, payload);
      await fetchData();
      setSnackbar({ open: true, message: `Action '${actionIntent}' successful.`, severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Action failed.", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (!item) return <Alert severity="error">Item not found</Alert>;

  const isTerminalStatus = ["consumed", "complete"].includes(item.status);
  const history = item.history || [];

  const historyColumns = [
    { field: "createdAt", headerName: "Date/Time", width: 180, valueFormatter: (value) => new Date(value).toLocaleString() },
    { 
      field: "action", headerName: "Action", width: 150, 
      renderCell: (p) => <Chip label={p.value.replace("-", " ").toUpperCase()} size="small" variant="outlined" color={p.value === 'missing' ? 'error' : 'default'} /> 
    },
    { field: "location", headerName: "Location", flex: 1, valueGetter: (p) => p?.name || "N/A" },
    { field: "user", headerName: "Performed By", width: 150, valueGetter: (v) => v?.name || "System" },
  ];

  return (
    <Box sx={{ p: 4, width: '100%' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/items")} sx={{ mb: 3 }}>Items Overview</Button>

      <Grid container spacing={4}>
        {/* LEFT PANEL: INFO & ACTIONS */}
        <Grid item xs={12} md={4} lg={3}> 
  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5e7eb' }}>
    {/* Header Info */}
    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{item.name}</Typography>
    <Chip 
      label={item.status.toUpperCase()} 
      size="small"
      sx={{ 
        mb: 3, 
        fontWeight: 700, 
        bgcolor: item.status === "active" ? "#ecfdf5" : "#f3f4f6", 
        color: item.status === "active" ? "#065f46" : "#374151" 
      }} 
    />
    
    {/* Metadata Rows: Location & Solution Type */}
    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          CURRENT LOCATION
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {item.currentLocation?.name || "Unknown"}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          SOLUTION TYPE
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
          {item.solutionType || "Standard"}
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />
    
    {/* Actions Section */}
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: -1 }}>Change Location</Typography>
      <TextField 
        select 
        fullWidth 
        variant="outlined"
        size="small"
        value={selectedLocation} 
        onChange={(e) => setSelectedLocation(e.target.value)} 
        disabled={isTerminalStatus}
      >
        {locations.map((loc) => (
          <MenuItem key={loc._id} value={loc._id}>{loc.name}</MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
        {ACTION_CONFIGS[item.solutionType]?.map((cfg) => (
          <Button
            key={cfg.label}
            fullWidth
            variant={cfg.terminal ? "contained" : "outlined"}
            color={cfg.color}
            size="large"
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            disabled={isTerminalStatus || actionLoading || (cfg.action === 'missing' && item.status === 'missing')}
            onClick={() => cfg.terminal ? setConfirmModal({ open: true, action: cfg.action }) : handleAction(cfg.action)}
          >
            {cfg.label}
          </Button>
        ))}
      </Box>
    </Box>
  </Paper>
</Grid>

        {/* RIGHT PANEL: TWO TABLES */}
        <Grid item xs={12} md={8} lg={9} sx={{flexGrow: 1}}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            
            {/* TABLE 1: LOCATION HISTORY */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Location History (Relational)</Typography>
            <Box sx={{ height: 350, mb: 4 }}>
              <DataGrid 
                rows={history} 
                columns={historyColumns} 
                getRowId={(r) => r._id} 
                density="compact"
                hideFooter
                getRowClassName={(params) => params.row.location?._id === locationHighlight ? 'highlighted-row-loc' : ''}
                slotProps={{
                  row: {
                    onMouseEnter: (e) => {
                      const row = history.find(r => r._id === e.currentTarget.getAttribute('data-id'));
                      if (row?.location?._id) setLocationHighlight(row.location._id);
                    },
                    onMouseLeave: () => setLocationHighlight(null)
                  }
                }}
                sx={{ "& .highlighted-row-loc": { bgcolor: "rgba(25, 118, 210, 0.12) !important" } }}
              />
            </Box>

            {/* TABLE 2: ACTION AUDIT */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>Full Action Audit (User-Based)</Typography>
            <Box sx={{ height: 350 }}>
              <DataGrid 
                rows={history} 
                columns={historyColumns} 
                getRowId={(r) => r._id} 
                density="compact"
                initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                getRowClassName={(params) => params.row.user?._id === userHighlight ? 'highlighted-row-user' : ''}
                slotProps={{
                  row: {
                    onMouseEnter: (e) => {
                      const row = history.find(r => r._id === e.currentTarget.getAttribute('data-id'));
                      if (row?.user?._id) setUserHighlight(row.user._id);
                    },
                    onMouseLeave: () => setUserHighlight(null)
                  }
                }}
                sx={{ "& .highlighted-row-user": { bgcolor: "rgba(76, 175, 80, 0.12) !important" } }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <ActionConfirmModal 
        open={confirmModal.open} 
        action={confirmModal.action} 
        onClose={() => setConfirmModal({ open: false, action: null })} 
        onConfirm={() => {
          const a = confirmModal.action;
          setConfirmModal({ open: false, action: null });
          handleAction(a);
        }} 
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemDetail;