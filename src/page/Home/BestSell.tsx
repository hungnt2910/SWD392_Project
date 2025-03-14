import { Typography, Button, Card, CardMedia, CardContent, IconButton, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { Product } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { formatMoney } from "../../utils/format";

type ArrowProps = {
    onClick?: () => void;
};

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <IconButton
        sx={{
            position: "absolute",
            left: "-40px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#FFB6C1",
            color: "white",
            "&:hover": { backgroundColor: "#FF69B4" },
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
            backgroundColor: "#FFB6C1",
            color: "white",
            "&:hover": { backgroundColor: "#FF69B4" },
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
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const nav = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addProduct } = useCart();

    const getAllProducts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${portserver}/skincare-product`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <Box sx={{ px: 10, py: 5 }}>
            <Box sx={{ background: "linear-gradient(to bottom, #FFEBEE, #FFCDD2)", borderRadius: "16px", p: 3 }}>
                <Typography variant="h4" sx={{ my: 3, color: "#D81B60", fontWeight: "bold" }}>
                    Best Selling Skincare Products
                </Typography>
                {isLoading ? (
                    <Grid container spacing={2}>
                        {Array.from(new Array(4)).map((_, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card sx={{ borderRadius: "16px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                                    <Skeleton variant="rectangular" height={200} />
                                    <CardContent>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="50%" />
                                        <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ mx: -1 }}>
                        <Slider {...settings}>
                            {products.map((item) => (
                                <Box key={item.productId} sx={{ px: 1 }}>
                                    <Card sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                        height: "30em",
                                        transition: "0.3s",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        border: "1px solid #F48FB1",
                                        background: "white",
                                        '&:hover': {
                                            border: "1px solid #EC407A",
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)"
                                        }
                                    }}>
                                        <CardMedia component="img" height="300" image={item.urlImage} alt={item.productName}
                                            sx={{ width: "100%", cursor: 'pointer', borderRadius: "16px 16px 0 0" }}
                                            onClick={() => nav(`/productdetail/${item.productId}`)} />
                                        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginTop: '0.5rem' }}>
                                                <Box onClick={() => nav(`/productdetail/${item.productId}`)} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline", color: "#D81B60" } }}>
                                                    <Typography fontWeight="bold" sx={{ mb: 1 }}>{item.productName}</Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{formatMoney(item.price)}</Typography>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => addProduct({ productId: item.productId, productName: item.productName, price: item.price, quantity: 1 })}
                                                    sx={{
                                                        borderRadius: "8px",
                                                        textTransform: "none",
                                                        fontSize: "1rem",
                                                        backgroundColor: "#F06292",
                                                        "&:hover": { backgroundColor: "#D81B60" }
                                                    }}
                                                >
                                                    Buy Now
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default BestSell;
