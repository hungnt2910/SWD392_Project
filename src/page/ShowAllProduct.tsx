import { Container, Typography, Button, Card, CardMedia, CardContent, Pagination, Chip } from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { portserver } from "../utils/portserver";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Brand, Product } from "../utils/types";
import { useCart } from "../hooks/useCart";
import { formatMoney } from "../utils/format";

function ShowAllProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brand, setBrand] = useState<Brand[]>([]);
    const [categoty, setCategory] = useState<{ name: String }[]>([])
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
                setBrand([{ brandId: 0, brandName: "ALL", country: "", logo: "" }, ...res.data])
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

    const itemsPerPage = 20;
    const [page, setPage] = useState(1);

    const startIndex = (page - 1) * itemsPerPage;
    const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Container>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 2 }}>
                {brand.map((item) => (
                    <Chip
                        key={item.brandId}
                        label={item.brandName}
                        variant="outlined"
                        sx={{
                            borderRadius: "16px",
                            color: "#D81B60",
                            borderColor: "#F8BBD0",
                            "&:hover": { borderColor: "#D81B60" },
                            cursor: "pointer",
                        }}
                        onClick={() => getProByBrand({ brandname: item.brandName })}
                    />
                ))}
            </Box>

            <Grid container spacing={4} sx={{ mt: 2 }}>
                {displayedProducts.map((item) => (
                    <Grid item md={3} sm={6} xs={12} key={item.productId}>
                        <Card sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            height: "100%",
                            transition: "0.3s",
                            border: "1px solid #F8BBD0",
                            borderRadius: "16px",
                            overflow: "hidden",
                            '&:hover': {
                                border: "1px solid #D81B60",
                                boxShadow: "0px 4px 12px rgba(216, 27, 96, 0.3)",
                            }
                        }}>
                            <CardMedia
                                component="img"
                                height="250"
                                image={item.urlImage}
                                alt={item.productName}
                                sx={{
                                    width: "100%",
                                    cursor: 'pointer',
                                    borderRadius: "16px 16px 0 0"
                                }}
                                onClick={() => nav(`/productdetail/${item.productId}`)}
                            />
                            <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginTop: '0.5rem' }}>
                                    <Box onClick={() => nav(`/productdetail/${item.productId}`)} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline", color: "#D81B60" } }}>
                                        <Typography fontWeight="bold" sx={{ mb: 1 }}>{item.productName}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{formatMoney(item.price)}</Typography>
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            sx={{
                                                borderRadius: "8px",
                                                textTransform: "none",
                                                fontSize: "1rem",
                                                backgroundColor: "#F06292",
                                                "&:hover": {
                                                    backgroundColor: "#D81B60",
                                                }
                                            }}
                                            onClick={() => addProduct({
                                                productId: item.productId,
                                                productName: item.productName,
                                                price: item.price,
                                                quantity: 1
                                            })}
                                        >
                                            Buy Now
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            <Pagination
                count={Math.ceil(products.length / itemsPerPage)}
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

export default ShowAllProduct;