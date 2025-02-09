import { Container, Typography, Button, Card, CardMedia, CardContent, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import React from "react";

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

function FlashSales() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };

    return (
        <Container sx={{ position: "relative", maxWidth: "lg" }}>
            <Typography variant="h4" sx={{ my: 3 }}>
                Flash Sales
            </Typography>
            <Slider {...settings}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Grid item xs={12} sm={6} md={3} sx={{ px: 1 }} key={item}>
                        <Card>
                            <CardMedia component="img" height="150" image="/flash-sale.jpg" alt="Flash Sale" />
                            <CardContent sx={{ textAlign: "center" }}>
                                <Typography variant="h6">Sản phẩm {item}</Typography>
                                <Typography variant="body2">Giá: 250.000đ</Typography>
                                <Button variant="contained" sx={{ mt: 1 }}>
                                    Mua ngay
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Slider>
        </Container>
    );
}

export default FlashSales;
