import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { portserver } from '../../../utils/portserver';

interface User {
  id: number;
  name: string;
  password: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  loyaltyPoints: number;
}

const skinTypes = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'];

export default function ManageMembers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState('');
  const [morningRoutine, setMorningRoutine] = useState('');
  const [eveningRoutine, setEveningRoutine] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const data = {
      userId,
      skinType,
      concerns,
      morningRoutine: morningRoutine.split(','),
      eveningRoutine: eveningRoutine.split(','),
      recommendedProducts: recommendedProducts.split(',')
    };

    try {
      await axios.post(`${portserver}/skincare-route`, data);
      alert('User data submitted successfully!');
      handleClose();
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit user data.');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://your-api-endpoint.com/users');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setUsers([
          { id: 1, name: 'John Doe', password: 'pass123', phone: '123-456-7890', address: '123 Main St', status: 'active', loyaltyPoints: 250 },
          { id: 2, name: 'Jane Smith', password: 'pass456', phone: '987-654-3210', address: '456 Oak Ave', status: 'active', loyaltyPoints: 500 },
          { id: 3, name: 'Bob Johnson', password: 'pass789', phone: '555-123-4567', address: '789 Pine Rd', status: 'inactive', loyaltyPoints: 100 },
          { id: 4, name: 'Alice Brown', password: 'pass321', phone: '555-987-6543', address: '321 Elm St', status: 'pending', loyaltyPoints: 0 },
          { id: 5, name: 'Charlie Wilson', password: 'pass654', phone: '555-789-0123', address: '654 Maple Dr', status: 'active', loyaltyPoints: 750 },
          { id: 6, name: 'Diana Miller', password: 'pass987', phone: '555-456-7890', address: '987 Cedar Ln', status: 'inactive', loyaltyPoints: 50 },
          { id: 7, name: 'Edward Davis', password: 'pass135', phone: '555-246-8024', address: '135 Birch Ave', status: 'active', loyaltyPoints: 300 },
          { id: 8, name: 'Fiona Clark', password: 'pass246', phone: '555-135-7913', address: '246 Walnut St', status: 'active', loyaltyPoints: 450 },
          { id: 9, name: 'George White', password: 'pass357', phone: '555-802-4680', address: '357 Cherry Rd', status: 'pending', loyaltyPoints: 25 },
          { id: 10, name: 'George White', password: 'pass357', phone: '555-802-4680', address: '357 Cherry Rd', status: 'pending', loyaltyPoints: 25 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // const toggleUserStatus = async (id: number) => {
  //   try {
  //     const user = users.find(user => user.id === id);
  //     if (!user) return;

  //     const newStatus = user.status === 'active' ? 'inactive' : 'active';

  //     await axios.put(`https://your-api-endpoint.com/users/${id}`, {
  //       status: newStatus
  //     });

  //     setUsers(users.map(user => {
  //       if (user.id === id) {
  //         return {
  //           ...user,
  //           status: newStatus
  //         };
  //       }
  //       return user;
  //     }));
  //   } catch (err) {
  //     console.error('Error updating user status:', err);
  //     setError('Failed to update user status. Please try again.');
  //   }
  // };

  const handleEditUser = (id: number) => {
    console.log(`Edit user with ID: ${id}`);
  };

  const columns: GridColDef<User>[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 0.5,
      minWidth: 60,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 120,
      editable: false,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 120,
      editable: false,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1.5,
      minWidth: 150,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 100,
      editable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<User, string>) => (
        <Chip
          label={params.value}
          color={
            params.value === 'active' ? 'success' :
              params.value === 'inactive' ? 'error' :
                'warning'
          }
          size="small"
        />
      ),
    },
    {
      field: 'loyaltyPoints',
      headerName: 'Loyalty Points',
      type: 'number',
      flex: 0.8,
      minWidth: 100,
      editable: false,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<User>) => (
        <Stack direction="row" spacing={1} justifyContent="center" width="100%">
          <Tooltip title="Edit User">
            <IconButton
              color="primary"
              onClick={() => handleEditUser(params.row.id)}
              size="small"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* {params.row.status === 'active' ? (
            <Tooltip title="Deactivate User">
              <IconButton
                color="error"
                onClick={() => toggleUserStatus(params.row.id)}
                size="small"
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Activate User">
              <IconButton
                color="success"
                onClick={() => toggleUserStatus(params.row.id)}
                size="small"
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )} */}
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <h2>Customer Management</h2>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <DataGrid
        rows={users}
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

      <Button variant="contained" color="primary" onClick={handleOpen}>
        create a skin care routine
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Enter User Details</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Skin Type</InputLabel>
            <Select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
            >
              {skinTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="dense"
            label="Concerns"
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Morning Routine (comma separated)"
            value={morningRoutine}
            onChange={(e) => setMorningRoutine(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Evening Routine (comma separated)"
            value={eveningRoutine}
            onChange={(e) => setEveningRoutine(e.target.value)}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Recommended Products (comma separated)"
            value={recommendedProducts}
            onChange={(e) => setRecommendedProducts(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}





