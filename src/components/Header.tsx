import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    TextField,
    Box,
    Menu,
    MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

const Header = () => {
    const nav = useNavigate();
    const { cart } = useCart()
    const [search, setSearch] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleSearch = async () => {
        if (!search.trim()) return;
        nav(`/searchproduct?search=${encodeURIComponent(search)}`);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        nav('/login')
    }

    const token = localStorage.getItem('token')
    const decode = token ? jwtDecode<{ role: string }>(token) : null;
    const userRole = decode?.role

    return (
        <AppBar position="fixed" color="default" sx={{ boxShadow: 2 }}>
            {/* <Container> */}
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                        src="/logo.png"
                        alt="Logo"
                        style={{ width: 40, height: 40 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Skincare Store
                    </Typography>
                </Box>
                {
                    userRole !== "Shipper" &&
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/contact">Contact</Button>
                        <Button color="inherit" component={Link} to="/quiz">Quiz</Button>
                    </Box>
                }

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {
                        userRole !== "Shipper" && (
                            <>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Search..."
                                    sx={{ width: 300 }}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                                {token &&
                                    <>
                                        <IconButton color="inherit" onClick={handleSearch}>
                                            <SearchIcon />
                                        </IconButton>
                                        <Button
                                            startIcon={<ShoppingCartIcon />}
                                            onClick={() => nav("/cart")}
                                            sx={{ color: "#D81B60", fontWeight: "bold", "&:hover": { color: "#B0003A" } }}
                                        >
                                            ({cart.reduce((total, item) => total + item.quantity, 0)})
                                        </Button>
                                    </>
                                }
                            </>
                        )
                    }
                    <IconButton color="inherit" onClick={handleMenuOpen} sx={{ fontSize: 32 }}>
                        <AccountCircleIcon fontSize="large" />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {/* <MenuItem onClick={() => { nav("/profile"); handleMenuClose(); }}>Profile</MenuItem> */}
                        {token &&
                            <MenuItem onClick={() => { nav("/skincareroutine"); handleMenuClose(); }}>Skin Care Routine</MenuItem>
                        }

                        {userRole === "Admin" &&
                            <MenuItem onClick={() => { nav("/skincareroutine"); handleMenuClose(); }}>Admin</MenuItem>
                        }
                        {token ?
                            <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
                            :
                            <MenuItem onClick={() => { nav("/login"); handleMenuClose(); }}>Sign in</MenuItem>
                        }
                    </Menu>
                </Box>
            </Toolbar>
            {/* </Container> */}
        </AppBar>
    );
};

export default Header;
