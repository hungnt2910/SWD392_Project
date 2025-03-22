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
import axios from "axios";
import { portserver } from "../../../utils/portserver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OrderDetailDialog, {
  Order,
  formatPrice,
  formatDate,
} from "./OrderDetailDialog";

const OrderRefund: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [detailDialog, setDetailDialog] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchReturnedOrders = async () => {
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

      const returnedOrders = response.data.filter(
        (order: Order) => order.status === "returned"
      );

      setOrders(returnedOrders);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnedOrders();
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
        `${portserver}/orders/refund/${orderId}`,
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
      renderCell: () => <Chip label="Returned" color="error" size="small" />,
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

            <Tooltip title="Process Refund">
              <IconButton
                color="success"
                onClick={() => handleConfirmRefund(params.row.orderId)}
                size="small"
                disabled={processing}
              >
                <CheckCircleIcon fontSize="small" />
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
        Return Requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 && !loading && !error ? (
        <Alert severity="info">No pending return requests.</Alert>
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

      <OrderDetailDialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        order={selectedOrder}
        onConfirmRefund={handleConfirmRefund}
        processing={processing}
      />
    </Box>
  );
};

export default OrderRefund;
