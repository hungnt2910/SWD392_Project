import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import MenuContent from "./MenuContent";
import StaffMenuContent from "../layouts/StaffMenuContent";

interface SideMenuProps {
  children?: React.ReactNode;
}

export default function SideMenu({ children }: SideMenuProps) {
  const theme = useTheme();
  const drawerWidth = 240;

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
        <Typography variant="h6" component="div" fontWeight="bold">
          Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >      {children}

      </Box>
    </Drawer>
  );
}
