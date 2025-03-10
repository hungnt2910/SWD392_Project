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
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

interface Order {
  id: number;
  orderId: number;
  customerName: string;
  customerId: number;
  totalAmount: number;
  status: "Pending" | "Approved" | "Delivered" | "Cancelled";
  date: string;
}

const sampleOrders: Order[] = [
  {
    id: 2,
    orderId: 18908425,
    customerName: "Emily Johnson",
    customerId: 1002,
    totalAmount: 89.5,
    status: "Pending",
    date: "3 March 2022",
  },
  {
    id: 6,
    orderId: 18908429,
    customerName: "Lisa Rodriguez",
    customerId: 1006,
    totalAmount: 112.75,
    status: "Pending",
    date: "8 March 2022",
  },
  {
    id: 7,
    orderId: 18908430,
    customerName: "Robert Taylor",
    customerId: 1007,
    totalAmount: 67.99,
    status: "Pending",
    date: "9 March 2022",
  },
];

const OrderConfirm: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewOrder = (orderId: number) => {
    console.log(`View details for order ID: ${orderId}`);
  };

  const handleConfirmOrder = (orderId: number) => {
    console.log(`Confirming order ID: ${orderId}`);
    setLoading(true);

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: "Approved" } : order
        )
      );
      setLoading(false);
    }, 500);
  };

  const handleCancelOrder = (orderId: number) => {
    console.log(`Cancelling order ID: ${orderId}`);
    setLoading(true);

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      setLoading(false);
    }, 500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const columns: GridColDef[] = [
    {
      field: "orderId",
      headerName: "Tracking ID",
      flex: 0.8,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1.2,
      minWidth: 150,
      editable: false,
    },
    {
      field: "customerId",
      headerName: "Customer ID",
      flex: 0.8,
      minWidth: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalAmount",
      headerName: "Total Amount",
      flex: 1,
      minWidth: 120,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => formatPrice(params.value),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridRenderCellParams<Order, string>) => {
        let chipColor;
        switch (params.value) {
          case "Approved":
            chipColor = "success";
            break;
          case "Pending":
            chipColor = "warning";
            break;
          case "Delivered":
            chipColor = "info";
            break;
          case "Cancelled":
            chipColor = "error";
            break;
          default:
            chipColor = "default";
        }

        return (
          <Chip label={params.value} color={chipColor as any} size="small" />
        );
      },
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
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="View Details">
            <IconButton
              color="info"
              onClick={() => handleViewOrder(params.row.orderId)}
              size="small"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {params.row.status === "Pending" && (
            <>
              <Tooltip title="Confirm Order">
                <IconButton
                  color="success"
                  onClick={() => handleConfirmOrder(params.row.orderId)}
                  size="small"
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cancel Order">
                <IconButton
                  color="error"
                  onClick={() => handleCancelOrder(params.row.orderId)}
                  size="small"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
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

  const displayedOrders = orders.filter(
    (order) =>
      order.status === "Pending" ||
      order.status === "Approved" ||
      order.status === "Cancelled"
  );

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Order Confirmation
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
          rows={displayedOrders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10, 15, 30]}
          checkboxSelection
          disableRowSelectionOnClick
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
    </Box>
  );
};

export default OrderConfirm;
