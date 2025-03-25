import { useEffect, useState } from "react";
import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Button,
    Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { formatDate, formatMoney } from "../../utils/format";

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

const ShipperReturns = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${portserver}/orders`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = res.data.filter((i: any) => i.status === "ready to refund");
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusChip = (status: string) => {
        let color: "warning" | "default" = "default";
        if (status.toLowerCase() === "ready to refund") {
            color = "warning";
        }
        return (
            <Chip
                label={status}
                color={color}
                sx={{
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.9rem",
                    color: "#fff",
                }}
            />
        );
    };

    const updateOrderStatus = async (orderId: number) => {
        try {
            await axios.put(`${portserver}/orders/refund/${orderId}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchOrders();
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };

    return (
        <Box sx={{ px: 4, py: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#1976D2", mb: 3 }}
            >
                🚚 Shipper Dashboard
            </Typography>

            <Box px={5}>
                {orders.map((order) => (
                    <Accordion
                        key={order.orderId}
                        sx={{
                            mb: 2,
                            borderRadius: "12px",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                            transition: "0.3s",
                            "&:hover": { transform: "scale(1.02)" },
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#1976D2" }} />}>
                            <Typography variant="h6" sx={{ color: "#0D47A1", fontWeight: "bold" }}>
                                Order #{order.orderId}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography component="div"><strong>Status:</strong> {getStatusChip(order.status)}</Typography>
                                    <Typography><strong>Reciever Name: </strong> {order.receiverName}</Typography>
                                    <Typography><strong>Phone Number:</strong> {order.phoneNumber}</Typography>
                                    <Typography><strong>Total:</strong> {formatMoney(order.amount)}</Typography>
                                    <Typography><strong>Shipping Address:</strong> {order.shippingAddress}</Typography>
                                    <Typography><strong>Date:</strong> {formatDate(order.timestamp)}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} sx={{ borderRadius: "12px", overflow: "hidden" }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: "#BBDEFB" }}>
                                                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Product</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Price</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Quantity</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {order.orderDetails.map((detail) => (
                                                    <TableRow key={detail.orderDetailId} sx={{ "&:hover": { backgroundColor: "#E3F2FD" } }}>
                                                        <TableCell sx={{ textAlign: "center" }}>{detail.productName}</TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>{formatMoney(detail.price)}</TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>{detail.quantity}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12} textAlign="end">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<LocalShippingIcon />}
                                        sx={{ px: 3, py: 1, fontSize: "1rem", fontWeight: "bold", mt: 2 }}
                                        onClick={() => updateOrderStatus(order.orderId)}
                                    >
                                        Mark as received
                                    </Button>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box >
    );
};

export default ShipperReturns;
