import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardLogin from "../pages/common/login";
import NotFoundPage from "../pages/common/NotFoundPage";
import ManageGoods from "../pages/staff/ManageGoods";
import ManageMembers from "../pages/staff/ManageMembers";
import OrderList from "../pages/staff/OrderList";
import OrderConfirm from "../pages/staff/OrderConfirm";
import { useEffect, useState } from "react";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole") || "";

  if (!userRole) {
    // Chưa đăng nhập, chuyển hướng tới trang login
    return <Navigate to="/dashboard/logindashboard" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Không có quyền truy cập, chuyển hướng tới trang tương ứng với role
    return <Navigate to={`/dashboard/${userRole}`} replace />;
  }

  // Có quyền truy cập
  return children;
};

export default function DashboardRoutes() {
  // Kiểm tra nếu đã đăng nhập
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <Routes>
      {/* Login Route */}
      <Route 
        path="/logindashboard"
        element={
          isLoggedIn ? (
            <Navigate
              to={`/dashboard/${localStorage.getItem("userRole")}`}
              replace
            />
          ) : (
            <DashboardLogin />
          )
        }
      />

      {/* Staff Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="members" replace />} />
        <Route path="members" element={<ManageMembers />} />
        <Route path="goods" element={<ManageGoods />} />
        <Route path="orders/all" element={<OrderList />} />
        <Route path="orders/confirm" element={<OrderConfirm />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<div>Admin Dashboard</div>} />
        <Route path="staff" element={<div>Staff Management</div>} />
        <Route path="vouchers/all" element={<div>All Vouchers</div>} />
        <Route path="vouchers/pending" element={<div>Pending Vouchers</div>} />
      </Route>

      {/* Shipper Routes */}
      <Route
        path="/shipper"
        element={
          <ProtectedRoute allowedRoles={["shipper"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<div>Shipper Dashboard</div>} />
        <Route path="pending" element={<div>Pending Deliveries</div>} />
      </Route>

      {/* Default redirection based on login status */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate
              to={`/dashboard/${localStorage.getItem("userRole")}`}
              replace
            />
          ) : (
            <Navigate to="/dashboard/logindashboard" replace />
          )
        }
      />

      <Route path="/notfound" element={<NotFoundPage />} />

      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard/notfound" replace />
          ) : (
            <Navigate to="/dashboard/logindashboard" replace />
          )
        }
      />
    </Routes>
  );
}
