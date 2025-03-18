import { Typography, Button, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Dialog, DialogActions, DialogTitle, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { MdDeleteOutline } from "react-icons/md";
import { formatMoney } from "../../utils/format";

const CartPage = () => {
    const { cart, updateQuantity, removeProduct } = useCart();
    const totalAmount: number = cart.reduce((total, item) => total + item.quantity * item.price, 0);
    const [receiver, setReceiver] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [shippingAddress, setShippingAddress] = useState<string>('');
    const [openDialog, setOpenDialog] = useState(false);
    const [productToRemove, setProductToRemove] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleRemoveClick = (productId: number) => {
        setProductToRemove(productId);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setProductToRemove(null);
    };

    const handleConfirmRemove = () => {
        if (productToRemove !== null) {
            removeProduct(productToRemove);
        }
        handleDialogClose();
    };

    const payment = async (orderId: number) => {
        try {
            const res = await axios.post(`${portserver}/payment/create/${orderId}`);
            if (res.data.order_url) {
                window.location.href = res.data.order_url;
            } else {
                toast.error("Payment initiation failed.");
            }
        } catch (e) {
            console.error("Payment error:", e);
            toast.error("Payment request failed.");
        }
    };

    const handleConfirmCheckout = async () => {
        if (shippingAddress === '' || phone === '' || receiver === '') {
            toast.error("Please enter all fields");
            return;
        }

        const orderItems = cart.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        try {
            const res = await axios.post(`${portserver}/orders/checkout`, {
                user_id: decode?.userId,
                total_amount: totalAmount,
                orderItems,
                receiver,
                phone,
                shippingAddress
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            payment(res.data.orderId);
            localStorage.setItem('cart', JSON.stringify([]));
            setShippingAddress('');
        } catch (e) {
            console.error("Checkout error:", e);
            toast.error("Checkout failed. Please try again.");
        }
    };

    return (
        <Box px={3} >
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="confirm-remove-dialog-title"
            >
                <DialogTitle id="confirm-remove-dialog-title">
                    {"Are you sure you want to remove this item?"}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmRemove} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                Cart
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "2px solid #F8BBD0" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.length === 0 ?
                                    (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography color="textSecondary" variant="h6">
                                                    No product in cart yet
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    :
                                    (
                                        cart.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.productName}</TableCell>
                                                <TableCell>{formatMoney(item.price)}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        type="number"
                                                        value={item.quantity}
                                                        size="small"
                                                        inputProps={{ min: 1 }}
                                                        sx={{ width: "60px", borderRadius: "8px" }}
                                                        onChange={(e) => {
                                                            const newQuantity = parseInt(e.target.value);
                                                            if (newQuantity > 0) {
                                                                updateQuantity(item.productId, newQuantity);
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{formatMoney(item.price * item.quantity)}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            color: "#F06292",
                                                            backgroundColor: "#FCE4EC",
                                                            borderRadius: "8px",
                                                            "&:hover": {
                                                                color: "white",
                                                                backgroundColor: "#D81B60"
                                                            }
                                                        }}
                                                        onClick={() => handleRemoveClick(item.productId)}
                                                    >
                                                        <MdDeleteOutline size={20} />
                                                    </Button>
                                                </TableCell>

                                            </TableRow>
                                        ))
                                    )
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: "16px", border: "2px solid #F8BBD0" }}>
                        <Typography variant="h6" gutterBottom sx={{ color: "#D81B60" }}>
                            Receiver
                        </Typography>
                        <TextField
                            fullWidth
                            label="Enter receiver"
                            variant="outlined"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom sx={{ color: "#D81B60" }}>
                            Phone number
                        </Typography>
                        <TextField
                            fullWidth
                            label="Enter phone number"
                            variant="outlined"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="h6" gutterBottom sx={{ color: "#D81B60" }}>
                            Shipping Address
                        </Typography>
                        <TextField
                            fullWidth
                            label="Enter your address"
                            variant="outlined"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Total Amount: {formatMoney(totalAmount)}
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: "#F06292", "&:hover": { backgroundColor: "#D81B60" } }}
                            onClick={handleConfirmCheckout}
                            disabled={cart.length !== 0 ? false : true}
                        >
                            Proceed To Checkout
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CartPage;
