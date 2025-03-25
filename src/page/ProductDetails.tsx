import {
    Container, Grid, Typography, Button, Card, CardMedia, CardContent, IconButton,
    Box, Skeleton,
    CircularProgress,
    Rating,
    Paper,
    TextField
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { portserver } from "../utils/portserver";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos, LocalOffer, Send, Star } from "@mui/icons-material";
import { useCart } from "../hooks/useCart";
import { formatMoney } from "../utils/format";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { MdAddCircle, MdCompareArrows } from "react-icons/md";

type Category = {
    categoryId: number,
    name: string
}

type Product = {
    urlImage: string,
    productId: number,
    productName: string,
    description: string,
    price: number,
    isActive: boolean,
    stock: number,
    relatedProducts: Product[]
    category: Category
    averageRating: string
};

type Detail = {
    urlImage: string,
    productId: number,
    productName: string,
    description: string,
    price: number,
    isActive: boolean,
    stock: number,
    relatedProducts: Product[]
    category: string
    averageRating: string
};

type Review = {
    reviewId: number,
    rating: number,
    comment: string,
    reviewDate: Date,
    userId: number,
    username: string
}

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <IconButton
        sx={{
            position: "absolute", left: "-40px", top: "50%", transform: "translateY(-50%)",
            zIndex: 2, backgroundColor: "#F8BBD0", color: "white",
            "&:hover": { backgroundColor: "#EC407A" }
        }}
        onClick={onClick}
    >
        <ArrowBackIos />
    </IconButton>
);

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <IconButton
        sx={{
            position: "absolute", right: "-40px", top: "50%", transform: "translateY(-50%)",
            zIndex: 2, backgroundColor: "#F8BBD0", color: "white",
            "&:hover": { backgroundColor: "#EC407A" }
        }}
        onClick={onClick}
    >
        <ArrowForwardIos />
    </IconButton>
);

