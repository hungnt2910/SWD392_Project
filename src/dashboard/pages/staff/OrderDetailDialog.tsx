import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { format } from "date-fns";

export interface OrderDetail {
  orderDetailId: number;
  price: number;
  quantity: number;
  productName: string;
}

export interface Order {
  orderId: number;
  status: string;
  amount: number;
  shippingAddress: string;
  timestamp: string;
  orderDetails: OrderDetail[];
}

interface OrderDetailDialogProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirmOrder?: (orderId: number) => Promise<void>;
  onCancelOrder?: (orderId: number) => Promise<void>;
  processing?: boolean;
}

export const formatDate = (timestamp: string): string => {
  try {
    return format(new Date(timestamp), "dd MMM yyyy, HH:mm");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

export const getStatusColor = (
  status: string
): "success" | "warning" | "info" | "error" | "default" => {
  switch (status) {
    case "Completed":
      return "success";
    case "Pending":
      return "warning";
    case "Shipped":
    case "Confirmed":
      return "info";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

export const calculateTotalItems = (orderDetails: OrderDetail[]): number => {
  return orderDetails.reduce((total, item) => total + item.quantity, 0);
};

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  open,
  onClose,
  order,
  onConfirmOrder,
  onCancelOrder,
  processing = false,
}) => {
  const [localProcessing, setLocalProcessing] = useState<boolean>(false);
  const isProcessing = processing || localProcessing;

  if (!order) return null;

  const isPending = order.status === "Pending";

  const handleConfirm = async () => {
    if (!onConfirmOrder) return;

    setLocalProcessing(true);
    try {
      await onConfirmOrder(order.orderId);
      onClose();
    } catch (error) {
      console.error("Error confirming order:", error);
    } finally {
      setLocalProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!onCancelOrder) return;

    setLocalProcessing(true);
    try {
      await onCancelOrder(order.orderId);
      onClose();
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setLocalProcessing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isProcessing ? undefined : onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="order-detail-dialog-title"
    >
      <DialogTitle id="order-detail-dialog-title">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" component="div">
              Order Details
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Order ID: {order.orderId}
            </Typography>
          </Box>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Order Information
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Typography variant="body2">
              <strong>Date:</strong> {formatDate(order.timestamp)}
            </Typography>
            <Typography variant="body2">
              <strong>Total Items:</strong>{" "}
              {calculateTotalItems(order.orderDetails)}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            gutterBottom
            sx={{ wordBreak: "break-word" }}
          >
            <strong>Shipping Address:</strong> {order.shippingAddress}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "success.main", fontWeight: "bold", mt: 1 }}
          >
            <strong>Total Amount:</strong> {formatPrice(order.amount)}
          </Typography>
        </Box>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Order Items
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Product</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Price</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Subtotal</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderDetails.map((item) => (
                <TableRow key={item.orderDetailId}>
                  <TableCell>{item.orderDetailId}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{formatPrice(item.price)}</TableCell>
                  <TableCell align="right">
                    {formatPrice(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="right"
                  sx={{ fontWeight: "bold" }}
                >
                  Total:
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formatPrice(order.amount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          Close
        </Button>

        {/* Chỉ hiển thị nút xác nhận và hủy nếu đơn hàng đang ở trạng thái "Pending" 
            và callbacks tương ứng được cung cấp */}
        {isPending && onConfirmOrder && (
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirm}
            disabled={isProcessing}
            startIcon={<CheckCircleIcon />}
          >
            Confirm Order
          </Button>
        )}

        {isPending && onCancelOrder && (
          <Button
            variant="contained"
            color="error"
            onClick={handleCancel}
            disabled={isProcessing}
            startIcon={<CancelIcon />}
          >
            Cancel Order
          </Button>
        )}
      </DialogActions>

      {/* Overlay khi đang xử lý */}
      {isProcessing && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Dialog>
  );
};

export default OrderDetailDialog;
