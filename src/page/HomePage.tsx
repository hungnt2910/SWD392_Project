import { Container, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";

function HomePage() {
    return (
        <div>
            <Container sx={{ my: 4 }}>
                <Card>
                    <CardMedia component="img" height="400" image="/banner-skincare.jpg" alt="Khuyến mãi Skincare" />
                </Card>
            </Container>

            <Container>
                <Typography variant="h4" sx={{ my: 3 }}>Flash Sales</Typography>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid key={item}>
                            <Card>
                                <CardMedia component="img" height="150" image="/flash-sale.jpg" alt="Flash Sale" />
                                <CardContent>
                                    <Typography variant="h6">Sản phẩm {item}</Typography>
                                    <Typography variant="body2">Giá: 250.000đ</Typography>
                                    <Button variant="contained" color="secondary" sx={{ mt: 1 }}>Mua ngay</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Container>
                <Typography variant="h4" sx={{ my: 3 }}>Sản phẩm bán chạy</Typography>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid key={item}>
                            <Card >
                                <CardMedia component="img" height="150" image="/bestseller.jpg" alt="Sản phẩm bán chạy" />
                                <CardContent>
                                    <Typography variant="h6">Sản phẩm {item}</Typography>
                                    <Typography variant="body2">Giá: 300.000đ</Typography>
                                    <Button variant="contained" color="secondary" sx={{ mt: 1 }}>Mua ngay</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container >

            <Container sx={{ my: 5 }}>
                <Card>
                    <CardMedia component="img" height="200" image="/promo-banner.jpg" alt="Ưu đãi skincare" />
                </Card>
            </Container >

            <Container  >
                <Typography variant="h4" sx={{ my: 3 }}>Sản phẩm mới về</Typography>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid key={item}>
                            <Card>
                                <CardMedia component="img" height="150" image="/new-arrival.jpg" alt="Sản phẩm mới về" />
                                <CardContent>
                                    <Typography variant="h6">Sản phẩm {item}</Typography>
                                    <Typography variant="body2">Giá: 350.000đ</Typography>
                                    <Button variant="contained" color="secondary" sx={{ mt: 1 }}>Mua ngay</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div >
    );
}

export default HomePage