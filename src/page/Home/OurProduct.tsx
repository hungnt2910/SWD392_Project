import { Container, Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

function OurProduct() {
    const nav = useNavigate();

    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ my: 3 }}>Our product</Typography>
                <Button variant="outlined" onClick={() => nav('/allproduct')}>See All</Button>
            </Box>
            <Grid container spacing={4}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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

export default OurProduct