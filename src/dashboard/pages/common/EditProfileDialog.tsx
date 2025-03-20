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
import Avatar from "@mui/material/Avatar";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { portserver } from "../../../utils/portserver";

interface User {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  address: string | null;
}

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
}

export default function EditProfileDialog({
  open,
  onClose,
  onProfileUpdated,
}: EditProfileDialogProps) {
  const [userData, setUserData] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchCurrentUserData();
    }
  }, [open]);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    }
  }, [userData]);

  const fetchCurrentUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const decoded = jwtDecode<{ userId: string }>(token);
      
      if (!decoded.userId) {
        setError("Invalid token. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${portserver}/users/${decoded.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const userData = response.data;
      setUserData(userData);
      
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to load your profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!userData) return;

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
      
      if (formData.username && formData.username !== userData.username) {
        payload.username = formData.username;
      }
      
      if (formData.phone && formData.phone !== userData.phone) {
        payload.phone = formData.phone;
      }
      
      if (formData.address && formData.address !== userData.address) {
        payload.address = formData.address;
      }

      if (Object.keys(payload).length > 0) {
        await axios.put(`${portserver}/users/${userData.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSuccess("Your profile has been updated successfully!");
        
        setTimeout(() => {
          onProfileUpdated();
          handleClose();
        }, 1500);
      } else {
        setSuccess("No changes to save.");
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to update your profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      phone: "",
      address: "",
    });
    setError(null);
    setSuccess(null);
    setUserData(null);
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
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            sx={{ 
              width: 56, 
              height: 56, 
              bgcolor: 'primary.main',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}
          >
            {userData?.username?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="medium">
              Edit Your Profile
            </Typography>
            {userData && (
              <Typography variant="body2" color="text.secondary">
                {userData.email}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {loading && !userData && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

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

        {userData && (
          <Box sx={{ pt: 1 }}>
            <Stack spacing={3}>
              <TextField
                name="username"
                label="Display Name"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your display name"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name="phone"
                label="Phone Number"
                fullWidth
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Enter your phone number"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name="address"
                label="Address"
                fullWidth
                multiline
                value={formData.address || ""}
                onChange={handleChange}
                placeholder="Enter your address"
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !userData}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          color="primary"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}