import { Typography, Button, Card, CardMedia, CardContent, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { portserver } from "../../utils/portserver";
import { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { formatMoney } from "../../utils/format";

type Product = {
    urlImage: string,
    productId: number,
    productName: string,
    description: string,
    price: number,
    isActive: boolean,
    stock: number
}

function OurProduct() {
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
        <Box sx={{ px: 10 }}>
            <Box sx={{ background: "linear-gradient(to bottom, #FFF0F5, #FFD1DC)", borderRadius: "16px", p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ my: 3, fontWeight: "bold", color: "#D81B60" }}>Our Products</Typography>
                    <Button variant="outlined" onClick={() => nav('/allproduct')} sx={{ borderRadius: "8px", borderColor: "#F8BBD0", color: "#D81B60", "&:hover": { backgroundColor: "#F8BBD0", color: "white" } }}>
                        See All
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    {isLoading ? (
                        Array.from(new Array(8)).map((_, index) => (
                            <Grid item md={3} sm={6} xs={12} key={index} sx={{ textAlign: 'center' }}>
                                <Card sx={{ borderRadius: "16px", backgroundColor: "white", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
                                    <Skeleton variant="rectangular" height={200} />
                                    <CardContent>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="50%" />
                                        <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        products.slice(0, 8).map((item) => (
                            <Grid item md={3} sm={6} xs={12} sx={{ textAlign: 'center' }} key={item.productId}>
                                <Card sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    height: "100%",
                                    transition: "0.3s",
                                    border: "1px solid #F8BBD0",
                                    borderRadius: "16px",
                                    backgroundColor: "white",
                                    overflow: "hidden",
                                    '&:hover': {
                                        border: "1px solid #D81B60",
                                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)"
                                    }
                                }}>
                                    <CardMedia component="img" height="300" image={item.urlImage} alt={item.productName} sx={{ width: "100%", cursor: 'pointer', borderRadius: "16px 16px 0 0" }} onClick={() => nav(`/productdetail/${item.productId}`)} />
                                    <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginTop: '0.5rem' }}>
                                            <Box onClick={() => nav(`/productdetail/${item.productId}`)} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline", color: "#D81B60" } }}>
                                                <Typography fontWeight="bold" sx={{ mb: 1, color: "#D81B60" }}>{item.productName}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, color: "#5C5C5C" }}>{formatMoney(item.price)}</Typography>
                                            </Box>
                                            <Box>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => addProduct({
                                                        productId: item.productId,
                                                        productName: item.productName,
                                                        price: item.price,
                                                        quantity: 1
                                                    })}
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
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
        </Box>

    );
}

export default OurProduct;
