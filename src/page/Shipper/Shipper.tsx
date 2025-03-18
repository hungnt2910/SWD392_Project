import React, { useEffect, useState } from "react";
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
    InputLabel,
    Select,
    MenuItem,
    FormControl
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { portserver } from "../../utils/portserver";
import { jwtDecode } from "jwt-decode";
import { formatDate, formatMoney } from "../../utils/format";
import { SelectChangeEvent } from "@mui/material";

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

const statusArr = ["All", "Pending", "Shipped"]

const Shipper = () => {
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [allOrders, setAllOrders] = useState<Order[]>([
        {
            "orderId": 1,
            "status": "pending",
            "amount": 477001,
            "shippingAddress": "Q2",
            "timestamp": "2025-03-10T04:57:50.000Z",
            "orderDetails": [
                {
                    "orderDetailId": 1,
                    "price": 159001,
                    "quantity": 1,
                    "productName": "The Ordinary Niacinamide 10% + Zinc 1% - Version 5"
                },
                {
                    "orderDetailId": 2,
                    "price": 158998,
                    "quantity": 1,
                    "productName": "Neutrogena Hydro Boost Water Gel - Version 7"
                },
                {
                    "orderDetailId": 3,
                    "price": 159002,
                    "quantity": 1,
                    "productName": "L'Oréal Revitalift Hyaluronic Acid Serum - Version 6"
                }
            ]
        },
        {
            "orderId": 2,
            "status": "pending",
            "amount": 477001,
            "shippingAddress": "Maternal",
            "timestamp": "2025-03-10T04:58:54.000Z",
            "orderDetails": [
                {
                    "orderDetailId": 4,
                    "price": 159001,
                    "quantity": 1,
                    "productName": "The Ordinary Niacinamide 10% + Zinc 1% - Version 5"
                },
                {
                    "orderDetailId": 5,
                    "price": 158998,
                    "quantity": 1,
                    "productName": "Neutrogena Hydro Boost Water Gel - Version 7"
                },
                {
                    "orderDetailId": 6,
                    "price": 159002,
                    "quantity": 1,
                    "productName": "L'Oréal Revitalift Hyaluronic Acid Serum - Version 6"
                }
            ]
        },
        {
            "orderId": 3,
            "status": "shipped",
            "amount": 1091990,
            "shippingAddress": "Q9",
            "timestamp": "2025-03-11T08:56:04.000Z",
            "orderDetails": [
                {
                    "orderDetailId": 7,
                    "price": 128998,
                    "quantity": 5,
                    "productName": "La Roche-Posay Toleriane Hydrating Gentle Cleanser - Version 4"
                },
                {
                    "orderDetailId": 8,
                    "price": 128998,
                    "quantity": 1,
                    "productName": "CeraVe Hydrating Facial Cleanser - Version 3"
                },
                {
                    "orderDetailId": 9,
                    "price": 158998,
                    "quantity": 1,
                    "productName": "Neutrogena Hydro Boost Water Gel - Version 7"
                },
                {
                    "orderDetailId": 10,
                    "price": 159002,
                    "quantity": 1,
                    "productName": "L'Oréal Revitalift Hyaluronic Acid Serum - Version 6"
                }
            ]
        }
    ]);
    const [orders, setOrders] = useState<Order[]>([
        {
            "orderId": 1,
            "status": "pending",
            "amount": 477001,
            "shippingAddress": "Q2",
            "timestamp": "2025-03-10T04:57:50.000Z",
            "orderDetails": [
                {
                    "orderDetailId": 1,
                    "price": 159001,
                    "quantity": 1,
                    "productName": "The Ordinary Niacinamide 10% + Zinc 1% - Version 5"
                },
                {
                    "orderDetailId": 2,
                    "price": 158998,
                    "quantity": 1,
                    "productName": "Neutrogena Hydro Boost Water Gel - Version 7"
                },
                {
                    "orderDetailId": 3,
                    "price": 159002,
                    "quantity": 1,
                    "productName": "L'Oréal Revitalift Hyaluronic Acid Serum - Version 6"
                }
            ]
        },
        {
            "orderId": 2,
            "status": "pending",
            "amount": 477001,
            "shippingAddress": "Maternal",
            "timestamp": "2025-03-10T04:58:54.000Z",
            "orderDetails": [
                {
                    "orderDetailId": 4,
                    "price": 159001,
                    "quantity": 1,
                    "productName": "The Ordinary Niacinamide 10% + Zinc 1% - Version 5"
                },
                {
                    "orderDetailId": 5,
                    "price": 158998,
                    "quantity": 1,
                    "productName": "Neutrogena Hydro Boost Water Gel - Version 7"
                },
                {
                    "orderDetailId": 6,
                    "price": 159002,
                    "quantity": 1,
                    "productName": "L'Oréal Revitalift Hyaluronic Acid Serum - Version 6"
                }
            ]
        },
        {
            "orderId": 3,
            "status": "shipped",
            "amount": 1091990,
            "shippingAddress": "Q9",
            "timestamp": "2025-03-11T08:56:04.000Z",
            "orderDetails": [
                {
                    "orderDetailId": 7,
                    "price": 128998,
                    "quantity": 5,
                    "productName": "La Roche-Posay Toleriane Hydrating Gentle Cleanser - Version 4"
                },
                {
                    "orderDetailId": 8,
                    "price": 128998,
                    "quantity": 1,
                    "productName": "CeraVe Hydrating Facial Cleanser - Version 3"
                },
                {
                    "orderDetailId": 9,
                    "price": 158998,
                    "quantity": 1,
                    "productName": "Neutrogena Hydro Boost Water Gel - Version 7"
                },
                {
                    "orderDetailId": 10,
                    "price": 159002,
                    "quantity": 1,
                    "productName": "L'Oréal Revitalift Hyaluronic Acid Serum - Version 6"
                }
            ]
        }
    ]);

    const getStatusChip = (status: string) => {
        let color: "primary" | "warning" | "default";

        switch (status.toLowerCase()) {
            case "pending":
                color = "warning";
                break;
            case "shipped":
                color = "primary";
                break;
            default:
                color = "default";
        }

        return <Chip label={status} color={color} sx={{ fontWeight: "bold", textTransform: "capitalize" }} />;
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        const newStatus = event.target.value;
        setSelectedStatus(newStatus);

        if (newStatus === "All") {
            setOrders(allOrders);
        } else {
            setOrders(allOrders.filter(order => order.status.toLowerCase() === newStatus.toLowerCase()));
        }
    };


    console.log(selectedStatus)
    console.log(orders)
    console.log(allOrders)

    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;

    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         try {
    //             const res = await axios.get(`${portserver}/orders/${decode?.userId}`,
    //                 {
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         "Authorization": `Bearer ${token}`
    //                     }
    //                 }
    //             );
    //             setOrders(res.data);
    //         } catch (error) {
    //             console.error("Failed to fetch orders", error);
    //         }
    //     }
    //     fetchOrders();
    // }, []);

    const updateOrderStatus = async (orderId: number) => {
        try {
            await axios.put(`${portserver}/orders/update/${orderId}`, { status: "shipped" }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setOrders(orders.map(order =>
                order.orderId === orderId ? { ...order, status: "shipped" } : order
            ));
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };

    return (
        <Box sx={{ px: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1976D2" }}>Shipper Dashboard</Typography>

                <Box sx={{ mb: 2, minWidth: 200 }}>
                    <FormControl fullWidth>
                        <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            sx={{
                                borderRadius: "8px",
                                backgroundColor: "#FFF3F8",
                                "&:hover": { backgroundColor: "#F8BBD0" }
                            }}
                        >
                            {statusArr.map((item, index) => (
                                <MenuItem key={index} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box px={10}>
                {orders.map((order) => (
                    <Accordion key={order.orderId} sx={{ mb: 2, borderRadius: "12px", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", backgroundColor: "#FFFFFF" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#1976D2" }} />}>
                            <Typography variant="h6" sx={{ color: "#0D47A1" }}>Order #{order.orderId}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography component='div'><strong>Status:</strong>  {getStatusChip(order.status)}</Typography>
                                    <Typography><strong>Total:</strong> {formatMoney(order.amount)}</Typography>
                                    <Typography><strong>Shipping Address:</strong> {order.shippingAddress}</Typography>
                                    <Typography><strong>Date:</strong> {formatDate(order.timestamp)}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: "#BBDEFB" }}>
                                                    <TableCell sx={{ fontWeight: "bold", textAlign: 'center' }}>Product</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", textAlign: 'center' }}>Price</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold", textAlign: 'center' }}>Quantity</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {order.orderDetails.map((detail) => (
                                                    <TableRow key={detail.orderDetailId}>
                                                        <TableCell sx={{ textAlign: 'center' }}>{detail.productName}</TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}>{formatMoney(detail.price)}</TableCell>
                                                        <TableCell sx={{ textAlign: 'center' }}>{detail.quantity}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12} textAlign="center">
                                    {order.status === "pending" && (
                                        <Box sx={{ display: "flex", justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => updateOrderStatus(order.orderId)}
                                            >
                                                Mark as Shipped
                                            </Button>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
};

export default Shipper;
