import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, alpha } from '@mui/material';
import { TOKENS } from '../../theme/tokens';

const AppDataGrid = ({ rows, columns, getHighlightValue, sx, ...props }) => {
  const [activeHighlight, setActiveHighlight] = useState(null);

  // 1. Automatically wrap renderCell content for vertical/horizontal centering
  const enhancedColumns = columns.map((col) => {
    if (col.renderCell) {
      const originalRenderCell = col.renderCell;
      return {
        ...col,
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: '100%',
              // Center horizontally if align: 'center' is set in column config
              justifyContent: col.align === 'center' ? 'center' : 'flex-start',
            }}
          >
            {originalRenderCell(params)}
          </Box>
        ),
      };
    }
    return col;
  });

  return (
    <DataGrid
      rows={rows}
      columns={enhancedColumns}
      disableRowSelectionOnClick
      autoHeight
      pageSizeOptions={[5, 10, 25, 50]}
      getRowClassName={(params) => {
        if (!getHighlightValue || !activeHighlight) return '';
        return getHighlightValue(params.row) === activeHighlight ? 'app-row-highlight' : '';
      }}
      slotProps={{
        toolbar: {
          csvOptions: { disableToolbarButton: true },
          printOptions: { disableToolbarButton: true },
          showQuickFilter: true,
        },
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
        width: '100%',
        minHeight: 200,
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        
        // Header Styling
        '& .MuiDataGrid-columnHeaders': { 
          bgcolor: (theme) => theme.palette.grey[50],
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          fontWeight: 700 
        },

        // Cell & Row Styling
        '& .MuiDataGrid-cell': {
          borderBottom: (theme) => `1px solid ${theme.palette.grey[100]}`,
          // Ensure default text cells also center vertically
          display: 'flex',
          alignItems: 'center',
        },

        // Remove annoying focus outlines
        '& .MuiDataGrid-cell:focus': { outline: 'none' },
        '& .MuiDataGrid-columnHeader:focus': { outline: 'none' },

        // Highlight Logic
        "& .app-row-highlight": { 
          bgcolor: (theme) => `${alpha(theme.palette.primary.main, 0.08)} !important`,
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