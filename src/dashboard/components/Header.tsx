import * as React from "react";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import NavbarBreadcrumbs from "./NavbarBreadcrumbs";
import ColorModeIconDropdown from "../../shared-theme/ColorModeIconDropdown";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import EditProfileDialog from "../pages/common/EditProfileDialog";

export default function Header() {
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  const [loading, setLoading] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode<{ userId: string }>(token);

        if (decoded.userId) {
          fetchUserData(decoded.userId, token);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const fetchUserData = async (userId: string, token: string) => {
    try {
      setLoading(true);

      const response = await axios.get(`${portserver}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;

      if (userData) {
        setUsername(userData.username || "User");
        setEmail(userData.email || "user@example.com");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfileDialog = () => {
    setProfileDialogOpen(true);
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
  };

  const handleProfileUpdated = () => {
    fetchCurrentUser();
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: { xs: "none", md: "flex" },
          width: "100%",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          maxWidth: { sm: "100%", md: "1500px" },
          pt: 1.5,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />
        <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
          <Tooltip title="Edit your profile">
            <Button
              onClick={handleOpenProfileDialog}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
                <Avatar
                  sizes="small"
                  alt={username}
                  src="/static/images/avatar/7.jpg"
                  sx={{ width: 36, height: 36 }}
                >
                  {username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ mr: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, lineHeight: "16px" }}
                  >
                    {loading ? "Loading..." : username}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {loading ? "..." : email}
                  </Typography>
                </Box>
              </Stack>
            </Button>
          </Tooltip>
          <ColorModeIconDropdown />
        </Stack>
      </Stack>

      <EditProfileDialog
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
}
