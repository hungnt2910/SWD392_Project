import { Container, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";

function ShowAllProduct() {
    return (
        <Container>
            <Box sx={{ marginBottom: '2em' }}>
                {["ALL", "Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5"].map((item) => (
                    <Button variant="outlined" key={item} sx={{ mr: 1 }}>{item}</Button>
                ))
                }
            </Box>

            <Grid container spacing={4}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
                    <Grid item md={3} sm={6} xs={12} sx={{ textAlign: 'center' }} key={item}>
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
        </Container>
    )
}

export default ShowAllProduct