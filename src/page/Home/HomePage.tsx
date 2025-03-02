import { Container, Card, CardMedia } from "@mui/material";
import ImageCarousel from "../../components/ImageCarousel";
import BestSell from "./BestSell";
import OurProduct from "./OurProduct";

function HomePage() {
    return (
        <div>
            <ImageCarousel />
            <BestSell />

            <Container sx={{ my: 5 }}>
                <Card>
                    <CardMedia component="img" height="200" image="/promo-banner.jpg" alt="Ưu đãi skincare" />
                </Card>
            </Container >

            <OurProduct />
        </div>
    );
}

export default HomePage