import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    TextField,
    Box,
    Container
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useState } from "react";

const Header = () => {
    const nav = useNavigate();
    const { cart } = useCart()
    const [search, setSearch] = useState<string>("");

    const handleSearch = async () => {
        if (!search.trim()) return;
        nav(`/searchproduct?search=${encodeURIComponent(search)}`);
    }

    return (
        <AppBar position="fixed" color="default" sx={{ boxShadow: 2 }}>
            <Container>
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

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button color="inherit" component={Link} to="/">Home</Button>
                        <Button color="inherit" component={Link} to="/contact">Contact</Button>
                        <Button color="inherit" component={Link} to="/register">Sign Up</Button>
                        <Button color="inherit" component={Link} to="/quiz">Quiz</Button>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Search..."
                            sx={{ width: 300 }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <IconButton color="inherit" onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                        <Button startIcon={<ShoppingCartIcon />} onClick={() => nav("/cart")}>
                            ({cart.reduce((total, item) => total + item.quantity, 0)})
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
};

export default Header;
