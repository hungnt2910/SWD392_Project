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
import { Link } from "react-router-dom";

const Header = () => {
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
                        <Button color="inherit" component={Link} to="/about">About</Button>
                        <Button color="inherit" component={Link} to="/contact">Contact</Button>
                        <Button color="inherit" component={Link} to="/register">Sign Up</Button>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <TextField variant="outlined" size="small" placeholder="Search..." sx={{ width: 300 }} />
                        <IconButton color="inherit">
                            <SearchIcon />
                        </IconButton>
                        <IconButton color="inherit">
                            <ShoppingCartIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
