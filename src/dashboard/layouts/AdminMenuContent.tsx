import * as React from 'react';
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import ListIcon from '@mui/icons-material/List';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { NavLink, useLocation } from 'react-router-dom';

const adminMenuItems = [
  { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { text: "Manage User", path: "/dashboard/admin/staff", icon: <PeopleIcon /> },
];
const voucherSubMenuItems = [
  { text: "All Vouchers", path: "/dashboard/admin/vouchers/all", icon: <ListIcon /> },
  { text: "Pending approved", path: "/dashboard/admin/vouchers/approve", icon: <SwapHorizIcon /> },
];


const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function AdminMenuContent() {
  const [vouchersOpen, setVouchersOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/dashboard/admin/vouchers')) {
      setVouchersOpen(true);
    }
  }, [location]);

  const handleVouchersClick = () => {
    setVouchersOpen(!vouchersOpen);
  };



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

        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={handleVouchersClick}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Vouchers" />
            {vouchersOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={vouchersOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {voucherSubMenuItems.map((item, index) => (
                <ListItemButton
                  key={index}
                  component={NavLink}
                  to={item.path}
                  sx={(theme) => ({
                    pl: 4,
                    '&.active': {
                      backgroundColor: theme.palette.action.selected,
                    }
                  })}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </ListItem>
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}