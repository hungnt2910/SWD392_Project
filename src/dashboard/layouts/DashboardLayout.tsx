import * as React from "react";
import { useEffect, useState } from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import AppNavbar from "../components/AppNavbar";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import AppTheme from "../../shared-theme/AppTheme";
import { Outlet, useNavigate } from "react-router-dom";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../theme/customizations";

import StaffMenuContent from "./StaffMenuContent";
import AdminMenuContent from "./AdminMenuContent";
//import ShipperMenuContent from "./ShipperMenuContent";

type UserRole = "staff" | "admin" | "shipper";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function DashboardLayout(props: { disableCustomTheme?: boolean }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Function to check authentication and get user role
    const checkAuthAndRole = () => {
      const token = localStorage.getItem("token");
      
      // If no token, redirect to login
      if (!token) {
        navigate("/dashboard/login");
        return;
      }
      
      // In a real app, you would decode the token or make an API request
      // to get the user's role. For now, we'll simulate this:
      
      // For demo purposes - replace this with actual role determination logic
      try {
        // Simulate API call to get user role from token
        setTimeout(() => {
          // This should be replaced with actual role determination
          // Here we're just picking up role from localStorage for demo
          const role = localStorage.getItem("userRole") as UserRole || "staff";
          setUserRole(role);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error getting user role:", error);
        navigate("/dashboard/login");
      }
    };
    
    checkAuthAndRole();
  }, [navigate]);
  
  // Function to render the appropriate menu content based on role
  const renderMenuContent = () => {
    switch (userRole) {
      case "admin":
        return <AdminMenuContent />;
      case "staff":
        return <StaffMenuContent />;
      case "shipper":
        return <ShipperMenuContent />;
      default:
        return null;
    }
  };
  
  // Show loading spinner while checking auth
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu>
          {renderMenuContent()}
        </SideMenu>
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header userRole={userRole} />
            <Outlet />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}