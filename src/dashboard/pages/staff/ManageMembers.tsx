import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit'; 
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { portserver } from "../../../utils/portserver";

interface User {
  id: number;
  username: string;
  password?: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  loyaltyPoints: number;
}

export default function ManageMembers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${portserver}/admin/user`);
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');

      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); 

  const toggleUserStatus = async (id: number) => {
    try {
      const user = users.find(user => user.id === id);
      if (!user) return;
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      await axios.put(`https://your-api-endpoint.com/users/${id}`, {
        status: newStatus
      });
      
      setUsers(users.map(user => {
        if (user.id === id) {
          return {
            ...user,
            status: newStatus
          };
        }
        return user;
      }));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };
  
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
      field: 'username',
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
        <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%"
        }}
      >
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
          
          {params.row.status === 'active' ? (
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
          )}
        </Stack>
        </Box>
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
    <Box sx={{width: '100%', p: 2 }}>
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