import { Container, Typography, Button, Card, CardMedia, CardContent, Pagination } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";


const products = Array.from({ length: 200 }, (_, i) => i + 1);


function ShowAllProduct() {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const itemsPerpage = 20;
    const [page, setPage] = useState(1);

    const startIndex = (page - 1) * itemsPerpage;
    const displayedProducts = products.slice(startIndex, startIndex + itemsPerpage);


    return (
        <Container>
            {["ALL", "Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"].map((item) => (
                <Button variant="outlined" key={item} sx={{ mr: 1 }}>{item}</Button>
            ))}

            <Grid container spacing={4} sx={{ mt: 2 }}>
                {displayedProducts.map((item) => (
                    <Grid item md={3} sm={6} xs={12} sx={{ textAlign: "center" }} key={item}>
                        <Card>
                            <CardMedia component="img" height="150" image="/new-arrival.jpg" alt="Sản phẩm mới về" />
                            <CardContent>
                                <Typography variant="h6">Sản phẩm {item}</Typography>
                                <Typography variant="body2">Giá: 350.000đ</Typography>
                                <Button variant="contained" sx={{ mt: 1 }}>Mua ngay</Button>
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