import * as React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import axios from "axios";
import { portserver } from "../../../utils/portserver";

// Interface cho User
interface User {
  id: number;
  username: string;
  phone: string | null;
  address: string | null;
  status: boolean;
  loyaltyPoints: number;
}

interface EditMemberDialogProps {
  open: boolean;
  onClose: () => void;
  onMemberUpdated: () => void;
  user: User | null;
}

export default function EditMemberDialog({
  open,
  onClose,
  onMemberUpdated,
  user,
}: EditMemberDialogProps) {
  // Khởi tạo form data
  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cập nhật dữ liệu form khi user thay đổi
  useEffect(() => {
    if (open && user) {
      setUserData({
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [open, user]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const payload: Record<string, string> = {};
      
      if (userData.username && userData.username !== user.username) {
        payload.username = userData.username;
      }
      
      if (userData.phone && userData.phone !== user.phone) {
        payload.phone = userData.phone;
      }
      
      if (userData.address && userData.address !== user.address) {
        payload.address = userData.address;
      }

      await axios.put(`${portserver}/users/${user.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Customer information updated successfully!");
      setLoading(false);

      setTimeout(() => {
        onMemberUpdated();
        handleClose();
      }, 1500);
    } catch (err: any) {
      console.error("Error updating customer:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update customer. Please try again.");
      }

      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserData({
      username: "",
      phone: "",
      address: "",
    });
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth={true}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: "500px",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="medium">
          Edit Customer
        </Typography>
        {user && (
          <Typography variant="body2" color="text.secondary">
            ID: {user.id}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ pt: 1 }}>
          <Stack spacing={3}>
            <TextField
              name="username"
              label="Name"
              fullWidth
              value={userData.username}
              onChange={handleChange}
              placeholder="Enter customer name"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="phone"
              label="Phone"
              fullWidth
              value={userData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              name="address"
              label="Address"
              fullWidth
              multiline
              value={userData.address}
              onChange={handleChange}
              placeholder="Enter address"
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          color="primary"
        >
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}