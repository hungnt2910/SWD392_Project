import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

const Footer = () => {
    return (
        <Box component="footer" sx={{ backgroundColor: "#000", color: "#fff", py: 4 }}>
            <Container>
                <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
                    <Grid >
                        <Typography variant="h6" fontWeight="bold">
                            Skincare Store
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Providing high quality, safe and effective skin care products.
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography variant="h6" fontWeight="bold">
                            Contact
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Address: 123 Đường ABC, TP.HCM
                        </Typography>
                        <Typography variant="body2">Email: support@skincare.com</Typography>
                        <Typography variant="body2">Phone: 0123-456-789</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Typography variant="body2">&copy; 2025 Skincare Store. All rights reserved.</Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
