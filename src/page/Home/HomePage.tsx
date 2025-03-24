import { Card, CardMedia, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Stack, Typography } from "@mui/material";
import ImageCarousel from "../../components/ImageCarousel";

import OurProduct from "./OurProduct";
import media from '../../assets/set-of-flyers-with-woman-cosmetics-beauty-products-beauty-skin-care-cosmetics-shower-concept-illustration-for-banner-card-advertising-poster-vector.jpg'
import { useState } from "react";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { FaPhone } from "react-icons/fa";
import { PersonOutline, CheckCircleOutline, CancelOutlined } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import Voucher from "./Voucher";
import Post from "./Post";
import QuizPro from "./QuizPro";


function HomePage() {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;
    const skinTypeId = localStorage.getItem('skinTypeId')

    const handleChatClick = () => {
        setConfirmOpen(true);
    };

    const handleConfirm = async () => {
        try {
            const res = await axios.post(`${portserver}/ggmeet/meet/${decode?.userId}`);
            if (res.data) {
                const url = `https://${res.data.meetLink.link}`;
                window.open(url, "_blank");
            } else {
                console.error("No meeting link received");
            }
        } catch (error) {
            console.error("Failed to get meeting link:", error);
        }

        setConfirmOpen(false);
        setOpen(true);
    };

    return (
        <div>
            <ImageCarousel />

            <Voucher />

            {!skinTypeId ?
                <Box sx={{ px: 7, my: 5 }}>
                    <Card>
                        <CardMedia component="img" height="500" image={media} alt="Ưu đãi skincare" />
                    </Card>
                </Box>
                :
                <QuizPro />
            }

            <Post />

            <OurProduct />

            <Button
                variant="contained"
                color="success"
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    minWidth: 56,
                    zIndex: 1000,
                    transition: "transform 0.2s ease, background-color 0.2s ease",
                    "&:hover": {
                        transform: "scale(1.1)",
                        backgroundColor: "#2e7d32",
                    },
                }}
                onClick={handleChatClick}
            >
                <FaPhone />
            </Button>


            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: 3,
                        padding: 2,
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <PersonOutline sx={{ color: "#1976D2" }} />
                        <Typography variant="h6" fontWeight="bold">Create a Meeting Online</Typography>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ fontSize: 16, color: "#333", textAlign: "center" }}>
                        Would you like to request a meeting with an expert for discussion?
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        color="error"
                        variant="outlined"
                        startIcon={<CancelOutlined />}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            "&:hover": { backgroundColor: "#ffebee" }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        color="primary"
                        variant="contained"
                        startIcon={<CheckCircleOutline />}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            "&:hover": { backgroundColor: "#1565C0" }
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default HomePage