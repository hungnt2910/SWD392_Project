import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueFormatter } from '@mui/x-data-grid';
import { Typography } from '@mui/material';

interface Blog {
  id: number;
  postId: number;
  title: string;
  description: string;
  imageUrl: string;
  postDate: string;
  user_id: number;
}

export default function ManageBlogs() {
  const [blogs, setBlogs] = React.useState<Blog[]>([
    { id: 1, postId: 1, title: 'First Blog Post', description: 'This is the description of the first blog post.', imageUrl: 'https://example.com/image1.jpg', postDate: '2025-03-13T12:00:00Z', user_id: 101 },
    { id: 2, postId: 2, title: 'Second Blog Post', description: 'This is the description of the second blog post.', imageUrl: 'https://example.com/image2.jpg', postDate: '2025-03-14T12:00:00Z', user_id: 102 },
    { id: 3, postId: 3, title: 'Third Blog Post', description: 'This is the description of the third blog post.', imageUrl: 'https://example.com/image3.jpg', postDate: '2025-03-15T12:00:00Z', user_id: 103 },
    { id: 4, postId: 4, title: 'Fourth Blog Post', description: 'This is the description of the fourth blog post.', imageUrl: 'https://example.com/image4.jpg', postDate: '2025-03-16T12:00:00Z', user_id: 104 },
    { id: 5, postId: 5, title: 'Fifth Blog Post', description: 'This is the description of the fifth blog post.', imageUrl: 'https://example.com/image5.jpg', postDate: '2025-03-17T12:00:00Z', user_id: 105 }
  ]);

  const columns: GridColDef<Blog>[] = [
    { field: 'postId', headerName: 'Post ID', flex: 0.5, minWidth: 60, headerAlign: 'center', align: 'center' },
    { field: 'title', headerName: 'Title', flex: 1, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'description', headerName: 'Description', flex: 2, minWidth: 300, editable: false },
    { field: 'imageUrl', headerName: 'Image URL', flex: 1, minWidth: 200, editable: false },
    {
        field: 'postDate',
        headerName: 'Post Date',
        flex: 1,
        minWidth: 180,
        valueFormatter: (params: { value?: string }) =>
          params.value ? new Date(params.value).toLocaleString() : 'N/A',
        editable: false,
      },
    { field: 'user_id', headerName: 'User ID', flex: 0.5, minWidth: 60, headerAlign: 'center', align: 'center' }
  ];

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h6" component="div" sx={{ padding: 2 }}>
        Manage Blogs
      </Typography>
      <DataGrid
        rows={blogs}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
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