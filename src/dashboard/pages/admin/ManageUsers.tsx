import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { portserver } from "../../../utils/portserver";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import EditUserDialog from "./EditUserDialog";
import CreateUserDialog from "./CreateUserDialog";
import AddIcon from "@mui/icons-material/Add";
import { Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info"; // Icon thông tin cho dialog cảnh báo

interface User {
  id: string;
  username: string;
  password?: string;
  phone: string | null;
  address: string | null;
  email: string;
  status: boolean;
}

export default function ManageUsers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [ordersWarningDialogOpen, setOrdersWarningDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${portserver}/admin/user`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const activeUsers = response.data.filter((user: { status: boolean; }) => user.status === true);
      setUsers(activeUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }
      
      const response = await axios.get(`${portserver}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.length > 0) {
        setUserToDelete(id);
        setOrdersWarningDialogOpen(true);
      } else {
        setUserToDelete(id);
        setDeleteConfirmOpen(true);
      }
    } catch (err) {
      console.error("Error checking user orders:", err);
      setUserToDelete(id);
      setDeleteConfirmOpen(true);
    }
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      await axios.delete(`${portserver}/admin/user/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.filter((user) => user.id !== userToDelete));

      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleEditUser = (id: string) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setUserToEdit(user);
      setEditDialogOpen(true);
    }
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const handleUserCreated = () => {
    fetchUsers();
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.2,
      minWidth: 180,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => params.value || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      renderCell: (params: GridRenderCellParams) => (
        <Chip label="Active" color="success" size="small" />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
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

          <Tooltip title="Delete User">
            <IconButton
              color="error"
              onClick={() => confirmDeleteUser(params.row.id)}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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

      {/* Dialog confirm xóa user */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={deleteUser} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog cảnh báo có order */}
      <Dialog
        open={ordersWarningDialogOpen}
        onClose={() => setOrdersWarningDialogOpen(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="warning" />
          Cannot Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This user has order history and cannot be deleted. Deleting users with existing orders would corrupt data integrity.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOrdersWarningDialogOpen(false)}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <EditUserDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onUserUpdated={handleUserUpdated}
        user={userToEdit}
      />

      <CreateUserDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </Box>
  );
}