import { Container, Card, CardMedia, Box } from "@mui/material";
import ImageCarousel from "../../components/ImageCarousel";
import BestSell from "./BestSell";
import OurProduct from "./OurProduct";
import media from '../../assets/set-of-flyers-with-woman-cosmetics-beauty-products-beauty-skin-care-cosmetics-shower-concept-illustration-for-banner-card-advertising-poster-vector.jpg'

function HomePage() {
    return (
        <div>
            <ImageCarousel />
            <BestSell />

            <Box sx={{ px: 7, my: 5 }}>
                <Card>
                    <CardMedia component="img" height="370" image={media} alt="Ưu đãi skincare" />
                </Card>
            </Box>

            <OurProduct />
        </div>
    );
}

export default HomePage