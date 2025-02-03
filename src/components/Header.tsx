import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <AppBar position="static" color="default">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Skincare Store</Typography>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/about">About</Button>
                <Button color="inherit" component={Link} to="/contact">Contact</Button>
                <Button color="inherit" component={Link} to="/login">Sign Up</Button>
                <TextField variant="outlined" size="small" placeholder="Tìm kiếm..." sx={{ mx: 2 }} />
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <IconButton>
                    <ShoppingCartIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
