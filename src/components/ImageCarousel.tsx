import Slider from 'react-slick';
import { Container, Card, CardMedia } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Container sx={{ my: 4 }}>
            <Card>
                <Slider {...settings}>
                    <CardMedia
                        component="img"
                        height="400"
                        image="/banner-skincare.jpg"
                        alt="Khuyến mãi Skincare"
                    />
                    <CardMedia
                        component="img"
                        height="400"
                        image="/banner-skincare2.jpg"
                        alt="Khuyến mãi Skincare 2"
                    />
                    <CardMedia
                        component="img"
                        height="400"
                        image="/banner-skincare3.jpg"
                        alt="Khuyến mãi Skincare 3"
                    />
                </Slider>
            </Card>
        </Container>
    );
};

export default ImageCarousel;
