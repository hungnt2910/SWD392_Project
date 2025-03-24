import { Typography, Button, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Dialog, DialogActions, DialogTitle, Skeleton, DialogContent, DialogContentText, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { MdDeleteOutline } from "react-icons/md";
import { formatDate, formatMoney } from "../../utils/format";
import { CalendarToday, LocalOffer, Redeem, Spa } from "@mui/icons-material";

type VoucherUser = {
    used: boolean,
    voucher: {
        voucherId: number
        code: string,
        discount: number
        expirationDate: string;
    }
}

const CartPage = () => {
    const { cart, updateQuantity, removeProduct, setCart } = useCart();
    const [receiver, setReceiver] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [shippingAddress, setShippingAddress] = useState<string>('');
    const [openDialog, setOpenDialog] = useState(false);
    const [productToRemove, setProductToRemove] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

    const [voucherUser, setVouchersUser] = useState<VoucherUser[]>([])
    const totalAmountReal: number = cart.reduce((total, item) => total + item.quantity * item.price, 0);
    const [selectVoucher, setSelectVoucher] = useState<VoucherUser | null>(null)
    const [totalAmount, setTotalAmount] = useState<number>(totalAmountReal)

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

    const handleConfirmCheckout = async () => {
        if (shippingAddress === '' || phone === '' || receiver === '') {
            toast.error("Please enter all fields");
            return;
        }
        handlePaymentSelection()
    };

    const handlePaymentSelection = async () => {
        const orderItems = cart.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        try {
            await axios.post(`${portserver}/orders/checkout`, {
                user_id: decode?.userId,
                total_amount: selectVoucher ? totalAmount : totalAmountReal,
                orderItems,
                receiverName: receiver,
                phoneNumber: phone,
                shippingAddress
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (selectVoucher) {
                await axios.post(`${portserver}/voucher/apply`, {
                    userId: decode?.userId,
                    voucherCode: selectVoucher?.voucher.code
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
            }

            toast.success('Your order is ready to pay');
            localStorage.setItem('cart', JSON.stringify([]));
            setCart([]);
            setPhone('');
            setReceiver('');
            setShippingAddress('');
        } catch (e) {
            console.error("Checkout error:", e);
            toast.error("Checkout failed. Please try again.");
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

    const handleFakeUseVoucher = (voucher: VoucherUser) => {
        setTotalAmount(totalAmount * (1 - voucher.voucher.discount / 100))
        setSelectVoucher(voucher)
        setOpenPaymentDialog(false)
    }

    useEffect(() => { getVoucherByUser() }, [])

    return (
        <Box px={3} >
            <Dialog open={openPaymentDialog} onClose={() => { setOpenPaymentDialog(false), setSelectVoucher(null), setTotalAmount(totalAmountReal) }} fullWidth maxWidth="sm">
                <DialogContent>
                    <Typography variant="h6" sx={{ color: "#C2185B", textAlign: "center", fontWeight: "bold", mb: 2 }}>
                        🎁 Chọn voucher giảm giá
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {voucherUser.length > 0 ? (
                            voucherUser.filter(v => v.used === false).map((v) => (
                                <Box key={v.voucher.voucherId} sx={{ p: 2, border: "2px dashed #D81B60", borderRadius: "12px", backgroundColor: "#FFF0F5" }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", color: "#C2185B" }}>
                                        <LocalOffer sx={{ mr: 1 }} /> Code: {v.voucher.code}
                                    </Typography>
                                    <Typography variant="body1" sx={{ display: "flex", alignItems: "center" }}>
                                        <Spa sx={{ mr: 1, color: "#FF69B4" }} /> Discount: {v.voucher.discount}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                                        <CalendarToday sx={{ mr: 1, color: "#FFA500" }} /> Expiry: {formatDate(v.voucher.expirationDate)}
                                    </Typography>
                                    <Box mt={2} display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#D81B60",
                                                color: "white", borderRadius: "20px",
                                                "&:hover": "#C2185B"
                                            }}
                                            startIcon={<Redeem />}
                                            onClick={() => handleFakeUseVoucher(v)}
                                        >
                                            Use
                                        </Button>
                                    </Box>
                                </Box>
                            ))
                        ) : (
                            <Typography textAlign="center" color="text.secondary">
                                Hiện tại không có voucher nào khả dụng.
                            </Typography>
                        )}


                        <Divider sx={{ my: 3 }} />


                        <Box sx={{ my: 1 }}>
                            <Typography>Tổng tiền cần thanh toán: {formatMoney(totalAmount)}</Typography>
                        </Box>

                        <Box display="flex" flexDirection="row" justifyContent='center' gap={10}>
                            <Button
                                onClick={() => { setOpenPaymentDialog(false), setSelectVoucher(null), setTotalAmount(totalAmountReal) }}
                                sx={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                                    backgroundColor: "#F8BBD0", color: "#D81B60",
                                    "&:hover": { backgroundColor: "#D81B60", color: "white" }
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="confirm-remove-dialog-title"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        padding: 2,
                        minWidth: 350,
                        textAlign: "center"
                    }
                }}
            >
                <DialogTitle id="confirm-remove-dialog-title" sx={{ fontWeight: "bold" }}>
                    <Typography variant="h6">
                        Are you sure you want to remove this item?
                    </Typography>
                </DialogTitle>

                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <Button onClick={handleDialogClose} sx={{ color: "black", backgroundColor: "#ccc", "&:hover": { backgroundColor: "#bbb" } }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmRemove} sx={{ backgroundColor: "#D81B60", color: "white", fontWeight: "bold", "&:hover": { backgroundColor: "#B0003A" } }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />

            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                🛒 Cart
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
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    setPhone(value);
                                }
                            }}
                            sx={{ mb: 2 }}
                            inputProps={{ maxLength: 10 }}
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

                        <Box sx={{
                            my: 1
                        }}>
                            < Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#D81B60",
                                    color: "white",
                                    borderRadius: "20px",
                                    fontWeight: "bold",
                                    px: 3,
                                    py: 1,
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                    transition: "0.3s",
                                    "&:hover": {
                                        backgroundColor: "#C2185B",
                                        transform: "scale(1.05)"
                                    }
                                }}

                                onClick={() => { setOpenPaymentDialog(true), setTotalAmount(totalAmountReal) }}
                            >
                                Apply Voucher
                            </Button>
                        </Box>


                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Total Amount: {selectVoucher ? formatMoney(totalAmount) : formatMoney(totalAmountReal)}
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
            </Grid >
        </Box >
    );
};

export default CartPage;
