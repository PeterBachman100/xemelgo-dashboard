import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import AppDataGrid from "../components/common/AppDataGrid";
import api from "../api/axiosConfig";

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/locations");
        setLocations(response.data);
      } catch (err) {
        console.error("Location Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "_id",
      headerName: "Location ID",
      width: 300,
      renderCell: (params) => (
        <Typography 
          variant="caption" 
          sx={{ 
            color: "text.disabled", 
            fontFamily: "monospace",
            letterSpacing: '0.02em'
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <AppDataGrid
        rows={locations}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        showToolbar
        initialState={{
          pagination: { paginationModel: { pageSize: 15 } },
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

export default Locations;