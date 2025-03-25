import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { portserver } from "../../../utils/portserver";
import MemberDetailDialog from "./MemberDetailDialog";
import EditMemberDialog from "./EditMemberDialog";

interface User {
  id: number;
  username: string;
  phone: string | null;
  address: string | null;
  status: boolean;
  loyaltyPoints: number;
}

export default function ManageMembers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${portserver}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (id: number) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      setUserToEdit(user);
      setEditDialogOpen(true);
    }
  };

  const handleViewUserDetail = (id: number) => {
    setSelectedUserId(id);
    setDetailDialogOpen(true);
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  const columns: GridColDef<User>[] = [
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
      headerName: "Name",
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
      renderCell: (params: GridRenderCellParams<User, string>) => (
        <Chip
          label={params.value}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<User>) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            width="100%"
          >
            <Tooltip title="View Details">
              <IconButton
                color="info"
                onClick={() => handleViewUserDetail(params.row.id)}
                size="small"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit Customer">
              <IconButton
                color="primary"
                onClick={() => handleEditUser(params.row.id)}
                size="small"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
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
      <h2>Customer Management</h2>

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
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
        }}
      />

      <MemberDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        userId={selectedUserId}
      />

      <EditMemberDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onMemberUpdated={handleUserUpdated}
        user={userToEdit}
      />
    </Box>
  );
}