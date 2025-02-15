import { Container, Card, CardMedia } from "@mui/material";
import ImageCarousel from "../../components/ImageCarousel";
import FlashSale from "./FlashSale";
import BestSell from "./BestSell";
import OurProduct from "./OurProduct";

function HomePage() {
    return (
        <div>
            <ImageCarousel />
            <FlashSale />
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