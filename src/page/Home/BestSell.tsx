import { Container, Typography, Button, Card, CardMedia, CardContent, IconButton, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import React from "react";
import { useCart } from "../../hooks/useCart";

type ArrowProps = {
    onClick?: () => void;
}

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <IconButton
        sx={{
            position: "absolute",
            left: "-40px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
        }}
        onClick={onClick}
    >
        <ArrowBackIos />
    </IconButton>
);

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <IconButton
        sx={{
            position: "absolute",
            right: "-40px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
        }}
        onClick={onClick}
    >
        <ArrowForwardIos />
    </IconButton>
);

function BestSell() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };

    const { addProduct } = useCart()

    return (
        <Container sx={{ position: "relative", maxWidth: "lg" }}>
            <Typography variant="h4" sx={{ my: 3 }}>
                Best Selling Products
            </Typography>
            <Slider {...settings}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Grid item xs={12} sm={6} md={3} sx={{ px: 1 }} key={item}>
                        <Card sx={{
                            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "25em", transition: "0.3s", border: "1px solid rgb(194, 192, 192)",
                            '&:hover': {
                                border: "1px solid rgb(25, 167, 210)"
                            }
                        }}>
                            <CardMedia component="img" height="200" image="/new-arrival.jpg" alt={"anh"} sx={{ width: "100%", cursor: 'pointer' }} />
                            <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginTop: '0.5rem' }}>
                                    <Box sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                                        <Typography fontWeight="bold" sx={{ mb: 1 }}>{item}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{item} VND</Typography>
                                    </Box>
                                    <Box>
                                        <Button variant="contained" fullWidth
                                        // onClick={() => addProduct({
                                        //     productId: item.productId,
                                        //     productName: item.productName,
                                        //     price: item.price,
                                        //     quantity: 1
                                        // })}
                                        >
                                            Buy Now
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Slider>
        </Container>
    )
}

export default BestSell