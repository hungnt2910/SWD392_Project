import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import { portserver } from "../../../utils/portserver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrderDetailDialog, {
  Order,
  formatPrice,
  formatDate,
} from "./OrderDetailDialog";

const OrderConfirm: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchPaidOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${portserver}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const paidOrders = response.data.filter(
        (order: Order) => order.status === "Paid" || order.status === "paid"
      );

      setOrders(paidOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialog(true);
  };

  const handleConfirmOrder = async (orderId: number) => {
    try {
      setProcessing(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        setProcessing(false);
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

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );

      toast.success(`Order #${orderId} has been confirmed successfully!`);
      setDetailDialog(false);
    } catch (err) {
      console.error("Error confirming order:", err);
      toast.error("Failed to confirm order. Please try again.");
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  // const handleCancelOrder = async (orderId: number) => {
  //   try {
  //     setProcessing(true);

  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       toast.error("Authentication token not found. Please login again.");
  //       setProcessing(false);
  //       return;
  //     }

  //     await axios.put(
  //       `${portserver}/orders/cancel/${orderId}`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setOrders((prevOrders) =>
  //       prevOrders.filter((order) => order.orderId !== orderId)
  //     );

  //     toast.info(`Order #${orderId} has been cancelled.`);
  //     setDetailDialog(false);
  //   } catch (err) {
  //     console.error("Error cancelling order:", err);
  //     toast.error("Failed to cancel order. Please try again.");
  //     throw err;
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

  const columns: GridColDef[] = [
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 0.6,
      minWidth: 90,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "username",
      headerName: "Customer",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "shippingAddress",
      headerName: "Shipping Address",
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => {
        const address = params.value;
        return address.length > 40 ? `${address.substring(0, 40)}...` : address;
      },
    },
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 120,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => formatPrice(params.value),
    },
    {
      field: "timestamp",
      headerName: "Date",
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: () => <Chip label="Paid" color="info" size="small" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      minWidth: 170,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            <Tooltip title="View Details">
              <IconButton
                color="info"
                onClick={() => handleViewOrder(params.row)}
                size="small"
                disabled={processing}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Confirm Order">
              <IconButton
                color="success"
                onClick={() => handleConfirmOrder(params.row.orderId)}
                size="small"
                disabled={processing}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {/* 
            <Tooltip title="Cancel Order">
              <IconButton
                color="error"
                onClick={() => handleCancelOrder(params.row.orderId)}
                size="small"
                disabled={processing}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip> */}
          </Stack>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <ToastContainer position="top-right" autoClose={3000} />

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Order Confirmation
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 && !loading && !error ? (
        <Alert severity="info">No paid orders to confirm.</Alert>
      ) : (
        <Box
          sx={{
            height: 600,
            width: "100%",
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <DataGrid
            rows={orders}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10, 15, 30]}
            disableRowSelectionOnClick
            getRowId={(row) => row.orderId}
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
          />
        </Box>
      )}

      {/* Sử dụng OrderDetailDialog component */}
      <OrderDetailDialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        order={selectedOrder}
        onConfirmOrder={handleConfirmOrder}
        // onCancelOrder={handleCancelOrder}
        processing={processing}
      />
    </Box>
  );
};

export default OrderConfirm;
