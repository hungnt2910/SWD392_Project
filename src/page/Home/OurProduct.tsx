import { Container, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { portserver } from "../../utils/portserver";
import { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";

type Product = {
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
    const { addProduct } = useCart()

    const getAllProducts = async () => {
        await axios.get(`${portserver}/skincare-product`)
            .then((res) => {
                setProducts(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ my: 3 }}>Our product</Typography>
                <Button variant="outlined" onClick={() => nav('/allproduct')}>See All</Button>
            </Box>
            <Grid container spacing={4}>
                {products.slice(0, 8).map((item) => (
                    <Grid item md={3} sm={6} xs={12} sx={{ textAlign: 'center' }} key={item.productId}>
                        <Card sx={{
                            display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", height: "100%", transition: "0.3s", border: "1px solid rgb(194, 192, 192)",
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
            </Grid>
        </Container>
    )
}

export default OurProduct