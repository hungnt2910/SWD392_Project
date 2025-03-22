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
    DialogActions,
    DialogTitle,
    DialogContent,
    TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { jwtDecode } from "jwt-decode";
import { Box } from "@mui/system";
import { formatDate, formatMoney } from "../../utils/format";
import { useNavigate } from "react-router-dom";

// Interfaces
interface OrderDetail {
    orderDetailId: number;
    price: number;
    quantity: number;
    productName: string;
}

interface Order {
    orderId: number;
    status: string;
    amount: number;
    shippingAddress: string;
    timestamp: string;
    orderDetails: OrderDetail[];
}

const Delivered = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [returnItems, setReturnItems] = useState<{ product_id: number; quantity: number; price: number }[]>([]);
    const [returnReason, setReturnReason] = useState<string>("");

    const token = localStorage.getItem("token");
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;
    const nav = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${portserver}/orders/getDeliveredOrderByUser/${decode?.userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        };
        fetchOrders();
    }, []);

    const getStatusChip = (status: string) => {
        return (
            <Chip
                label={status}
                color={status.toLowerCase() === "delivered" ? "success" : "default"}
                sx={{ fontWeight: "bold", textTransform: "capitalize" }}
            />
        );
    };

    const handleRequestReturn = (order: Order) => {
        setSelectedOrder(order);
        setReturnItems([]);
        setReturnReason("");
        setOpenReturnDialog(true);
    };

    const handleReturnQuantityChange = (orderDetail: OrderDetail, quantity: number) => {
        quantity = Math.max(0, Math.min(quantity, orderDetail.quantity));

        setReturnItems((prev) => {
            const existingItem = prev.find((item) => item.product_id === orderDetail.orderDetailId);
            if (existingItem) {
                return prev.map((item) =>
                    item.product_id === orderDetail.orderDetailId ? { ...item, quantity } : item
                );
            } else {
                return [...prev, { product_id: orderDetail.orderDetailId, quantity, price: orderDetail.price }];
            }
        });
    };

    const calculateTotalReturnAmount = () => {
        return returnItems.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const handleSubmitReturn = async () => {
        if (!selectedOrder || !decode?.userId || returnItems.length === 0) {
            alert("Please select at least one item to return.");
            return;
        }

        const requestBody = {
            user_id: decode.userId,
            total_amount: calculateTotalReturnAmount(),
            orderItems: returnItems.filter((item) => item.quantity > 0),
            shippingAddress: selectedOrder.shippingAddress,
            reason: returnReason,
            orderId: selectedOrder.orderId
        };

        try {
            await axios.post(`${portserver}/orders/return`, requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Return request submitted successfully!");
            setOpenReturnDialog(false);
        } catch (error) {
            console.error("Return request failed", error);
            alert("Failed to submit return request.");
        }
    };

    return (
        <Box sx={{ px: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                🚚  Delivery
            </Typography>
            <Box sx={{ px: 5 }}>
                {orders.map((order) => (
                    <Accordion key={order.orderId} sx={{ mb: 2, border: "2px solid #F8BBD0" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6">Order #{order.orderId}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography><strong>Status:</strong> {getStatusChip(order.status)}</Typography>
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
                                        <Button variant="outlined" onClick={() => handleRequestReturn(order)}>
                                            Request Return
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>

            {/* Dialog hoàn trả */}
            <Dialog open={openReturnDialog} onClose={() => setOpenReturnDialog(false)} fullWidth >
                <DialogTitle>Request Return</DialogTitle>
                <DialogContent>
                    {selectedOrder?.orderDetails.map((item) => {
                        const currentQuantity = returnItems.find(i => i.product_id === item.orderDetailId)?.quantity || 0;
                        return (
                            <Box key={item.orderDetailId} display="flex" alignItems="center" gap={2} my={1}>
                                <Typography flex={1}>{item.productName}</Typography>
                                <TextField
                                    type="number"
                                    label="Quantity"
                                    size="small"
                                    sx={{ width: "80px" }}
                                    value={currentQuantity || ""}
                                    onChange={(e) => {
                                        const newQuantity = parseInt(e.target.value) || 0;
                                        handleReturnQuantityChange(item, Math.max(0, Math.min(newQuantity, item.quantity)));
                                    }}
                                />
                            </Box>
                        );
                    })}
                    <TextField
                        fullWidth
                        label="Return Reason"
                        multiline
                        rows={3}
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    {calculateTotalReturnAmount() > 0 && (
                        <Typography sx={{ mt: 2 }}>
                            <strong>Total Refund:</strong> {formatMoney(calculateTotalReturnAmount())}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReturnDialog(false)}>Cancel</Button>
                    <Button
                        color="error"
                        onClick={() => {
                            handleSubmitReturn();
                            setOpenReturnDialog(false);
                        }}
                        disabled={returnItems.length === 0 || returnReason === '' || calculateTotalReturnAmount() === 0}
                    >
                        Confirm Return
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default Delivered;