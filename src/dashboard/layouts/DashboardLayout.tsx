import * as React from "react";
import { useState, useEffect } from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import AppTheme from "../../shared-theme/AppTheme";
import { Outlet } from "react-router-dom";
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

export default function DashboardLayout(props: {
  disableCustomTheme?: boolean;
}) {
  // Lấy userRole trực tiếp từ localStorage, không cần loading state
  const userRole = (localStorage.getItem("userRole") as UserRole) || "staff";

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
        return <StaffMenuContent />; // Fallback to staff
    }
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu>{renderMenuContent()}</SideMenu>
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
