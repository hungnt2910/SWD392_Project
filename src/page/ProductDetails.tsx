import {
    Container, Grid, Typography, Button, Card, CardMedia, CardContent, IconButton,
    Box, Skeleton
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { portserver } from "../utils/portserver";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useCart } from "../hooks/useCart";
import { formatMoney } from "../utils/format";

type Product = {
    urlImage: string,
    productId: number,
    productName: string,
    description: string,
    price: number,
    isActive: boolean,
    stock: number,
    relatedProduct: Product[]
};

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <IconButton
        sx={{
            position: "absolute", left: "-40px", top: "50%", transform: "translateY(-50%)",
            zIndex: 2, backgroundColor: "#F8BBD0", color: "white",
            "&:hover": { backgroundColor: "#EC407A" }
        }}
        onClick={onClick}
    >
        <ArrowBackIos />
    </IconButton>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <IconButton
        sx={{
            position: "absolute", right: "-40px", top: "50%", transform: "translateY(-50%)",
            zIndex: 2, backgroundColor: "#F8BBD0", color: "white",
            "&:hover": { backgroundColor: "#EC407A" }
        }}
        onClick={onClick}
    >
        <ArrowForwardIos />
    </IconButton>
);

const ProductDetails = () => {
    const id = useParams();
    const productId = Number(id.id);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const nav = useNavigate();
    const { addProduct } = useCart();

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };

    const getProDetails = async () => {
        try {
            const res = await axios.get(`${portserver}/skincare-product/${productId}`);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProDetails();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: "16px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                        {isLoading ? (
                            <Skeleton variant="rectangular" height={400} />
                        ) : (
                            <CardMedia
                                component="img"
                                height="500"
                                image={product?.urlImage}
                                alt={product?.productName}
                                sx={{ borderRadius: "16px" }}
                            />
                        )}
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom sx={{ color: "#EC407A", fontWeight: "bold" }}>
                        {isLoading ? <Skeleton width="60%" /> : product?.productName}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#D81B60", fontWeight: "bold" }}>
                        {isLoading ? <Skeleton width="40%" /> : formatMoney(product?.price ?? 0)}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {isLoading ? (
                            <>
                                <Skeleton width="100%" />
                                <Skeleton width="90%" />
                                <Skeleton width="80%" />
                            </>
                        ) : (
                            product?.description
                        )}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <Button
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            disabled={isLoading}
                            onClick={() => product && addProduct({
                                productId: product.productId,
                                productName: product.productName,
                                price: product.price,
                                quantity: 1
                            })}
                            sx={{
                                backgroundColor: "#F06292",
                                borderRadius: "8px",
                                textTransform: "none",
                                fontSize: "1rem",
                                "&:hover": { backgroundColor: "#D81B60" }
                            }}
                        >
                            Buy Now
                        </Button>
                        <IconButton color="secondary" disabled={isLoading}>
                            <FavoriteBorderIcon />
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>

            <Typography variant="h5" mt={5} mb={2} sx={{ color: "#D81B60", fontWeight: "bold" }}>
                Related Items
            </Typography>
            {isLoading ? (
                <Grid container spacing={2}>
                    {[...Array(4)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Skeleton variant="rectangular" height={250} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ mx: -1 }}>
                    <Slider {...settings}>
                        {product?.relatedProduct.map((item) => (
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
        </Container>
    );
};

export default ProductDetails;
