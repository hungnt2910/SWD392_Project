import { Container, Typography, Button, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const { cart, updateQuantity, removeProduct } = useCart();
    const nav = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [])

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Cart
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>${item.price}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        value={item.quantity}
                                        size="small"
                                        inputProps={{ min: 1 }}
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
                                    <Button variant="contained" onClick={() => removeProduct(item.productId)}>Remove</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained" onClick={() => nav('/allproduct')}>Return To Shop</Button>
                <Button variant="contained" color="primary">Proceed To Checkout</Button>
            </Box>
        </Container>
    );
};


export default CartPage