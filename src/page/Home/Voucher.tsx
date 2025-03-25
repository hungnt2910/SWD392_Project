import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Box, Skeleton, IconButton, Button } from "@mui/material";
import { LocalOffer, Spa, CalendarToday, Redeem } from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid"
import { jwtDecode } from "jwt-decode";

interface Voucher {
    voucherId: number;
    code: string;
    discount: number;
    expirationDate: string;
}

type VoucherUser = {
    voucher: {
        voucherId: number
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

type ArrowProps = {
    onClick?: () => void;
};

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <IconButton
        sx={{
            position: "absolute",
            left: "-40px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#FFB6C1",
            color: "white",
            "&:hover": { backgroundColor: "#FF69B4" },
        }}
        onClick={onClick}
    >
        <ArrowBackIos />
    </IconButton>
);

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <IconButton
        sx={{
            position: "absolute",
            right: "-40px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            backgroundColor: "#FFB6C1",
            color: "white",
            "&:hover": { backgroundColor: "#FF69B4" },
        }}
        onClick={onClick}
    >
        <ArrowForwardIos />
    </IconButton>
);

const Voucher: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;
    const [voucherUser, setVouchersUser] = useState<VoucherUser[]>([])

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } }
        ]
    };

    const load = () => {
        setTimeout(() => setIsLoading(false), 1000);
    }

    useEffect(() => {
        load()
    }, [isLoading])

    const fetchVouchers = async () => {
        try {
            const res = await axios.get(`${portserver}/voucher/get-all`);
            setVouchers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const checkClaim = (voucherId: number) => {
        const check = voucherUser.some((i) => i.voucher.voucherId === voucherId);
        return check;
    };

    const claimVoucher = async (voucherId: number) => {
        try {
            const res = await axios.post(`${portserver}/voucher/claim`, { userId: decode?.userId, voucherId }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (res.data?.success === true) {
                toast.success(res.data.message)
                await fetchVouchers();
                await getVoucherByUser();
            }

        } catch (err) {
            console.error(err);
            toast.error("Voucher này đã được lấy")
        }
    };

    const getVoucherByUser = async () => {
        try {
            const res = await axios.get(`${portserver}/voucher/getVoucherByUser/${decode?.userId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            setVouchersUser(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (decode?.userId) {
            getVoucherByUser();
        }
        fetchVouchers();
    }, [decode?.userId]);

    return (
        <Box sx={{ px: 9, py: 5 }}>
            <ToastContainer />
            <Box sx={{ background: "linear-gradient(to bottom, #FFEBEE, #FFCDD2)", borderRadius: "16px", p: 3 }}>
                <Typography variant="h4" sx={{ mb: 3, color: "#D81B60", fontWeight: "bold" }}>
                    🎁 Special Beauty Vouchers 🎀
                </Typography>
                {isLoading ? (
                    <Grid container spacing={2}>
                        {
                            Array.from(new Array(4)).map((_, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Card sx={{ borderRadius: "16px", backgroundColor: "white", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", maxWidth: 300 }}>
                                        <Skeleton variant="rectangular" width="100%" height={140} />
                                        <CardContent>
                                            <Skeleton variant="text" width="80%" height={30} />
                                            <Skeleton variant="text" width="60%" height={25} />
                                            <Skeleton variant="rectangular" width="100%" height={40} sx={{ mt: 2 }} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                ) : (
                    <Slider {...settings}>
                        {vouchers.map((voucher) => (
                            <Box key={voucher.voucherId} px={1} sx={{ alignItems: 'center', justifyContent: 'center', }}>
                                <Card sx={{ maxWidth: 300, alignItems: 'center', justifyContent: 'center', borderRadius: "16px", boxShadow: 3, backgroundColor: "#FFD1DC" }}>
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", color: "#C2185B" }}>
                                            <LocalOffer sx={{ mr: 1 }} /> Code: {voucher.code}
                                        </Typography>
                                        <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                            <Spa sx={{ mr: 1, color: "#FF69B4" }} /> Discount: {voucher.discount}%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                            <CalendarToday sx={{ mr: 1, color: "#FFA500" }} /> Expiry: {formatDate(voucher.expirationDate)}
                                        </Typography>
                                        <Box mt={2} display="flex" justifyContent="center">
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: checkClaim(voucher.voucherId) ? "#E0E0E0" : "#D81B60",
                                                    color: "white",
                                                    borderRadius: "20px",
                                                    "&:hover": { backgroundColor: checkClaim(voucher.voucherId) ? "#E0E0E0" : "#C2185B" },
                                                }}
                                                startIcon={<Redeem />}
                                                onClick={() => claimVoucher(voucher.voucherId)}
                                                disabled={checkClaim(voucher.voucherId)}
                                            >
                                                {checkClaim(voucher.voucherId) ? "Claimed" : "Claim Now"}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Slider>
                )}
            </Box>
        </Box>
    );
};

export default Voucher;
