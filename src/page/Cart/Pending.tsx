import { useEffect, useState } from "react";
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { jwtDecode } from "jwt-decode";
import { Box } from "@mui/system";
import { formatDate, formatMoney } from "../../utils/format";
import { FaMoneyBillWave, FaQrcode } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

interface OrderDetail {
    orderDetailId: number;
    price: number;
    quantity: number;
    productName: string
}

interface Order {
    orderId: number;
    status: string;
    amount: number;
    shippingAddress: string;
    timestamp: string;
    orderDetails: OrderDetail[];
    receiverName: string,
    phoneNumber: number
}

function Pending() {
    const [orders, setOrders] = useState<Order[]>([]);
    const token = localStorage.getItem('token');
    const [selectedOrderId, setSeclectedOrderId] = useState<number>()
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${portserver}/orders`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = res.data.filter((i: any) => i.status === 'pending')
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);


    const getStatusChip = (status: string) => {
        let color: "secondary" | "default";

        switch (status.toLowerCase()) {
            case "pending":
                color = "secondary";
                break;
            default:
                color = "default";
        }

        return <Chip label={status} color={color} sx={{ fontWeight: "bold", textTransform: "capitalize" }} />;
    };

    const handlePayment = (orderId: number) => {
        setSeclectedOrderId(orderId)
        setOpenPaymentDialog(true)
    }

    const handlePaymentSelection = async (method: string) => {
        if (method === "cod") {
            return toast.error("Only accept payment by zaloPay");
        }

        setOpenPaymentDialog(false);

        try {
            const res = await axios.post(`${portserver}/payment/create/${selectedOrderId}`);
            console.log(res.data)
            if (res.data.order_url) {
                window.open(res.data.order_url, "_blank");
            } else {
                toast.error("Payment initiation failed.");
            }
        } catch (e) {
            console.error("Payment error:", e);
            toast.error("Payment request failed.");
        }
    };


    console.log(selectedOrderId)


    return (
        <Box sx={{ px: 3 }}>
            <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#D81B60" }}>
                    Chọn phương thức thanh toán
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ textAlign: "center", mb: 2 }}>
                        Hãy chọn phương thức thanh toán phù hợp cho đơn hàng của bạn.
                    </DialogContentText>

                    <Box display="flex" flexDirection="column" gap={2}>
                        <Button
                            onClick={() => handlePaymentSelection("zalopay")}
                            sx={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                                backgroundColor: "#F8BBD0", color: "#D81B60",
                                "&:hover": { backgroundColor: "#D81B60", color: "white" }
                            }}
                        >
                            <FaQrcode size={20} /> Thanh toán bằng ZaloPay
                        </Button>
                        <Button
                            onClick={() => handlePaymentSelection("cod")}
                            sx={{
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                                backgroundColor: "#FCE4EC", color: "#D81B60",
                                "&:hover": { backgroundColor: "#D81B60", color: "white" }
                            }}
                        >
                            <FaMoneyBillWave size={20} /> Thanh toán khi nhận hàng (COD)
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <ToastContainer />

            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>🕒 Pending</Typography>
            <Box sx={{ px: 5 }}>
                {
                    orders.map((order) => (
                        <Accordion key={order.orderId} sx={{ mb: 2, border: "2px solid #F8BBD0" }} >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Order #{order.orderId}</Typography>
                            </AccordionSummary>
                            <AccordionDetails >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography component='div'><strong>Status:</strong>  {getStatusChip(order.status)}</Typography>
                                        <Typography><strong>Reciever Name: </strong> {order.receiverName}</Typography>
                                        <Typography><strong>Phone Number:</strong> {order.phoneNumber}</Typography>
                                        <Typography><strong>Total:</strong> {formatMoney(order.amount)}</Typography>
                                        <Typography><strong>Shipping Address:</strong> {order.shippingAddress}</Typography>
                                        <Typography><strong>Date:</strong> {formatDate(order.timestamp)}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "2px solid #F8BBD0" }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ textAlign: "center" }}><strong>Product</strong></TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}><strong>Price</strong></TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}><strong>Quantity</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {order.orderDetails.map((detail) => (
                                                        <TableRow key={detail.orderDetailId}>
                                                            <TableCell sx={{ textAlign: "center" }}>{detail.productName}</TableCell>
                                                            <TableCell sx={{ textAlign: "center" }}>{formatMoney(detail.price)}</TableCell>
                                                            <TableCell sx={{ textAlign: "center" }}>{detail.quantity}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button variant="outlined" onClick={() => handlePayment(order.orderId)}>
                                                Payment
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))
                }
            </Box>
        </Box>
    );
}

export default Pending