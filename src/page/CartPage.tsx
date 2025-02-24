import { Container, Typography, Button, Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const CartPage = () => {
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[{ name: "LCD Monitor", price: 650, quantity: 1 }, { name: "HV Gamepad", price: 550, quantity: 1 }].map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>${item.price}</TableCell>
                                <TableCell>
                                    <TextField type="number" defaultValue={item.quantity} size="small" />
                                </TableCell>
                                <TableCell>${item.price * item.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="contained">Return To Shop</Button>
                <Button variant="contained" color="primary">Proceed To Checkout</Button>
            </Box>
        </Container>
    );
};


export default CartPage