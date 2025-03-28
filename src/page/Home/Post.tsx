import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CircularProgress, Typography, Box, Card, CardMedia, CardContent, IconButton, Avatar, Button } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, CalendarToday, Person } from "@mui/icons-material";
import { portserver } from "../../utils/portserver";

interface BlogPost {
    postId: number;
    title: string;
    description: string;
    imageUrl: string;
    postDate: string;
    user: {
        username: string;
        email: string;
    };
    product: {
        productName: string;
        urlImage: string;
        price: number;
    };
}

const Post: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogPost[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const sliderRef = React.useRef<Slider | null>(null);

    useEffect(() => {
        axios.get(`${portserver}/blogs`)
            .then((res) => {
                setBlogs(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const handleDetailPost = (blogId: number) => {
        axios.get(`${portserver}/blogs/${blogId}`)
            .then(() => {
                window.open(`/post/${blogId}`, "_blank");
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <Box sx={{ px: 7, mb: 10 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "#d81b60" }}>Trending Beauty Posts</Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={10}>
                    <CircularProgress color="secondary" />
                </Box>
            ) : blogs && blogs.length > 0 ? (
                <Box sx={{ position: "relative", maxWidth: '100%' }}>
                    <IconButton
                        onClick={() => sliderRef.current?.slickPrev()}
                        sx={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                            background: "#fff",
                            boxShadow: 3,
                        }}
                    >
                        <ArrowBackIos sx={{ color: "#d81b60" }} />
                    </IconButton>
                    <Slider ref={sliderRef} {...settings}>
                        {blogs.map((b) => (
                            <Box key={b.postId} sx={{ px: 2 }}>
                                <Card
                                    sx={{
                                        mx: 0.5,
                                        p: 2,
                                        boxShadow: 3,
                                        borderRadius: 3,
                                        backgroundColor: "#fff5f8",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="220"
                                        image={b.imageUrl}
                                        alt={b.title}
                                        sx={{ width: "100%", borderRadius: "16px 16px 0 0" }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginTop: '0.5rem' }}>
                                            <Button
                                                sx={{
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                    color: "#d81b60",
                                                    fontSize: "1rem",
                                                    p: 0,
                                                    "&:hover": { backgroundColor: "transparent" }
                                                }}
                                                onClick={() => { handleDetailPost(b.postId) }}
                                            >
                                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#d81b60", mb: 2 }}>
                                                    {b.title.replace(/<[^>]*>/g, "")}
                                                </Typography>
                                            </Button>

                                            <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1, color: "#666" }}>
                                                <Avatar sx={{ width: 24, height: 24, bgcolor: "#d81b60", color: "white" }}>
                                                    {b.user.username.charAt(0)}
                                                </Avatar>
                                                <Typography variant="body2">{b.user.username}</Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1} sx={{ mt: 1, color: "#666" }}>
                                                <CalendarToday fontSize="small" />
                                                <Typography variant="body2">{new Date(b.postDate).toLocaleDateString()}</Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Slider>
                    <IconButton
                        onClick={() => sliderRef.current?.slickNext()}
                        sx={{
                            position: "absolute",
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                            background: "#fff",
                            boxShadow: 3,
                        }}
                    >
                        <ArrowForwardIos sx={{ color: "#d81b60" }} />
                    </IconButton>
                </Box>

            ) : (
                <Typography variant="h6" sx={{ color: "#d81b60" }}>No posts available.</Typography>
            )}
        </Box>
    );
};

export default Post;
