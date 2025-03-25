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
    TextField,
    Rating
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { jwtDecode } from "jwt-decode";
import { Box } from "@mui/system";
import { formatDate, formatMoney } from "../../utils/format";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Interfaces
interface OrderDetail {
    orderDetailId: number;
    price: number;
    quantity: number;
    productName: string;
    productId: number
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

const Delivered = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [openReturnDialog, setOpenReturnDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [returnItems, setReturnItems] = useState<{ product_id: number; quantity: number; price: number }[]>([]);
    const [returnReason, setReturnReason] = useState<string>("");
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const [pro, setPro] = useState<number>()
    const [ord, setord] = useState<number>()

    const token = localStorage.getItem("token");
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;
    const [popReview, setPopReview] = useState(false)

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

    const handleSubmitReturn = () => {
        if (!selectedOrder || !decode?.userId || returnItems.length === 0) {
            alert("Please select at least one item to return.");
            return;
        }

        const requestBody = {
            user_id: Number(decode.userId),
            total_amount: calculateTotalReturnAmount(),
            orderItems: returnItems.filter((item) => item.quantity > 0),
            shippingAddress: selectedOrder.shippingAddress,
            reason: returnReason,
            order_id: selectedOrder.orderId,
            receiverName: selectedOrder.receiverName,
            phoneNumber: selectedOrder.phoneNumber
        };

        console.log(requestBody)

        axios.post(`${portserver}/orders/return`, requestBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                toast.success("Return request submitted successfully!");
                setOpenReturnDialog(false);
            })
            .catch((e) => {
                toast.error(e.response?.data?.message);
            });
    };


    const handleReview = (productId: number, orderId: number) => {
        setPro(productId)
        setord(orderId)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const reviewData = { productId: pro, userId: Number(decode?.userId), orderId: ord, rating, comment };
        axios.post(`${portserver}/reviews/reviewByProductId`,
            reviewData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((res) => {
                toast.success(res.data.message)
                setRating(0)
                setComment('')
                setPopReview(false)
            })
            .catch((e) => {
                console.log(e)
                toast.error(e.response.data.message)
                setRating(0)
                setComment('')
                setPopReview(false)
            })

    };

    return (
        <Box sx={{ px: 3 }}>

            <ToastContainer />

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
                                    <Typography component='div'><strong>Status:</strong> {getStatusChip(order.status)}</Typography>
                                    <Typography><strong>Reciever Name:</strong> {order.receiverName}</Typography>
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
                                                    <TableCell sx={{ textAlign: "center" }}><strong>Action</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {order.orderDetails.map((detail) => (
                                                    <TableRow key={detail.orderDetailId}>
                                                        <TableCell sx={{ textAlign: "center" }}>{detail.productName}</TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>{formatMoney(detail.price)}</TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>{detail.quantity}</TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            <Button variant="contained" onClick={() => { handleReview(detail.productId, order.orderId), setPopReview(true) }}>
                                                                Review
                                                            </Button>
                                                        </TableCell>
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

            <Dialog open={popReview} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: 'center', color: '#D81B60', fontWeight: 'bold' }}>📝 Leave a Review</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#333', mb: 1 }}>Rating</Typography>
                        <Rating
                            value={rating}
                            onChange={(_, newValue: any) => setRating(newValue)}
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
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Comment"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                </DialogContent>

                {/* Action Buttons */}
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        sx={{ bgcolor: '#D81B60', color: 'white' }}
                    >
                        Submit Review
                    </Button>
                    <Button onClick={() => { setPopReview(false), setRating(0), setComment('') }} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

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