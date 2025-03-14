import Slider from 'react-slick';
import { Card, CardMedia } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import carousel1 from "../assets/360_F_276216967_WSp6OeLbB1vxVuFVlxUGdL2G3pT3ptYB.jpg"
import carousel2 from "../assets/99347cf3432003081b5af0697c6ad7fe.jpg"
import carousel3 from "../assets/skin-care-sale-promotion-banner-260nw-2298047469.jpg"
import { Box } from '@mui/system';

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
        <Box sx={{ p: 3 }}>
            <Card sx={{ height: '500px' }}>
                <Slider {...settings}>
                    <CardMedia
                        component="img"
                        height="700"
                        image={carousel1}
                        alt="Khuyến mãi Skincare"
                    />
                    <CardMedia
                        component="img"
                        height="700"
                        image={carousel2}
                        alt="Khuyến mãi Skincare"
                    />
                    <CardMedia
                        component="img"
                        height="700"
                        image={carousel3}
                        alt="Khuyến mãi Skincare"
                    />
                </Slider>
            </Card>
        </Box>
    );
};

export default ImageCarousel;
