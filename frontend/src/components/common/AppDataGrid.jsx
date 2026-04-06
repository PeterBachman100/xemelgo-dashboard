import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const AppDataGrid = ({ rows, columns, getHighlightValue, sx, ...props }) => {
  const [activeHighlight, setActiveHighlight] = useState(null);

  // Standard blue highlight from the Sitemark palette
  const HIGHLIGHT_COLOR = "rgba(25, 118, 210, 0.12)";

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      // Logic: Compare current row's value to the hover state
      getRowClassName={(params) => {
        if (!getHighlightValue || !activeHighlight) return '';
        return getHighlightValue(params.row) === activeHighlight ? 'app-row-highlight' : '';
      }}
      slotProps={{
        row: {
          onMouseEnter: (e) => {
            if (!getHighlightValue) return;
            const id = e.currentTarget.getAttribute('data-id');
            const row = rows.find(r => r._id === id || r.id === id);
            if (row) {
              const val = getHighlightValue(row);
              if (val) setActiveHighlight(val);
            }
          },
          onMouseLeave: () => setActiveHighlight(null)
        }
      }}
      sx={{
        height: 350,
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        '& .MuiDataGrid-columnHeaders': { 
          bgcolor: '#f9fafb',
          fontWeight: 700 
        },
        "& .app-row-highlight": { 
          bgcolor: `${HIGHLIGHT_COLOR} !important`,
          cursor: 'pointer',
          transition: 'background-color 0.1s ease'
        },
        ...sx
      }}
      {...props}
    />
  );
};

export default AppDataGrid;