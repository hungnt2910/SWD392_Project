import * as React from "react";
import { useState } from "react";
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
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormHelperText from "@mui/material/FormHelperText";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

interface Role {
  id: string;
  name: string;
}

const roles: Role[] = [
  { id: "1", name: "Admin" },
  { id: "2", name: "User" },
  { id: "3", name: "Staff" },
  { id: "4", name: "Shipper" },
];

export default function CreateUserDialog({
  open,
  onClose,
  onUserCreated,
}: CreateUserDialogProps) {
  // Form state
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "2", // Default to User
  });

  // State cho validation và UI
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    
    // Reset lỗi khi user thay đổi giá trị
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Xử lý thay đổi cho select (role dropdown)
  const handleRoleChange = (e: any) => {
    setUserData({
      ...userData,
      roleId: e.target.value,
    });
  };

  // Xử lý toggle hiện/ẩn mật khẩu
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Validate form
  const validateForm = (): boolean => {
    const validationErrors: Record<string, string> = {};
    
    // Validate username
    if (!userData.username.trim()) {
      validationErrors.username = "Username is required";
    }
    
    // Validate email
    if (!userData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!isValidEmail(userData.email)) {
      validationErrors.email = "Please enter a valid email address";
    }
    
    // Validate password
    if (!userData.password) {
      validationErrors.password = "Password is required";
    } else if (userData.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    }
    
    // Validate confirm password
    if (!userData.confirmPassword) {
      validationErrors.confirmPassword = "Please confirm your password";
    } else if (userData.password !== userData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Kiểm tra email hợp lệ
  const isValidEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    // Validate form trước khi submit
    if (!validateForm()) {
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
      
      // Chuẩn bị payload
      const payload = {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        roleId: userData.roleId,
      };

      // Gọi API tạo user mới
      await axios.post(`${portserver}/admin/createUser`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("User created successfully!");
      setLoading(false);
      
      // Thông báo tạo thành công và đóng dialog sau 1.5s
      setTimeout(() => {
        onUserCreated();
        handleClose();
      }, 1500);
    } catch (err: any) {
      console.error("Error creating user:", err);
      
      // Hiển thị thông báo lỗi từ server nếu có
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create user. Please try again.");
      }
      
      setLoading(false);
    }
  };

  // Đóng dialog và reset form
  const handleClose = () => {
    setUserData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      roleId: "2",
    });
    setErrors({});
    setError(null);
    setSuccess(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
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
          Create New User
        </Typography>
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
              required
              fullWidth
              value={userData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
            />

            <TextField
              name="email"
              label="Email"
              type="email"
              required
              fullWidth
              value={userData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email || "Enter a valid email address"}
            />

            <TextField
              name="password"
              label="Password"
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              value={userData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || "Password must be at least 6 characters"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              required
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              value={userData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={userData.roleId}
                label="Role"
                onChange={handleRoleChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the user's role</FormHelperText>
            </FormControl>
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
          {loading ? "Creating..." : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}