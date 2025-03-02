import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import { NavLink } from 'react-router-dom';

const adminMenuItems = [
  { text: "Dashboard", path: "/dashboard/admin", icon: <DashboardIcon /> },
  { text: "Staff Management", path: "/dashboard/admin/staff", icon: <PeopleIcon /> },
  { text: "Sales Analytics", path: "/dashboard/admin/analytics", icon: <BarChartIcon /> },
  { text: "System Settings", path: "/dashboard/admin/settings", icon: <SettingsIcon /> },
  { text: "Role Permissions", path: "/dashboard/admin/roles", icon: <SecurityIcon /> },
];

export default function AdminMenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {adminMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}