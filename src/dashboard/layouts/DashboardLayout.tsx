import type { } from "@mui/x-date-pickers/themeAugmentation";
import type { } from "@mui/x-charts/themeAugmentation";
import type { } from "@mui/x-data-grid-pro/themeAugmentation";
import type { } from "@mui/x-tree-view/themeAugmentation";
import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import AppTheme from "../../shared-theme/AppTheme";
import { Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "../theme/customizations";

import StaffMenuContent from "./StaffMenuContent";
import AdminMenuContent from "./AdminMenuContent";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function DashboardLayout(props: { disableCustomTheme?: boolean }) {
  const token = localStorage.getItem('token')
  const decode = token ? jwtDecode<{ role: string }>(token) : null;
  const userRole = decode?.role

  const menuContent = userRole === "Admin" ? <AdminMenuContent /> : <StaffMenuContent />;

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <SideMenu>{menuContent}</SideMenu>
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              px: 3,
              py: 2,
            })}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
