import { Container, Typography, Button, Card, CardMedia, CardContent, Pagination } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { portserver } from "../utils/portserver";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Brand, Product } from "../utils/types";
import { useCart } from "../hooks/useCart";


function ShowAllProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brand, setbrand] = useState<Brand[]>([]);
    const nav = useNavigate();
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

    const getProByBrand = async ({ brandname }: { brandname: string }) => {
        if (brandname === "ALL") {
            getAllProducts();
        } else {
            await axios.get(`${portserver}/skincare-product/brand/${brandname}`)
                .then((res) => {
                    setProducts(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const getAllBrand = async () => {
        await axios.get(`${portserver}/brand`)
            .then((res) => {
                setbrand([{ brandId: 0, brandName: "ALL", country: "", logo: "" }, ...res.data])
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getAllProducts();
        getAllBrand();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const itemsPerpage = 20;
    const [page, setPage] = useState(1);

    const startIndex = (page - 1) * itemsPerpage;
    const displayedProducts = products.slice(startIndex, startIndex + itemsPerpage);


    return (
        <Container>
            {/* {[{ brandId: 0, brandName: "ALL", country: "", logo: "" }, ...brand].map((item) => ( */}
            {brand.map((item) => (
                <Button variant="outlined" key={item.brandId} sx={{ mr: 1, my: 1 }}
                    onClick={() => getProByBrand({ brandname: item.brandName })}
                >
                    {item.brandName}
                </Button>
            ))}

            <Grid container spacing={4} sx={{ mt: 2 }}>
                {displayedProducts.map((item) => (
                    <Grid item md={3} sm={6} xs={12} key={item.productId}>
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

            <Pagination
                count={Math.ceil(products.length / itemsPerpage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                boundaryCount={3}
                siblingCount={0}
                sx={{ mt: 3, display: "flex", justifyContent: "center" }}
            />
        </Container>
    );
}

export default ShowAllProduct