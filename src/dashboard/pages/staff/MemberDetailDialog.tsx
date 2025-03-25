import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import axios from "axios";
import { format } from "date-fns";
import { portserver } from "../../../utils/portserver";
import OrderDetailDialog, { formatPrice, getStatusColor, Order } from "./OrderDetailDialog";
import { toast } from "react-toastify";

interface User {
  id: number;
  username: string;
  phone: string;
  address: string;
  email: string;
  status: 'active' | 'inactive';
  loyaltyPoints: number;
}

interface MemberDetailDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'Completed':
    case 'Delivered':
      return <CheckCircleIcon fontSize="small" />;
    case 'Shipped':
      return <LocalShippingIcon fontSize="small" />;
    case 'Cancelled':
      return <CancelIcon fontSize="small" />;
    case 'Pending':
    case 'Paid':
    case 'Processing':
      return <PendingIcon fontSize="small" />;
    default:
      return <ShoppingBagIcon fontSize="small" />;
  }
};

const MemberDetailDialog: React.FC<MemberDetailDialogProps> = ({
  open,
  onClose,
  userId
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);

    const handleConfirmRefund = async (orderId: number) => {
      try {
        setProcessing(true);
    
        const token = localStorage.getItem("token");
    
        if (!token) {
          toast.error("Authentication token not found. Please login again.");
          setProcessing(false);
          return;
        }
    
        await axios.put(
          `${portserver}/orders/confirmReturn/${orderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status: "ready to refund" }
              : order
          )
        );
    
        toast.success(`Order #${orderId} has been marked as ready to refund!`);
      } catch (err) {
        console.error("Error confirming refund:", err);
        toast.error("Failed to process refund request. Please try again.");
        throw err;
      } finally {
        setProcessing(false);
      }
    };
  const handleConfirmOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      await axios.put(
        `${portserver}/orders/confirm/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: "Confirmed" } : order
        )
      );

      toast.success(`Order #${orderId} has been confirmed successfully!`);
    } catch (err) {
      console.error("Error confirming order:", err);
      toast.error("Failed to confirm order. Please try again.");
      throw err;
    }
  };
  useEffect(() => {
    if (open && userId) {
      fetchUserData(userId);
      fetchUserOrders(userId);
    }
  }, [open, userId]);

  const fetchUserData = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${portserver}/users/${id}`);
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${portserver}/orders/${id}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching user orders:", err);
      setError("Failed to load order history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), "dd MMM yyyy, HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        aria-labelledby="member-detail-dialog-title"
      >
        <DialogTitle id="member-detail-dialog-title">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="div">
              Customer Details
            </Typography>
            {user && (
              <Chip 
                label={user.status}
                color={user.status === "active" ? "success" : "error"}
                size="small"
              />
            )}
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {loading && !user && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {user && (
            <>
              {/* Customer Information Section */}
              <Paper elevation={0} variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Customer Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Customer ID
                        </Typography>
                        <Typography variant="body1">{user.id}</Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Username
                        </Typography>
                        <Typography variant="body1">{user.username}</Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">{user.email}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1">{user.phone}</Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                          {user.address}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Loyalty Points
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="primary.main">
                          {user.loyaltyPoints} points
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Order History
                <Chip 
                  label={`${orders.length} orders`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 1 }}
                />
              </Typography>

              {orders.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  This customer has no order history.
                </Alert>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "action.hover" }}>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.orderId} hover>
                          <TableCell>{order.orderId}</TableCell>
                          <TableCell>{formatDate(order.timestamp)}</TableCell>
                          <TableCell>
                            {order.orderDetails.reduce((total, item) => total + item.quantity, 0)} items
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(order.status)}
                              label={order.status}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {formatPrice(order.amount)}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View Order Details">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => openOrderDetail(order)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {selectedOrder && (
        <OrderDetailDialog
          open={orderDetailOpen}
          onClose={() => setOrderDetailOpen(false)}
          order={selectedOrder}
          onConfirmOrder={handleConfirmOrder}
          onConfirmRefund={handleConfirmRefund}


        />
      )}
    </>
  );
};

export default MemberDetailDialog;