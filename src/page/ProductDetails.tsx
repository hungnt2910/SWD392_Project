import { Container, Grid, Typography, Button, Card, CardMedia, CardContent, IconButton, Box } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";

const ProductDetails = () => {
    const [imgdetails, setImgDetails] = useState("/images/gamepad-main.jpg");

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={imgdetails}
                            alt="Havic HV G-92 Gamepad"
                        />
                    </Card>

                    <Grid container spacing={1} mt={1}>
                        {["/images/gamepad1.jpg", "/images/gamepad2.jpg", "/images/gamepad3.jpg"].map((img, index) => (
                            <Grid item xs={4} key={index}>
                                <Button onClick={() => setImgDetails(img)}>
                                    <Card>
                                        <CardMedia component="img" height="80" image={img} alt={`Gamepad Image ${index + 1}`} />
                                    </Card>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        Havic HV G-92 Gamepad
                    </Typography>
                    <Typography variant="h5" color="primary">
                        $192.00
                    </Typography>
                    <Typography variant="body1" paragraph>
                        PlayStation 5 Controller Skin high quality with an elegant design, protecting your controller while making it more comfortable to use.
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <Button variant="contained" color="primary" startIcon={<ShoppingCartIcon />}>
                            Buy Now
                        </Button>
                        <IconButton color="secondary">
                            <FavoriteBorderIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>

            <Typography variant="h5" mt={5} mb={2}>
                Related Items
            </Typography>
            <Grid container spacing={2}>
                {[1, 2, 3, 4].map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item}>
                        <Card>
                            <CardMedia component="img" height="140" image={`/images/related${item}.jpg`} alt={`Related Product ${item}`} />
                            <CardContent>
                                <Typography variant="h6">Product {item}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    $99.00
                                </Typography>
                            </CardContent>
                            <Button variant="contained" fullWidth>
                                Add to Cart
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductDetails;
