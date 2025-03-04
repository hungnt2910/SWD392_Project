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
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Order {
  id: number;
  orderId: number;
  customerName: string;
  customerId: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Delivered' | 'Cancelled';
  date: string;
}

// Sample data for demonstration
const sampleOrders: Order[] = [
  {
    id: 1,
    orderId: 18908424,
    customerName: "John Smith",
    customerId: 1001,
    totalAmount: 125.99,
    status: "Approved",
    date: "2 March 2022"
  },
  {
    id: 2,
    orderId: 18908425,
    customerName: "Emily Johnson",
    customerId: 1002,
    totalAmount: 89.50,
    status: "Pending",
    date: "3 March 2022"
  },
  {
    id: 3,
    orderId: 18908426,
    customerName: "Michael Brown",
    customerId: 1003,
    totalAmount: 245.75,
    status: "Delivered",
    date: "5 March 2022"
  },
  {
    id: 4,
    orderId: 18908427,
    customerName: "Sarah Davis",
    customerId: 1004,
    totalAmount: 78.25,
    status: "Cancelled",
    date: "6 March 2022"
  },
  {
    id: 5,
    orderId: 18908428,
    customerName: "David Wilson",
    customerId: 1005,
    totalAmount: 156.80,
    status: "Approved",
    date: "7 March 2022"
  }
];

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle viewing order details
  const handleViewOrder = (orderId: number) => {
    console.log(`View details for order ID: ${orderId}`);
    // Here you would typically open a dialog with order details
  };

  // Function to handle status changes
  const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Define the DataGrid columns
  const columns: GridColDef[] = [
    { 
      field: 'orderId', 
      headerName: 'Tracking ID', 
      flex: 0.8,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      flex: 1.2,
      minWidth: 150,
      editable: false,
    },
    {
      field: 'customerId',
      headerName: 'Customer ID',
      flex: 0.8,
      minWidth: 100,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      flex: 1,
      minWidth: 120,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params) => formatPrice(params.value),
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<Order, string>) => {
        let chipColor;
        switch (params.value) {
          case 'Approved':
            chipColor = 'success';
            break;
          case 'Pending':
            chipColor = 'warning';
            break;
          case 'Delivered':
            chipColor = 'info';
            break;
          case 'Cancelled':
            chipColor = 'error';
            break;
          default:
            chipColor = 'default';
        }
        
        return (
          <Chip 
            label={params.value} 
            color={chipColor as any}
            size="small"
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8, 
      minWidth: 100,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams<Order>) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="View Details">
            <IconButton
              color="primary"
              onClick={() => handleViewOrder(params.row.orderId)}
              size="small"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{width: '100%', p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Order Management
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box
        sx={{
          height: 600, 
          width: '100%',
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 1,
          overflow: 'hidden',
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
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
            '& .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderList;