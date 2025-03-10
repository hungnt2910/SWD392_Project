// import { Container, Typography, Button, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useCart } from "../hooks/useCart";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { portserver } from "../utils/portserver";
// import { ToastContainer, toast } from 'react-toastify';
// import { FaMapMarkedAlt } from "react-icons/fa";
// import { jwtDecode } from "jwt-decode";

// const CartPage = () => {
//     const { cart, updateQuantity, removeProduct } = useCart();
//     const nav = useNavigate();
//     const totalAmount: number = cart.reduce((total, item) => total + item.quantity * item.price, 0)
//     const [openAddressDialog, setOpenAddressDialog] = useState(false);
//     const [shippingAddress, setShippingAddress] = useState<String>('')

//     const [openDialog, setOpenDialog] = useState(false);
//     const [productToRemove, setProductToRemove] = useState<number | null>(null);

//     const token = localStorage.getItem('token');
//     const decode = token ? jwtDecode<{ userId: number }>(token) : null;

//     const handleRemoveClick = (productId: number) => {
//         setProductToRemove(productId);
//         setOpenDialog(true);
//     };

//     const handleDialogClose = () => {
//         setOpenDialog(false);
//         setProductToRemove(null);
//     };

//     const handleConfirmRemove = () => {
//         if (productToRemove !== null) {
//             removeProduct(productToRemove);
//         }
//         handleDialogClose();
//     };

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     }, []);


//     const handleToCheckOut = () => {
//         setOpenAddressDialog(true);
//     };

//     const payment = (orderId: number) => {
//         axios.post(`${portserver}/payment/create/${orderId}`)
//             .then((res) => {
//                 console.log(res)
//                 if (res.data.order_url) {
//                     console.log(res.data)
//                     // Redirect đến trang thanh toán ZaloPay
//                     window.location.href = res.data.order_url;
//                 } else {
//                     toast.error("Payment initiation failed.");
//                 }
//             })
//             .catch((e) => {
//                 console.error("Payment error:", e);
//                 toast.error("Payment request failed.");
//             });
//     }

//     const handleConfirmCheckout = () => {
//         if (shippingAddress === '') {
//             toast.error("Please enter your address")
//             return
//         }

//         const token = localStorage.getItem('token')

//         const orderItems = cart.map((item) => ({
//             product_id: item.productId,
//             quantity: item.quantity,
//             price: item.price
//         }))

//         axios.post(`${portserver}/orders/checkout`,
//             {
//                 user_id: decode?.userId,
//                 total_amount: totalAmount,
//                 orderItems: orderItems,
//                 shippingAddress: shippingAddress
//             }, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             }
//         })
//             .then((res) => {
//                 console.log(res.data)

//                 payment(res.data.orderId)

//                 // localStorage.setItem('cart', JSON.stringify([]))
//                 setOpenAddressDialog(false)
//                 setShippingAddress('')
//             })
//             .catch((e) => {
//                 console.log(e)
//             })
//     }

//     return (
//         <Container maxWidth="lg" sx={{ mt: 4 }}>
//             <ToastContainer />
//             <Typography variant="h4" gutterBottom>
//                 Cart
//             </Typography>
//             <TableContainer component={Paper} sx={{ borderRadius: "16px" }}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
//                             <TableCell sx={{ fontWeight: "bold" }}>Subtotal</TableCell>
//                             <TableCell></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {cart.map((item, index) => (
//                             <TableRow key={index}>
//                                 <TableCell>{item.productName}</TableCell>
//                                 <TableCell>{item.price} VND</TableCell>
//                                 <TableCell>
//                                     <TextField
//                                         type="number"
//                                         value={item.quantity}
//                                         size="small"
//                                         inputProps={{ min: 1 }}
//                                         sx={{
//                                             width: "60px",
//                                             borderRadius: "8px",
//                                             "& .MuiOutlinedInput-root": {
//                                                 "& fieldset": {
//                                                     borderRadius: "8px",
//                                                 }
//                                             }
//                                         }}
//                                         onChange={(e) => {
//                                             const newQuantity = parseInt(e.target.value);
//                                             if (newQuantity > 0) {
//                                                 updateQuantity(item.productId, newQuantity);
//                                             }
//                                         }}
//                                     />
//                                 </TableCell>
//                                 <TableCell>{(item.price * item.quantity).toFixed(2)} VND</TableCell>
//                                 <TableCell>
//                                     <Button
//                                         variant="contained"
//                                         sx={{
//                                             borderRadius: "8px",
//                                             textTransform: "none",
//                                             "&:hover": {
//                                                 backgroundColor: "rgb(25, 167, 210)",
//                                             }
//                                         }}
//                                         onClick={() => handleRemoveClick(item.productId)}
//                                     >
//                                         Remove
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <Box sx={{ display: "flex", justifyContent: 'flex-end', my: 4 }}>
//                 {
//                     cart.length > 0 && <Typography variant="h6">
//                         Total amount: {totalAmount} VND
//                     </Typography>
//                 }
//             </Box>
//             <Box display="flex" justifyContent="space-between" mt={2}>
//                 <Button
//                     variant="contained"
//                     sx={{
//                         borderRadius: "8px",
//                         textTransform: "none",
//                         "&:hover": { backgroundColor: "rgb(25, 167, 210)" },
//                     }}
//                     onClick={() => nav('/allproduct')}
//                 >
//                     Return To Shop
//                 </Button>
//                 {
//                     cart.length > 0 && <Button
//                         variant="contained"
//                         color="primary"
//                         sx={{
//                             borderRadius: "8px",
//                             textTransform: "none",
//                             "&:hover": { backgroundColor: "rgb(25, 167, 210)" },
//                         }}
//                         onClick={() => handleToCheckOut()}
//                     >
//                         Proceed To Checkout
//                     </Button>
//                 }
//             </Box>

//             {/* Dialog for remove confirmation */}
//             <Dialog
//                 open={openDialog}
//                 onClose={handleDialogClose}
//                 aria-labelledby="confirm-remove-dialog-title"
//                 aria-describedby="confirm-remove-dialog-description"
//             >
//                 <DialogTitle id="confirm-remove-dialog-title">
//                     {"Are you sure you want to remove this item?"}
//                 </DialogTitle>
//                 <DialogContent>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleConfirmRemove} color="primary" autoFocus>
//                         Confirm
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Dialog for enter address and confirm checkout */}
//             <Dialog open={openAddressDialog} fullWidth>
//                 <DialogTitle>Enter Shipping Address &nbsp;<FaMapMarkedAlt /></DialogTitle>
//                 <DialogContent>

//                     <TextField
//                         fullWidth
//                         label="Shipping Address"
//                         variant="outlined"
//                         value={shippingAddress}
//                         onChange={(e) => setShippingAddress(e.target.value)}
//                         sx={{ mt: 2 }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => { setOpenAddressDialog(false), setShippingAddress('') }} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button onClick={() => handleConfirmCheckout()} color="primary">
//                         Confirm
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Container>
//     );
// };

// export default CartPage;


import { Container, Typography, Button, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { portserver } from "../utils/portserver";
import { ToastContainer, toast } from 'react-toastify';

const CartPage = () => {
    const { cart, updateQuantity, removeProduct } = useCart();
    const nav = useNavigate();
    const totalAmount: number = cart.reduce((total, item) => total + item.quantity * item.price, 0);
    const [shippingAddress, setShippingAddress] = useState("");

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const handleConfirmCheckout = () => {
        if (shippingAddress === '') {
            toast.error("Please enter your address");
            return;
        }
        nav("/checkout");
    };

    return (
        <Box px={3}>
            <ToastContainer />
            <Typography variant="h4" gutterBottom>
                Cart
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper} sx={{ borderRadius: "16px" }}>
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
                                {cart.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell>{item.price} VND</TableCell>
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
                                        <TableCell>{(item.price * item.quantity).toFixed(2)} VND</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="secondary" onClick={() => removeProduct(item.productId)}>
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: "16px" }}>
                        <Typography variant="h6" gutterBottom>
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
                            Total: {totalAmount} VND
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleConfirmCheckout}
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
