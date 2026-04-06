import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Grid, Paper, Typography, Button, TextField, MenuItem,
  Divider, Chip, Alert, CircularProgress, Snackbar
} from "@mui/material";
import AppDataGrid from "../components/common/AppDataGrid";
import api from "../api/axiosConfig";
import ActionConfirmModal from "../components/layout/ActionConfirmModal";

const ACTION_CONFIGS = {
  inventory: [
    { label: "Scan", action: "scan", color: "primary" },
    { label: "Consume", action: "consume", color: "success", terminal: true },
  ],
  workOrder: [
    { label: "Receive", action: "receive", color: "primary" },
    { label: "Complete", action: "complete", color: "success", terminal: true },
  ],
  asset: [
    { label: "Move", action: "move", color: "primary" },
    { label: "Mark as Missing", action: "missing", color: "error" },
  ],
};

const ItemDetail = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
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
      setSnackbar({ open: true, message: `'${actionIntent}' succesful.`, severity: "success" });
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

 const fullColumns = [
  { 
    field: "location", 
    headerName: "Location", 
    flex: 1, 
    valueGetter: (value) => value?.name || "N/A" 
  },
  { 
    field: "action", 
    headerName: "Action", 
    width: 150, 
    renderCell: (p) => (
      <Chip 
        label={p.value?.replace("-", " ").toUpperCase()} 
        size="small" 
        variant="outlined" 
        color={p.value === 'missing' ? 'error' : 'default'} 
      />
    )
  },
  { 
    field: "user", 
    headerName: "Performed By", 
    width: 150, 
    valueGetter: (value) => value?.name || "System" 
  },
  { 
    field: "createdAt", 
    headerName: "Time", 
    width: 180, 
    valueFormatter: (value) => {
      if (!value) return "N/A";
      return new Date(value).toLocaleString([], { 
        dateStyle: 'short', 
        timeStyle: 'short' 
      });
    }
  },
];

  const locationColumns = [
    { field: "location", headerName: "Location", flex: 1, valueGetter: (p) => p?.name || "N/A" },
    { field: "createdAt", headerName: "Date/Time", width: 180, valueFormatter: (value) => new Date(value).toLocaleString() },
  ];

  const actionColumns = [
    { field: "user", headerName: "Performed By", width: 150, valueGetter: (v) => v?.name || "System" },
    { 
      field: "action", headerName: "Action", width: 150, 
      renderCell: (p) => <Chip label={p.value.replace("-", " ").toUpperCase()} size="small" variant="outlined" color={p.value === 'missing' ? 'error' : 'default'} /> 
    },
    { field: "createdAt", headerName: "Date/Time", width: 180, valueFormatter: (value) => new Date(value).toLocaleString() },
  ];

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Grid container spacing={2}>

        {/* LEFT PANEL: INFO & ACTIONS */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{item.name}</Typography>
            <Chip 
              label={item.status.toUpperCase()} 
              size="small" 
              sx={{ mb: 3, fontWeight: 700, bgcolor: item.status === "active" ? "#ecfdf5" : "#f3f4f6", color: item.status === "active" ? "#065f46" : "#374151" }} 
            />
            
            <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>CURRENT LOCATION</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.currentLocation?.name || "Unknown"}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>SOLUTION TYPE</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, textTransform: "capitalize" }}>{item.solutionType || "Standard"}</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3, borderStyle: "dashed" }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: -1 }}>Change Location</Typography>
              <TextField select fullWidth variant="outlined" size="small" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} disabled={isTerminalStatus}>
                {locations.map((loc) => (<MenuItem key={loc._id} value={loc._id}>{loc.name}</MenuItem>))}
              </TextField>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3}}>
                {ACTION_CONFIGS[item.solutionType]?.map((cfg) => (
                  <Button
                    key={cfg.label}
                    fullWidth
                    variant="outlined"
                    color={cfg.color}
                    size="large"
                    sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                    disabled={isTerminalStatus || actionLoading || (cfg.action === "missing" && item.status === "missing")}
                    onClick={() => {
                      if (cfg.terminal) {
                        setConfirmModal({ open: true, action: cfg.action });
                      } else {
                        handleAction(cfg.action);
                      }
                    }}
                  >
                    {cfg.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT PANEL: TABLES */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }} container spacing={2}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Location History</Typography>
            <AppDataGrid 
              rows={history} 
              columns={locationColumns} 
              getRowId={(r) => r._id} 
              getHighlightValue={(row) => row.location?._id}  
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} 
            />
          </Paper>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Action History</Typography>
            <AppDataGrid 
              rows={history} 
              columns={actionColumns} 
              getRowId={(r) => r._id} 
              getHighlightValue={(row) => row.user?._id} 
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} 
            />
          </Paper>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e5e7eb" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Full History</Typography>
            <AppDataGrid 
              rows={history} 
              columns={fullColumns} 
              getRowId={(r) => r._id} 
              initialState={{ pagination: { paginationModel: { pageSize: 5 } } }} 
            />
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
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ItemDetail;