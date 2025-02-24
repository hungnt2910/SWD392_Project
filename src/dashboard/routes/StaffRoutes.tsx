import { Routes, Route } from "react-router-dom";
import StaffLayout from "../layouts/StaffLayout";
import ManageMembers from "../pages/staff/ManageMembers";
// import ManageMembers from "../pages/staff/ManageMembers";
// import ManageGoods from "../pages/staff/ManageGoods";
// import ManageSkintype from "../pages/staff/ManageSkintype";
// import ManageFeedbacks from "../pages/staff/ManageFeedbacks";
// import ManageBlogs from "../pages/staff/ManageBlogs";
// import CustomizeSkinRoute from "../pages/staff/CustomizeSkinRoute";
// import CreateVoucher from "../pages/staff/CreateVoucher";
// import AllOrders from "../pages/staff/ViewOrders/AllOrders";
// import PendingRefund from "../pages/staff/ViewOrders/PendingRefund";
// import PendingConfirm from "../pages/staff/ViewOrders/PendingConfirm";

export default function StaffRoutes() {
  return (
    <Routes>
      <Route path="/dashboard/staff" element={<StaffLayout />}>
        <Route path="members" element={<ManageMembers/>} />
      </Route>
    </Routes>
  );
}
