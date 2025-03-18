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
  id: string;
  username?: string;
  phone?: string | null;
  address?: string | null;
  email?: string;
  status: boolean;
}

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user: User | null;
}

export default function EditUserDialog({
  open,
  onClose,
  onUserUpdated,
  user,
}: EditUserDialogProps) {
  // Khởi tạo form data
  const [userData, setUserData] = useState({
    username: "",
    phone: "",
    address: "",
    email: "",
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
        email: user.email || "",
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

    // Kiểm tra email có đúng định dạng không
    if (userData.email && !isValidEmail(userData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      // Chuẩn bị payload - chỉ gửi những trường có dữ liệu
      const payload: Record<string, any> = {};
      if (userData.username) payload.username = userData.username;
      if (userData.phone) payload.phone = userData.phone;
      if (userData.address) payload.address = userData.address;
      if (userData.email) payload.email = userData.email;

      // Gọi API update user
      await axios.put(`${portserver}/admin/user/${user.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("User updated successfully!");
      setLoading(false);

      // Thông báo cập nhật thành công và đóng dialog sau 1.5s
      setTimeout(() => {
        onUserUpdated();
        handleClose();
      }, 1500);
    } catch (err: any) {
      console.error("Error updating user:", err);

      // Hiển thị thông báo lỗi từ server nếu có
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update user. Please try again.");
      }

      setLoading(false);
    }
  };

  // Hàm kiểm tra email hợp lệ
  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Đóng dialog và reset form
  const handleClose = () => {
    setUserData({
      username: "",
      phone: "",
      address: "",
      email: "",
    });
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "500px",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          Edit User
        </Typography>
        {user && (
          <Typography variant="subtitle1" color="text.secondary">
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
              label="Username"
              fullWidth
              value={userData.username}
              onChange={handleChange}
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={userData.email}
              onChange={handleChange}
              helperText="Email must be a valid email"
            />

            <TextField
              name="phone"
              label="Phone"
              fullWidth
              value={userData.phone}
              onChange={handleChange}
            />

            <TextField
              name="address"
              label="Address"
              fullWidth
              multiline
              value={userData.address}
              onChange={handleChange}
            />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Updating..." : "Update User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
