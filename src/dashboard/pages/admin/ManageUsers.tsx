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

// Cập nhật interface phù hợp với API
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${portserver}/admin/user`);
      // Lọc ra chỉ những user có status = true
      const activeUsers = response.data.filter((user) => user.status === true);
      setUsers(activeUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Mở dialog xác nhận xóa user
  const confirmDeleteUser = (id: string) => {
    setUserToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Xóa user sau khi xác nhận
  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }

      // Sử dụng DELETE method với API endpoint admin/user/:id và thêm bearer token
      await axios.delete(`${portserver}/admin/user/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Xóa user khỏi state
      setUsers(users.filter((user) => user.id !== userToDelete));

      // Đóng dialog xác nhận
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
    // Refresh lại danh sách users khi cập nhật thành công
    fetchUsers();
  };

  const handleUserCreated = () => {
    // Refresh lại danh sách users khi tạo thành công
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

          {/* Thay nút deactivate bằng nút delete */}
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
      />

      {/* Dialog xác nhận xóa user */}
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
