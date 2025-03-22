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
    Button,
    Chip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { jwtDecode } from "jwt-decode";
import { Box } from "@mui/system";
import { formatDate, formatMoney } from "../../utils/format";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeliveryDining } from "react-icons/md";

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
}

const InProgess = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;
    const nav = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${portserver}/orders/getConfirmedOrderByUser/${decode?.userId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        }
        fetchOrders();
    }, []);

    const getStatusChip = (status: string) => {
        let color: "primary" | "default";

        switch (status.toLowerCase()) {
            case "confirmed":
                color = "primary";
                break;
            default:
                color = "default";
        }

        return <Chip label={status} color={color} sx={{ fontWeight: "bold", textTransform: "capitalize" }} />;
    };

    return (
        <Box sx={{ px: 3 }}>

            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}> ⏳ In Progess</Typography>
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
                                        <Typography><strong>Total:</strong> {formatMoney(order.amount)}</Typography>
                                        <Typography><strong>Shipping Address:</strong> {order.shippingAddress}</Typography>
                                        <Typography><strong>Date:</strong> {formatDate(order.timestamp)}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography style={{ color: "orange" }}><strong>Note:</strong> Your order is being delivered to you. </Typography>&nbsp;
                                            <MdOutlineDeliveryDining size={25} color="orange" />
                                        </Box>
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
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))
                }
            </Box>
        </Box>
    );
};

export default InProgess;
