
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";

import { CiLogout } from "react-icons/ci";

import { NavLink, useNavigate } from 'react-router-dom';

const adminMenuItems = [
  { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { text: "Manage User", path: "/admin/users", icon: <PeopleIcon /> },
];

const secondaryListItems = { text: "Logout", icon: <CiLogout /> };


export default function AdminMenuContent() {
  const nav = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {adminMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>


      <List>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={() => handleLogout()}>
            <ListItemIcon>{secondaryListItems.icon}</ListItemIcon>
            <ListItemText primary={secondaryListItems.text} />
          </ListItemButton>
        </ListItem>
      </List>
    </Stack>
  );
}
