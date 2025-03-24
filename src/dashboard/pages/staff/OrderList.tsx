import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { portserver } from "../../../utils/portserver";

import OrderDetailDialog, {
  Order,
  formatPrice,
  formatDate,
  getStatusColor,
} from "./OrderDetailDialog";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const fetchOrders = async () => {
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

      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialog(true);
  };

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
      setDetailDialog(false);
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
      renderCell: (params: GridRenderCellParams) => {
        const status = params.value as string;
        const chipColor = getStatusColor(status);

        return <Chip label={status} color={chipColor} size="small" />;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      minWidth: 100,
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
          <Stack direction="row" spacing={1} justifyContent="center">
            <Tooltip title="View Details">
              <IconButton
                color="primary"
                onClick={() => handleViewOrder(params.row)}
                size="small"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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
        Order Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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

      <OrderDetailDialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        order={selectedOrder}
        onConfirmOrder={handleConfirmOrder}
        onConfirmRefund={handleConfirmRefund}
      />
    </Box>
  );
};

export default OrderList;
