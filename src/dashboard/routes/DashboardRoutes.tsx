import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardLogin from "../pages/common/login";

// Staff pages
import ManageMembers from "../pages/staff/ManageMembers";
// import other staff pages

// Admin pages
// import StaffManagement from "../pages/admin/StaffManagement";
// import other admin pages

// Shipper pages
// import PendingDeliveries from "../pages/shipper/PendingDeliveries";
// import other shipper pages

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/logindashboard" element={<DashboardLogin />} />

      {/* Staff Routes */}
      <Route path="/staff" element={<DashboardLayout />}>
        <Route index element={<Navigate to="members" replace />} />
        <Route path="members" element={<ManageMembers />} />
        {/* Add more staff routes */}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<div>Admin Dashboard</div>} />
        <Route path="staff" element={<div>Staff Management</div>} />
        {/* Add more admin routes */}
      </Route>

      {/* Shipper Routes */}
      <Route path="/shipper" element={<DashboardLayout />}>
        <Route index element={<div>Shipper Dashboard</div>} />
        <Route path="pending" element={<div>Pending Deliveries</div>} />
        {/* Add more shipper routes */}
      </Route>

      {/* Default redirection */}
      <Route
        path="/"
        element={<Navigate to="/logindashboard" replace />}
      />
    </Routes>
  );
}
