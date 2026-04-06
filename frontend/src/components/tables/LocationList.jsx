import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import AppDataGrid from "../common/AppDataGrid";
import api from "../../api/axiosConfig";

const LocationList = ({ height = 750, showToolbar = true, limit = null }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/locations");
        const data = limit ? response.data.slice(0, limit) : response.data;
        setLocations(data);
      } catch (err) {
        console.error("Location Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [limit]);

  const columns = [
    {
      field: "name",
      headerName: "Site Name",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{params.value}</Typography>
      ),
    },
    {
      field: "_id",
      headerName: "ID",
      width: 150,
      renderCell: (params) => (
        <Typography variant="caption" sx={{ color: "text.disabled", fontFamily: "monospace" }}>
          {params.value.substring(0, 8)}...
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
        showToolbar={showToolbar}
        initialState={{ pagination: { paginationModel: { pageSize: limit || 15 } } }}
        sx={{ 
          height, bgcolor: "background.paper", borderRadius: 3,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          '& .MuiDataGrid-columnHeaders': { bgcolor: (theme) => theme.palette.grey[50] }
        }}
      />
    </Box>
  );
};

export default LocationList;