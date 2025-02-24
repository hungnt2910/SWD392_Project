import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import GroupIcon from '@mui/icons-material/Group';
import { NavLink } from 'react-router-dom';


const staffMenuItems = [
  { text: "Manage Members", path: "/dashboard/staff/members", icon: <GroupIcon /> },
  { text: "Manage Goods", path: "/dashboard/staff/goods", icon: <GroupIcon /> },
  { text: "Manage Skintype MCQs", path: "/dashboard/staff/skintype", icon: <GroupIcon /> },
  { text: "Manage Feedbacks", path: "/dashboard/staff/feedbacks", icon: <GroupIcon /> },
  { text: "Manage Blogs", path: "/dashboard/staff/blogs", icon: <GroupIcon /> },
  { text: "Customize Skin Route", path: "/dashboard/staff/skin-route", icon: <GroupIcon /> },
  { text: "Create Voucher", path: "/dashboard/staff/voucher", icon: <GroupIcon /> },
  { text: "All Orders", path: "/dashboard/staff/orders/all", icon: <GroupIcon /> },
  { text: "Pending Refund", path: "/dashboard/staff/orders/refund", icon: <GroupIcon /> },
  { text: "Pending Confirm", path: "/dashboard/staff/orders/confirm", icon: <GroupIcon /> },
];


const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {staffMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton component={NavLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
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
