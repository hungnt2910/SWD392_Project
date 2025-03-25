import { Toolbar, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

function ShipperNav() {
    const location = useLocation();

    return (
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                {[
                    { label: "Delivery", path: "/shipper/delivery" },
                    { label: "Returns", path: "/shipper/returns" },
                ].map(({ label, path }) => (
                    <Button
                        key={path}
                        component={Link}
                        to={path}
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            transition: "0.3s",
                            border: location.pathname === path ? `2px solid #ffb6c1` : "2px solid transparent",
                            color: "black",
                            fontWeight: "bold",
                            "&:hover": {
                                border: `2px solid #ffb6c1`,
                                backgroundColor: '#ffccd5',
                            },
                        }}
                    >
                        {label}
                    </Button>
                ))}
            </Toolbar>
        </Box>
    );
}

export default ShipperNav;