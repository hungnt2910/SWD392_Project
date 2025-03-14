import { Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function CartNav() {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button color="inherit" component={Link} to="/cart">Cart</Button>
                <Button color="inherit" component={Link} to="/order">Order</Button>
            </Toolbar>
        </Box>
    );
}

export default CartNav;
