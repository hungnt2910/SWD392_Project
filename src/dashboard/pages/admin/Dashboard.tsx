import * as React from "react";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { format, isAfter, parseISO, isWithinInterval } from "date-fns";
import axios from "axios";
import { portserver } from "../../../utils/portserver";
import StatCard from "../../components/StatCard";

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  topProducts: {
    brandId: number;
    brandName: string;
    totalSold: string;
  }[];
  successfulOrdersPerMonth: {
    yearMonth: string;
    successfulOrders: string;
  }[];
  totalRevenuePerPeriod: {
    periodMonth: string;
    totalRevenue: number;
  }[];
}

interface OrderDetail {
  orderDetailId: number;
  price: number;
  quantity: number;
  productName: string;
}

interface Order {
  orderId: number;
  status: string;
  amount: number;
  shippingAddress: string;
  timestamp: string;
  orderDetails: OrderDetail[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function Dashboard() {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(new Date(2024, 0, 1)); // 1 Jan 2024
  const [endDate, setEndDate] = useState<Date | null>(new Date(2025, 11, 31)); // 31 Dec 2025
  const [dateError, setDateError] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // Handle date changes
  const handleStartDateChange = (date: Date | null) => {
    setDateError(null);
    setStartDate(date);

    if (date && endDate && isAfter(date, endDate)) {
      setDateError("Start date cannot be after end date");
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setDateError(null);
    setEndDate(date);

    if (date && startDate && isAfter(startDate, date)) {
      setDateError("End date cannot be before start date");
    }
  };

  const applyDateFilter = () => {
    if (!startDate || !endDate) {
      setDateError("Please select both start and end dates");
      return;
    }

    if (isAfter(startDate, endDate)) {
      setDateError("Start date cannot be after end date");
      return;
    }

    const formattedStartDate = format(startDate, "dd-MM-yyyy");
    const formattedEndDate = format(endDate, "dd-MM-yyyy");

    setDateRange({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  };

  useEffect(() => {
    const fetchOrdersData = async () => {
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
        console.error("Error fetching orders data:", err);
        setError("Failed to load orders data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  useEffect(() => {
    if (orders.length > 0 && startDate && endDate) {
      const filtered = orders.filter((order) => {
        const orderDate = parseISO(order.timestamp);
        return isWithinInterval(orderDate, { start: startDate, end: endDate });
      });
      setFilteredOrders(filtered);
    }
  }, [orders, startDate, endDate]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const fetchDashboardData = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");

          if (!token) {
            setError("Authentication token not found. Please login again.");
            setLoading(false);
            return;
          }

          const response = await axios.get(
            `${portserver}/dashboard?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setDashboardData(response.data);
          setError(null);
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
          setError("Failed to load dashboard data. Please try again later.");
          setDashboardData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [dateRange]);

  const getCanceledOrdersCount = (): number => {
    return filteredOrders.filter(order => order.status === "Cancelled").length;
  };

  const getTopProducts = (): { productName: string; quantity: number }[] => {
    const productMap: Record<string, number> = {};
    
    const successfulOrders = filteredOrders.filter(order => 
      order.status !== "Cancelled"
    );
    
    successfulOrders.forEach(order => {
      order.orderDetails.forEach(detail => {
        if (productMap[detail.productName]) {
          productMap[detail.productName] += detail.quantity;
        } else {
          productMap[detail.productName] = detail.quantity;
        }
      });
    });
    
    const sortedProducts = Object.entries(productMap)
      .map(([productName, quantity]) => ({ productName, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); 
    
    return sortedProducts;
  };

  // Hàm xác định xu hướng doanh thu
  const calculateRevenueTrend = (
    revenueData: { month: string; revenue: number }[]
  ): "up" | "down" | "neutral" => {
    if (revenueData.length < 2) return "neutral";

    const lastValue = revenueData[revenueData.length - 1].revenue;
    const previousValue = revenueData[revenueData.length - 2].revenue;

    if (lastValue > previousValue) return "up";
    if (lastValue < previousValue) return "down";
    return "neutral";
  };

  const renderDateSelector = () => (
    <Box sx={{ mb: 4 }}>
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Sales Dashboard
      </Typography>

      <Card variant="outlined" sx={{ p: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "center",
            }}
          >
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: { size: "medium", fullWidth: true },
              }}
            />

            <Typography sx={{ display: { xs: "none", sm: "block" } }}>
              to
            </Typography>

            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              format="dd/MM/yyyy"
              slotProps={{
                textField: { size: "medium", fullWidth: true },
              }}
            />

            <Button
              variant="contained"
              onClick={applyDateFilter}
              sx={{ minWidth: 150, minHeight: 45 }}
              startIcon={<AssessmentIcon />}
            >
              Generate Report
            </Button>
          </Box>

          {dateError && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: "block" }}
            >
              {dateError}
            </Typography>
          )}

          {dateRange.startDate && dateRange.endDate && (
            <Typography
              variant="caption"
              sx={{ mt: 1, display: "block", color: "text.secondary" }}
            >
              Current filter: {dateRange.startDate} to {dateRange.endDate}
            </Typography>
          )}
        </LocalizationProvider>
      </Card>
    </Box>
  );

  if (!dateRange.startDate || !dateRange.endDate) {
    return (
      <Box sx={{ width: "100%", p: 2, maxWidth: { sm: "100%", md: "1700px" } }}>
        {renderDateSelector()}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
            textAlign: "center",
            p: 4,
          }}
        >
          <CalendarTodayIcon
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Please select a date range
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a start and end date above, then click "Generate Report" to
            view dashboard data
          </Typography>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 2, maxWidth: { sm: "100%", md: "1700px" } }}>
        {renderDateSelector()}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading dashboard data...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", p: 2, maxWidth: { sm: "100%", md: "1700px" } }}>
        {renderDateSelector()}
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box sx={{ width: "100%", p: 2, maxWidth: { sm: "100%", md: "1700px" } }}>
        {renderDateSelector()}
        <Alert severity="info" sx={{ mt: 2 }}>
          No dashboard data available for the selected period.
        </Alert>
      </Box>
    );
  }

  const totalOrders = dashboardData.totalOrders || 0;
  const totalRevenue = dashboardData.totalRevenue || 0;
  const canceledOrders = getCanceledOrdersCount();
  const topProducts = dashboardData.topProducts || [];
  const successfulOrdersPerMonth = dashboardData.successfulOrdersPerMonth || [];
  const totalRevenuePerPeriod = dashboardData.totalRevenuePerPeriod || [];

  const totalOrdersAll = totalOrders + canceledOrders;

  const successRate =
    totalOrdersAll > 0 ? Math.round((totalOrders / totalOrdersAll) * 100) : 0;

  const topBrandsData = topProducts.slice(0, 7).map((brand) => ({
    brand: brand.brandName,
    sold: parseInt(brand.totalSold) || 0,
  }));

  const topProductsData = getTopProducts().slice(0, 7).map((product) => ({
    product: product.productName.length > 20 
      ? `${product.productName.substring(0, 20)}...` 
      : product.productName,
    quantity: product.quantity,
  }));

  const revenueData = [...totalRevenuePerPeriod]
    .sort((a, b) => {
      if (
        a.periodMonth.includes("-") &&
        a.periodMonth.split("-").length === 3
      ) {
        const [aDay, aMonth, aYear] = a.periodMonth.split("-").map(Number);
        const [bDay, bMonth, bYear] = b.periodMonth.split("-").map(Number);

        if (aYear !== bYear) return aYear - bYear;
        if (aMonth !== bMonth) return aMonth - bMonth;
        return aDay - bDay;
      }

      const [aMonth, aYear] = a.periodMonth.split("-").map(Number);
      const [bMonth, bYear] = b.periodMonth.split("-").map(Number);

      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    })
    .map((item) => ({
      month: item.periodMonth,
      revenue: item.totalRevenue || 0,
    }));

  const orderStatusData = [
    { id: 0, value: totalOrders, label: "Successful" },
    { id: 1, value: canceledOrders, label: "Canceled" },
  ];

  const brandColumns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Brand Name", width: 210 },
    {
      field: "sold",
      headerName: "Products Sold",
      width: 250,
      align: "center",
      headerAlign: "center",
    },
  ];

  const brandRows = topProducts.map((brand) => ({
    id: brand.brandId,
    name: brand.brandName,
    sold: parseInt(brand.totalSold) || 0,
  }));

  const productColumns: GridColDef[] = [
    { field: "id", headerName: "No.", width: 70 },
    { field: "name", headerName: "Product Name", flex: 1, minWidth: 200 },
    {
      field: "quantity",
      headerName: "Quantity Sold",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
  ];

  const productRows = getTopProducts().map((product, index) => ({
    id: index + 1,
    name: product.productName,
    quantity: product.quantity,
  }));

  return (
    <Box sx={{ width: "100%", p: 2, maxWidth: { sm: "100%", md: "1700px" } }}>
      {renderDateSelector()}

      <Grid container spacing={3} columns={12} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Orders"
            value={totalOrders.toString()}
            interval={`${
              successfulOrdersPerMonth[0]?.yearMonth || "Current period"
            }`}
            trend="up"
            data={[totalOrders]}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            interval={`${
              successfulOrdersPerMonth[0]?.yearMonth || "Current period"
            }`}
            trend={calculateRevenueTrend(revenueData)}
            data={revenueData.map((item) => item.revenue / 1000000)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            interval="Orders completed successfully"
            trend={successRate > 75 ? "up" : "neutral"}
            data={[successRate]}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Canceled Orders"
            value={canceledOrders.toString()}
            interval="Orders canceled"
            trend={canceledOrders > 0 ? "down" : "neutral"}
            data={[canceledOrders]}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} columns={12} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography component="h2" variant="subtitle1" gutterBottom>
                Top Selling Brands
              </Typography>

              {topBrandsData.length > 0 ? (
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: topBrandsData.map((item) => item.brand),
                      tickLabelStyle: {
                        angle: 45,
                        textAnchor: "start",
                        fontSize: 12,
                      },
                    },
                  ]}
                  series={[
                    {
                      data: topBrandsData.map((item) => item.sold),
                      label: "Products Sold",
                      color: theme.palette.primary.main,
                    },
                  ]}
                  height={350}
                  margin={{ left: 60, right: 20, top: 20, bottom: 70 }}
                  grid={{ horizontal: true, vertical: false }}
                />
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No brand data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography component="h2" variant="subtitle1" gutterBottom>
                Order Status Distribution
              </Typography>

              <Box
                sx={{
                  height: 350,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {totalOrdersAll > 0 ? (
                  <PieChart
                    series={[
                      {
                        data: orderStatusData,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        innerRadius: 80,
                        outerRadius: 110,
                        paddingAngle: 2,
                        cornerRadius: 4,
                      },
                    ]}
                    colors={[
                      theme.palette.success.main,
                      theme.palette.error.main,
                    ]}
                    height={300}
                    width={300}
                    margin={{ top: 10, bottom: 80, left: 30, right: 30 }}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        padding: { top: 20 },
                        itemMarkWidth: 10,
                        itemMarkHeight: 10,
                        markGap: 5,
                        itemGap: 15,
                      },
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    No order data available
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} columns={12} sx={{ mb: 4 }}>
        {/* Revenue Timeline */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography component="h2" variant="subtitle1" gutterBottom>
                Revenue Timeline
              </Typography>

              {revenueData.length > 0 ? (
                <LineChart
                  xAxis={[
                    {
                      data: revenueData.map((item) => item.month),
                      scaleType: "point",
                      tickLabelStyle: {
                        angle: 45,
                        textAnchor: "start",
                        fontSize: 12,
                      },
                    },
                  ]}
                  series={[
                    {
                      data: revenueData.map((item) => item.revenue / 1000000),
                      area: true,
                      label: "Revenue (Million VND)",
                      color: theme.palette.primary.main,
                      showMark: true,
                    },
                  ]}
                  height={350}
                  margin={{ left: 70, right: 20, top: 20, bottom: 70 }}
                  grid={{ horizontal: true, vertical: false }}
                />
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No revenue data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography component="h2" variant="subtitle1" gutterBottom>
                Top Selling Products
              </Typography>

              {topProductsData.length > 0 ? (
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: topProductsData.map((item) => item.product),
                      tickLabelStyle: {
                        angle: 45,
                        textAnchor: "start",
                        fontSize: 11,
                      },
                    },
                  ]}
                  series={[
                    {
                      data: topProductsData.map((item) => item.quantity),
                      label: "Quantity Sold",
                      color: theme.palette.secondary.main,
                    },
                  ]}
                  height={350}
                  margin={{ left: 50, right: 20, top: 20, bottom: 70 }}
                  grid={{ horizontal: true, vertical: false }}
                />
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography color="text.secondary">
                    No product data available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} columns={12}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography component="h2" variant="subtitle1" gutterBottom>
                Brand Sales Details
              </Typography>

              <Box sx={{ height: 350, width: "100%" }}>
                {brandRows.length > 0 ? (
                  <DataGrid
                    rows={brandRows}
                    columns={brandColumns}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                      sorting: {
                        sortModel: [{ field: "sold", sort: "desc" }],
                      },
                    }}
                    disableRowSelectionOnClick
                    density="compact"
                  />
                ) : (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No brand data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Products Table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              <Typography component="h2" variant="subtitle1" gutterBottom>
                Top Products
              </Typography>

              <Box sx={{ height: 350, width: "100%" }}>
                {productRows.length > 0 ? (
                  <DataGrid
                    rows={productRows}
                    columns={productColumns}
                    pageSizeOptions={[5, 10]}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                      sorting: {
                        sortModel: [{ field: "quantity", sort: "desc" }],
                      },
                    }}
                    disableRowSelectionOnClick
                    density="compact"
                  />
                ) : (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      No product data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}