import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import GroupIcon from "@mui/icons-material/Group";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListIcon from "@mui/icons-material/List";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ArticleIcon from "@mui/icons-material/Article";
import Collapse from "@mui/material/Collapse";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import VideoCall from '@mui/icons-material/VideoCall';

const mainMenuItems = [
  { text: "Manage Members", path: "/staff/members", icon: <GroupIcon /> },
  { text: "Manage Goods", path: "/staff/goods", icon: <InventoryIcon /> },
  //   { text: "Manage Skintype MCQs", path: "/dashboard/staff/skintype", icon: <QuizIcon /> },
  { text: "Manage Reviews", path: "/staff/reviews", icon: <FeedbackIcon /> },
  { text: "Manage Blogs", path: "/staff/blogs", icon: <ArticleIcon /> },
  //   { text: "Customize Skin Route", path: "/dashboard/staff/skin-route", icon: <RouteIcon /> },
  { text: "Create Voucher", path: "/staff/voucher", icon: <LocalOfferIcon /> },
  { text: "Google Meet", path: "/staff/meet", icon: <VideoCall /> },
  { text: "Skincare Route", path: "/staff/skincare-route", icon: <VideoCall /> },
];

const orderSubMenuItems = [
  { text: "All Orders", path: "/staff/orders/all", icon: <ListIcon /> },
  {
    text: "Pending Return",
    path: "/staff/orders/refund",
    icon: <SwapHorizIcon />,
  },
  {
    text: "Pending Confirm",
    path: "/staff/orders/confirm",
    icon: <CheckCircleOutlineIcon />,
  },
];

const secondaryListItems = { text: "Logout", icon: <CiLogout /> };

export default function StaffMenuContent() {
  const [ordersOpen, setOrdersOpen] = useState(false);
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("/dashboard/staff/orders")) {
      setOrdersOpen(true);
    }
  }, [location]);

  const handleOrdersClick = () => {
    setOrdersOpen(!ordersOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainMenuItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={(theme) => ({
                "&.active": {
                  backgroundColor: theme.palette.action.selected,
                },
              })}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Orders dropdown menu */}
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton onClick={handleOrdersClick}>
            <ListItemIcon>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Orders" />
            {ordersOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {orderSubMenuItems.map((item, index) => (
                <ListItemButton
                  key={index}
                  component={NavLink}
                  to={item.path}
                  sx={(theme) => ({
                    pl: 4,
                    "&.active": {
                      backgroundColor: theme.palette.action.selected,
                    },
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
