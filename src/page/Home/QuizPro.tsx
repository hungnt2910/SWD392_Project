import {
    Box, Card, CardContent, CardMedia, Typography, Button, IconButton, CircularProgress
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { formatMoney } from "../../utils/format";
import { portserver } from "../../utils/portserver";
import { useCart } from "../../hooks/useCart";
import { jwtDecode } from "jwt-decode";

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

type Category = {
    categoryId: number;
    name: string;
};

type Product = {
    urlImage: string;
    productId: number;
    productName: string;
    description: string;
    price: number;
    isActive: boolean;
    stock: number;
    category: Category;
    averageRating: string;
};

function QuizPro() {
    const [products, setProducts] = useState<Product[] | null>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const nav = useNavigate();
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ skinType: number }>(token) : null;
    const skinTypeId = decode?.skinType || localStorage.getItem('skinTypeId')
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

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${portserver}/skincare-product/skin-type/${skinTypeId}`);
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [skinTypeId]);

    const checkStock = (pro: Product) => {
        return pro.stock < 5;
    };

    return (
        <Box sx={{ px: 10, my: 3 }}>

            <Typography variant="h5" mb={2} sx={{ color: "#D81B60", fontWeight: "bold" }}>
                Products suitable for your skin type
            </Typography>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                    <CircularProgress color="secondary" />
                </Box>
            ) : (
                <Slider {...settings}>
                    {products?.map((item) => (
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
                                            disabled={checkStock(item)}
                                            sx={{
                                                borderRadius: "8px",
                                                textTransform: "none",
                                                fontSize: "1rem",
                                                backgroundColor: checkStock(item) ? "#BDBDBD" : "#F06292",
                                                "&:hover": { backgroundColor: checkStock(item) ? "#BDBDBD" : "#D81B60" }
                                            }}
                                            onClick={() => addProduct({ productId: item.productId, productName: item.productName, price: item.price, quantity: 1 })}
                                        >
                                            Buy Now
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Slider>
            )}
        </Box>
    );
}

export default QuizPro;
