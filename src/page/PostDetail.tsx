import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, CircularProgress, Card, CardMedia, CardContent, Avatar, Button } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
import { portserver } from "../utils/portserver";
import { useCart } from "../hooks/useCart";
import { formatMoney } from "../utils/format";

const PostDetail: React.FC = () => {
    const { postId } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { addProduct } = useCart();

    useEffect(() => {
        if (postId) {
            axios
                .get(`${portserver}/blogs/${postId}`)
                .then((response) => {
                    setPost(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching post data:", error);
                    setLoading(false);
                });
        }
    }, [postId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    const getRandomTitle = (): string => {
        const titles = [
            "Hot Topics in Skincare",
            "Featured Beauty Post",
            "Beauty Trends You Can't Miss",
            "Top Skincare Tips",
            "Glow-Up Secrets Revealed"
        ];

        const randomIndex = Math.floor(Math.random() * titles.length);
        return titles[randomIndex];
    };


    return (
        <Box sx={{ p: 10, margin: "auto", }}>

            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#d81b60", mb: 3 }}>
                {getRandomTitle()}
            </Typography>


            {post ? (
                <>
                    <Card sx={{ boxShadow: 3, borderRadius: 2, overflow: "hidden" }}>
                        <CardMedia
                            component="img"
                            height="500"
                            image={post.imageUrl}
                            alt={post.title}
                            sx={{
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                        <CardContent sx={{ padding: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#d81b60", mb: 2 }}>
                                {post.title.replace(/<[^>]*>/g, "")}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", mb: 2, color: "#777" }}>
                                <Avatar sx={{ width: 30, height: 30, bgcolor: "#d81b60", mr: 1 }}>
                                    {post.user.username.charAt(0)}
                                </Avatar>
                                <Typography variant="body2">{post.user.username}</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                                    <CalendarToday fontSize="small" />
                                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                                        {new Date(post.postDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    mt: 3,
                                    fontSize: "1rem",
                                    lineHeight: "1.8",
                                    color: "#333",
                                    "& p": {
                                        marginBottom: "1rem",
                                    },
                                }}
                                dangerouslySetInnerHTML={{ __html: post.description }}
                            />
                        </CardContent>
                    </Card>

                    <Box sx={{ mt: 5 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#d81b60", mb: 2 }}>
                            Product Featured in this Post:
                        </Typography>
                        <Card sx={{ display: "flex", alignItems: "center", boxShadow: 3, borderRadius: 2 }}>
                            <CardMedia
                                component="img"
                                image={post.product.urlImage}
                                alt={post.product.productName}
                                sx={{ width: 150, height: 150, objectFit: "cover", borderRadius: 2 }}
                            />
                            <CardContent sx={{ flex: 1, padding: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {post.product.productName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#555", mt: 1 }}>
                                    {post.product.description}
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: "bold", mt: 2 }}>
                                    Price: {formatMoney(post.product.price)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mt: 2,
                                        backgroundColor: "#d81b60",
                                        "&:hover": {
                                            backgroundColor: "#c2185b",
                                        },
                                    }}
                                    onClick={() => addProduct(
                                        {
                                            productId: post.product.productId,
                                            productName: post.product.productName,
                                            price: post.product.price,
                                            quantity: 1
                                        }
                                    )}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </>
            ) : (
                <Typography variant="h6" color="error">
                    Post not found!
                </Typography>
            )}
        </Box>
    );
};

export default PostDetail;
