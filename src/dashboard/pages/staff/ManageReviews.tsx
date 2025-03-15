import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Alert } from '@mui/material';

interface Review {
  id: number; // Add id property
  reviewId: number;
  rating: number;
  comment: string;
  reviewDate: string;
  product_id: number;
  user_id: number;
}

export default function ManageReviews() {
  const [reviews, setReviews] = React.useState<Review[]>([
    { id: 1, reviewId: 1, rating: 5, comment: 'Great product!', reviewDate: '2025-03-01', product_id: 101, user_id: 1001 },
    { id: 2, reviewId: 2, rating: 4, comment: 'Very good, but could be better.', reviewDate: '2025-03-02', product_id: 102, user_id: 1002 },
    { id: 3, reviewId: 3, rating: 3, comment: 'Average product.', reviewDate: '2025-03-03', product_id: 103, user_id: 1003 },
    { id: 4, reviewId: 4, rating: 2, comment: 'Not satisfied.', reviewDate: '2025-03-04', product_id: 104, user_id: 1004 },
    { id: 5, reviewId: 5, rating: 1, comment: 'Very bad experience.', reviewDate: '2025-03-05', product_id: 105, user_id: 1005 },
  ]);

  const columns: GridColDef<Review>[] = [
    { field: 'reviewId', headerName: 'Review ID', flex: 0.5, minWidth: 60, headerAlign: 'center', align: 'center' },
    { field: 'rating', headerName: 'Rating', flex: 0.5, minWidth: 60, headerAlign: 'center', align: 'center' },
    { field: 'comment', headerName: 'Comment', flex: 2, minWidth: 200, editable: false },
    { field: 'reviewDate', headerName: 'Review Date', flex: 1, minWidth: 120, editable: false },
    { field: 'product_id', headerName: 'Product ID', flex: 0.5, minWidth: 60, headerAlign: 'center', align: 'center' },
    { field: 'user_id', headerName: 'User ID', flex: 0.5, minWidth: 60, headerAlign: 'center', align: 'center' },
  ];

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <h2>Customer Reviews Management</h2>
      
      <DataGrid
        rows={reviews}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 15, 30]}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        disableColumnMenu
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
        }}
      />
    </Box>
  );
}