const ProductDetails = () => {
    const id = useParams();
    const productId = Number(id.id);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const nav = useNavigate();
    const { addProduct } = useCart();
    const [openCompareDialog, setOpenCompareDialog] = useState(false);
    const [product2, setProduct2] = useState<Product | null>(null);
    const [showAll, setShowAll] = useState(false)
    const [allpro, setAllPro] = useState<Product[] | null>(null);
    const [detail1, setDetail1] = useState<Detail | null>(null);
    const [detail2, setDetail2] = useState<Detail | null>(null);
    const [showCompare, setShowCompare] = useState(false)
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const [reviews, setRviews] = useState<Review[]>([])



    const checkStock = (pro: Product | null) => {

        console.log('pro', pro)
        return pro ? pro.stock < 2 : false;
    };


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };

    const getProDetails = async () => {
        try {
            const res = await axios.get(`${portserver}/skincare-product/${productId}`);
            setProduct(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProDetails();
        handleGetReview();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    const handleCloseCompareDialog = () => {
        setProduct2(null)
        setOpenCompareDialog(false);
    };

    const handleAddProduct = async () => {
        try {
            const res = await axios.get(`${portserver}/skincare-product`);

            const data = res.data.filter((i: any) => i.category.name === product?.category.name && i.productId !== product?.productId);
            setAllPro(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleCompare = async () => {
        try {
            const res = await axios.get(`${portserver}/skincare-product/compare/${productId}/${product2?.productId}`);

            setProduct2(null)
            setShowCompare(true)
            setOpenCompareDialog(false)
            setDetail1(res.data.product1)
            setDetail2(res.data.product2)
            setTimeout(() => {
                setIsLoadingDetail(false)
            }, 2000)
        } catch (err) {
            console.error(err);
        }
    }

    const handleGetReview = async () => {
        try {
            const res = await axios.get(`${portserver}/reviews/getReviewsByProductId/${productId}`);
            setRviews(res.data)
        } catch (err) {
            console.error(err);
        }
    }

    console.log(product)

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Dialog open={showAll} onClose={() => setShowAll(false)} maxWidth="lg" fullWidth>
                <DialogTitle>All Products Related</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {allpro ? (
                            allpro.map((item: any) => (
                                <Grid item xs={12} sm={6} md={3} key={item.productId}>
                                    <Card
                                        sx={{
                                            borderRadius: "16px",
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                            height: "450px",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="250"
                                            image={item.urlImage}
                                            alt={item.productName}
                                            sx={{
                                                width: "100%",
                                                objectFit: "cover",
                                                borderTopLeftRadius: "16px",
                                                borderTopRightRadius: "16px",
                                            }}
                                        />
                                        <CardContent
                                            sx={{
                                                textAlign: "center",
                                                flex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>{item.productName}</Typography>
                                            <Typography variant="body2" sx={{ flexGrow: 1 }}>{formatMoney(item.price)}</Typography>

                                            <Box sx={{ flexGrow: 1 }} />

                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => { setProduct2(item), setShowAll(false) }}
                                                sx={{
                                                    borderRadius: "8px",
                                                    textTransform: "none",
                                                    fontSize: "1rem",
                                                    backgroundColor: "#F06292",
                                                    "&:hover": { backgroundColor: "#D81B60" },
                                                }}
                                            >
                                                Choose
                                            </Button>
                                        </CardContent>
                                    </Card>

                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1" color="text.secondary">
                                No products available.
                            </Typography>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAll(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showCompare} onClose={() => { setShowCompare(false), setIsLoadingDetail(true) }} maxWidth="lg" fullWidth>
                {!isLoadingDetail ? (
                    <>
                        <DialogTitle sx={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", color: "#1976D2" }}>
                            🛍️ Compare Products
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3} justifyContent="center">
                                {[detail1, detail2].map((item, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Card
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                boxShadow: 2,
                                                borderRadius: 3,
                                                p: 2,
                                                border: "1px solid #ddd",
                                                backgroundColor: "#FAFAFA",
                                                height: "500px",
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                image={item?.urlImage}
                                                alt={item?.productName}
                                                sx={{
                                                    width: 220,
                                                    height: 220,
                                                    objectFit: "cover",
                                                    borderRadius: 2,
                                                }}
                                            />
                                            <CardContent
                                                sx={{
                                                    textAlign: "center",
                                                    width: "100%",
                                                    flex: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", flexGrow: 1 }}>
                                                    {item?.productName}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
                                                    {item?.category}
                                                </Typography>
                                                <Typography variant="body2" sx={{ my: 1, flexGrow: 1 }}>
                                                    {item?.description}
                                                </Typography>

                                                <Box sx={{ flexGrow: 1 }} />

                                                <Grid container justifyContent="center" spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item sx={{ display: "flex", alignItems: "center" }}>
                                                        <LocalOffer sx={{ color: "#FF5722", mr: 1 }} />
                                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FF5722" }}>
                                                            {formatMoney(item?.price ?? 0)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item sx={{ display: "flex", alignItems: "center" }}>
                                                        <Star sx={{ color: "#FFD700", mr: 1 }} />
                                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#FFD700" }}>
                                                            {item?.averageRating}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>

                                    </Grid>
                                ))}
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                            <Button
                                onClick={() => { setShowCompare(false), setIsLoadingDetail(true) }}
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(to right,rgb(224, 147, 218), #64B5F6)",
                                    color: "white",
                                    borderRadius: "20px",
                                    px: 3,
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                ) : (
                    <DialogContent sx={{ textAlign: "center", py: 5 }}>
                        <CircularProgress color="secondary" />
                        <Typography variant="body1" sx={{ mt: 2, color: "rgb(224, 147, 218)" }}>
                            Loading products...
                        </Typography>
                    </DialogContent>
                )}
            </Dialog>;


            <Dialog open={openCompareDialog} onClose={handleCloseCompareDialog} maxWidth="lg" fullWidth>
                <DialogTitle>Compare Products</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 350 }}>
                                <CardMedia
                                    component="img"
                                    image={product?.urlImage}
                                    alt={product?.productName}
                                    sx={{ width: 210, height: 210, objectFit: 'cover', marginBottom: 2 }}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6">{product?.productName}</Typography>
                                    <Typography variant="body2">{formatMoney(product?.price ?? 0)}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {product2 ? (
                            <Grid item xs={12} sm={6}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 350 }}>
                                    <CardMedia
                                        component="img"
                                        image={product2?.urlImage}
                                        alt={product2?.productName}
                                        sx={{ width: 210, height: 210, objectFit: 'cover', marginBottom: 2 }}
                                    />
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6">{product2?.productName}</Typography>
                                        <Typography variant="body2">{formatMoney(product2?.price ?? 0)}</Typography>
                                    </CardContent>
                                </Card>
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<MdAddCircle />}
                                        sx={{
                                            backgroundColor: "#F06292",
                                            color: "white",
                                            borderRadius: "8px",
                                            fontSize: "1rem",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            padding: "8px 16px",
                                            "&:hover": { backgroundColor: "#D81B60" }
                                        }}
                                        onClick={() => setShowAll(true)}
                                    >
                                        Choose other
                                    </Button>

                                    <Button
                                        variant="contained"
                                        startIcon={<MdCompareArrows />}
                                        sx={{
                                            backgroundColor: "#EC407A",
                                            color: "white",
                                            borderRadius: "8px",
                                            fontSize: "1rem",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            padding: "8px 16px",
                                            "&:hover": { backgroundColor: "#D81B60" }
                                        }}
                                        onClick={handleCompare}
                                    >
                                        Compare
                                    </Button>
                                </Box>

                            </Grid>
                        ) : (
                            <Grid item xs={12} sm={6}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 350 }}>
                                    <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<MdAddCircle />}
                                            onClick={() => { handleAddProduct(), setShowAll(true) }}
                                            sx={{
                                                borderColor: '#D81B60',
                                                color: '#D81B60',
                                                borderRadius: 2,
                                                fontWeight: 'bold',
                                                '&:hover': {
                                                    borderColor: '#D81B60',
                                                    backgroundColor: '#F8BBD0',
                                                },
                                            }}
                                        >
                                            Add Product
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCompareDialog} color="primary">Close</Button>
                </DialogActions>
            </Dialog>


            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: "16px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                        {isLoading ? (
                            <Skeleton variant="rectangular" height={400} />
                        ) : (
                            <CardMedia
                                component="img"
                                height="500"
                                image={product?.urlImage}
                                alt={product?.productName}
                                sx={{ borderRadius: "16px" }}
                            />
                        )}
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom sx={{ color: "#EC407A", fontWeight: "bold" }}>
                        {isLoading ? <Skeleton width="60%" /> : product?.productName}
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#D81B60", fontWeight: "bold" }}>
                        {isLoading ? <Skeleton width="40%" /> : formatMoney(product?.price ?? 0)}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {isLoading ? (
                            <>
                                <Skeleton width="100%" />
                                <Skeleton width="90%" />
                                <Skeleton width="80%" />
                            </>
                        ) : (
                            product?.description
                        )}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <Button
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            disabled={isLoading}
                            onClick={() => product && addProduct({
                                productId: product.productId,
                                productName: product.productName,
                                price: product.price,
                                quantity: 1
                            })}
                            sx={{
                                backgroundColor: checkStock(product) ? "#BDBDBD" : "#F06292",
                                borderRadius: "8px",
                                textTransform: "none",
                                fontSize: "1rem",
                                "&:hover": { backgroundColor: checkStock(product) ? "#BDBDBD" : "#D81B60" }
                            }}
                        >
                            Buy Now
                        </Button>
                        <IconButton color="secondary" disabled={isLoading}>
                            <FavoriteBorderIcon />
                        </IconButton>
                    </Box>


                    <Box display="flex" alignItems="center" gap={2} mt={2}>
                        <Button
                            variant="contained"
                            startIcon={<MdCompareArrows />}
                            disabled={isLoading}
                            onClick={() => { setOpenCompareDialog(true) }}
                            sx={{
                                backgroundColor: "#F06292",
                                borderRadius: "8px",
                                textTransform: "none",
                                fontSize: "1rem",
                                "&:hover": { backgroundColor: "#D81B60" }
                            }}
                        >
                            Compare to other product
                        </Button>

                    </Box>
                </Grid>
            </Grid>

            <Typography variant="h5" mt={5} mb={2} sx={{ color: "#D81B60", fontWeight: "bold" }}>
                Related Items
            </Typography>
            {
                isLoading ? (
                    <Grid container spacing={2}>
                        {[...Array(4)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Skeleton variant="rectangular" height={250} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ mx: -1 }}>
                        <Slider {...settings}>
                            {product?.relatedProducts?.map((item) => (
                                <Box key={item.productId} sx={{ px: 1 }}>
                                    <Card sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                        height: "30em",
                                        transition: "0.3s",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        border: "1px solid #F48FB1",
                                        background: "white",
                                        '&:hover': {
                                            border: "1px solid #EC407A",
                                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)"
                                        }
                                    }}>
                                        <CardMedia component="img" height="300" image={item.urlImage} alt={item.productName}
                                            sx={{ width: "100%", cursor: 'pointer', borderRadius: "16px 16px 0 0" }}
                                            onClick={() => nav(`/productdetail/${item.productId}`)} />
                                        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginTop: '0.5rem' }}>
                                                <Box onClick={() => nav(`/productdetail/${item.productId}`)} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline", color: "#D81B60" } }}>
                                                    <Typography fontWeight="bold" sx={{ mb: 1 }}>{item.productName}</Typography>
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{formatMoney(item.price)}</Typography>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    disabled={checkStock(item)}
                                                    onClick={() => addProduct({ productId: item.productId, productName: item.productName, price: item.price, quantity: 1 })}
                                                    sx={{
                                                        borderRadius: "8px",
                                                        textTransform: "none",
                                                        fontSize: "1rem",
                                                        backgroundColor: checkStock(item) ? "#BDBDBD" : "#F06292",
                                                        "&:hover": { backgroundColor: checkStock(item) ? "#BDBDBD" : "#D81B60" }
                                                    }}
                                                >
                                                    Buy Now
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                )
            }


            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="h4" sx={{ mb: 3, color: '#D81B60', fontWeight: 'bold' }}>
                        📝 Product Review
                    </Typography>

                    {/* Displaying Previous Reviews */}
                    <Box sx={{ mt: 4 }}>
                        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {reviews?.length === 0 ? (
                                <Typography variant="body1" sx={{ color: '#333', textAlign: 'center' }}>No reviews yet</Typography>
                            ) : (
                                reviews?.map((review, i) => (
                                    <Box key={i} sx={{ border: '1px solid #D81B60', p: 2, borderRadius: '16px', width: '100%', mb: 3 }}>
                                        <Grid container spacing={1}>
                                            {/* User and Rating Section */}
                                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="h6" sx={{ color: '#D81B60', fontWeight: 'bold' }}>
                                                    {review.username}
                                                </Typography>

                                                <Rating
                                                    value={review.rating}
                                                    readOnly
                                                    precision={0.5}
                                                    size="large"
                                                    sx={{
                                                        '& .MuiRating-iconFilled': {
                                                            color: 'orange',
                                                        },
                                                        '& .MuiRating-iconEmpty': {
                                                            color: '#ccc',
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            {/* Review Date and Comment Section */}
                                            <Grid item xs={12}>
                                                <Typography variant="body2" sx={{ color: '#777', mb: 1 }}>
                                                    {new Date(review.reviewDate).toLocaleDateString()}
                                                </Typography>

                                                <Typography variant="body1" sx={{ color: '#333', mb: 2 }}>
                                                    {review.comment}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>






        </Container >
    );
};

export default ProductDetails;



