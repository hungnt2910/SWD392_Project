import { Container, Grid, Typography, Button, Card, CardMedia, CardContent, IconButton, Box } from "@mui/material";
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

type Product = {
    productId: number,
    productName: string,
    description: string,
    price: number,
    isActive: boolean,
    stock: number
    relatedProduct: Product[]
}

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

const ProductDetails = () => {
    const id = useParams();
    const productId = Number(id.id);
    const [product, setProduct] = useState<Product>({ productId: 0, productName: "", description: "", price: 0, isActive: false, stock: 0, relatedProduct: [] });
    const nav = useNavigate();
    const { addProduct } = useCart()

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
        await axios.get(`${portserver}/skincare-product/${productId}`)
            .then((res) => {
                console.log(res.data)
                setProduct(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getProDetails();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={"/images/gamepad-main.jpg"}
                            alt="Havic HV G-92 Gamepad"
                        />
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {product?.productName}
                    </Typography>
                    <Typography variant="h5" color="primary">
                        {product?.price} VND
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product?.description}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <Button variant="contained" color="primary" startIcon={<ShoppingCartIcon />} onClick={() => addProduct({
                            productId: product.productId,
                            productName: product.productName,
                            price: product.price,
                            quantity: 1
                        })}>
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
            <Slider {...settings}>
                {product?.relatedProduct.map((item) => (
                    <Grid item xs={12} sm={6} md={3} sx={{ px: 1 }} key={item.productId}>
                        <Card sx={{
                            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "25em", transition: "0.3s", border: "1px solid rgb(194, 192, 192)",
                            '&:hover': {
                                border: "1px solid rgb(25, 167, 210)"
                            }
                        }}>
                            <CardMedia component="img" height="200" image="/new-arrival.jpg" alt={item.productName} sx={{ width: "100%", cursor: 'pointer' }} onClick={() => nav(`/productdetail/${item.productId}`)} />
                            <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginTop: '0.5rem' }}>
                                    <Box onClick={() => nav(`/productdetail/${item.productId}`)} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                                        <Typography fontWeight="bold" sx={{ mb: 1 }}>{item.productName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{item.price} VND</Typography>
                                    </Box>
                                    <Box>
                                        <Button variant="contained" fullWidth onClick={() => addProduct({
                                            productId: item.productId,
                                            productName: item.productName,
                                            price: item.price,
                                            quantity: 1
                                        })}>Buy Now</Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Slider>
        </Container>
    );
};

export default ProductDetails;
