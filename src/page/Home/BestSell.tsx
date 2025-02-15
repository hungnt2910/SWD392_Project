import { Container, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid";

function BestSell() {
    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3 }}>Best selling product</Typography>
            <Grid container spacing={4}>
                {[1, 2, 3, 4].map((item) => (
                    <Grid item md={3} sm={6} xs={12} sx={{ textAlign: 'center' }} key={item}>
                        <Card >
                            <CardMedia component="img" height="150" image="/bestseller.jpg" alt="Sản phẩm bán chạy" />
                            <CardContent>
                                <Typography variant="h6">Sản phẩm {item}</Typography>
                                <Typography variant="body2">Giá: 300.000đ</Typography>
                                <Button variant="contained" sx={{ mt: 1 }}>Mua ngay</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container >
    )
}

export default BestSell