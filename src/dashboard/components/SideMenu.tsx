import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";

interface SideMenuProps {
  children?: React.ReactNode;
}

export default function SideMenu({ children }: SideMenuProps) {
  const theme = useTheme();
  const drawerWidth = 240;
  const [role, setRole] = useState("Dashboard");

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Decode JWT và lấy role
        const decoded = jwtDecode<{ role: string }>(token);
        
        if (decoded.role) {
          const formattedRole = decoded.role.charAt(0).toUpperCase() + 
                              decoded.role.slice(1).toLowerCase();
          setRole(formattedRole);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // Giữ giá trị mặc định nếu có lỗi
      setRole("Dashboard");
    }
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <AccountCircleIcon color="primary" />
          <Typography variant="h6" component="div" fontWeight="bold">
            {role} Panel
          </Typography>
        </Stack>
      </Toolbar>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
}