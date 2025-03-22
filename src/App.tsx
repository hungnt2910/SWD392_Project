import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { jwtDecode } from "jwt-decode";

const LoginPage = lazy(() => import("./page/LoginPage"));
const RegisterPage = lazy(() => import("./page/RegisterPage"));
const HomePage = lazy(() => import("./page/Home/HomePage"));
const NotFoundPage = lazy(() => import("./page/NotFoundPage"));
const CartPage = lazy(() => import("./page/Cart/CartPage"));
import MainLayout from "./page/MainLayout";
import ShowAllProduct from "./page/ShowAllProduct";
import ProductDetails from "./page/ProductDetails";
import ContactPage from "./page/ContactPage";
import QuizPage from "./page/QuizPage";
import SearchPage from "./page/SearchPage";
import CartLayout from "./page/Cart/CartLayout";
import DashboardLayout from "./dashboard/layouts/DashboardLayout";
import ManageGoods from "./dashboard/pages/staff/ManageGoods";
import ManageMembers from "./dashboard/pages/staff/ManageMembers";
import OrderList from "./dashboard/pages/staff/OrderList";
import OrderConfirm from "./dashboard/pages/staff/OrderConfirm";
import OrderRefund from "./dashboard/pages/staff/OrderRefund";
import ManageReviews from "./dashboard/pages/staff/ManageReviews";
import ManageBlogs from "./dashboard/pages/staff/ManageBlogs";
import CreateVoucher from "./dashboard/pages/staff/CreateVoucher";
import Dashboard from "./dashboard/pages/admin/Dashboard";
import ManageUsers from "./dashboard/pages/admin/ManageUsers";
import SkincareRoutine from "./page/SkincareRoutine";
import Order from "./page/Cart/Order";
import Shipper from './page/Shipper/Shipper'
import InProgess from "./page/Cart/InProgess";
import Delivered from "./page/Cart/Delivered";
import Returns from "./page/Cart/Returns";
import Shipperlayout from "./page/Shipper/ShipperLayout";
import ShipperReturns from "./page/Shipper/ShipperReturns";
import Pending from "./page/Cart/Pending";

function App() {
  const ProtectRoute = ({ children, requireRoles }: { children: JSX.Element, requireRoles?: string[] }) => {
    const token = localStorage.getItem('token')
    const decode = token ? jwtDecode<{ role: string }>(token) : null;
    const userRole = decode?.role

    if (requireRoles && !requireRoles.includes(userRole || '')) {
      return <Navigate to='/login' />
    }

    return children
  }

  const CheckLogin = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token')
    return token ? children : <Navigate to='/login' />
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="home" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="allproduct" element={<ProtectRoute requireRoles={["User", "Admin", ""]}><MainLayout><ShowAllProduct /></MainLayout></ProtectRoute>} />
        <Route path="/productdetail/:id" element={<ProtectRoute requireRoles={["User", "Admin", ""]}><MainLayout><ProductDetails /></MainLayout></ProtectRoute>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/quiz" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><QuizPage /></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/searchproduct" element={<ProtectRoute requireRoles={["User", "Admin", ""]}><MainLayout><SearchPage /></MainLayout></ProtectRoute>} />
        <Route path="/skincareroutine" element={<CheckLogin><ProtectRoute requireRoles={["User", "Admin"]}><MainLayout><SkincareRoutine /></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/" element={<Navigate to={'/home'} />} />

        <Route path="/cart" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><CartLayout><CartPage /></CartLayout></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/orders" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><CartLayout><Order /></CartLayout></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/pending" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><CartLayout><Pending /></CartLayout></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/in-progress" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><CartLayout><InProgess /></CartLayout></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/delivered" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><CartLayout><Delivered /></CartLayout></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/returns" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><CartLayout><Returns /></CartLayout></MainLayout></ProtectRoute></CheckLogin>} />

        {/* Shipper */}
        <Route path="/shipper">
          <Route index element={<Navigate to="delivery" replace />} />
          <Route path="delivery" element={<CheckLogin><ProtectRoute requireRoles={["Shipper"]}><MainLayout><Shipperlayout><Shipper /></Shipperlayout></MainLayout></ProtectRoute></CheckLogin>} />
          <Route path="returns" element={<CheckLogin><ProtectRoute requireRoles={["Shipper"]}><MainLayout><Shipperlayout><ShipperReturns /></Shipperlayout></MainLayout></ProtectRoute></CheckLogin>} />
        </Route>

        {/* Staff */}
        <Route path="/staff" element={
          <ProtectRoute requireRoles={["Staff"]} >
            <DashboardLayout />
          </ProtectRoute>
        }>
          <Route index element={<Navigate to="members" replace />} />
          <Route path="goods" element={<CheckLogin><ManageGoods /></CheckLogin>} />
          <Route path="members" element={<CheckLogin><ManageMembers /></CheckLogin>} />
          <Route path="orders/all" element={<CheckLogin><OrderList /></CheckLogin>} />
          <Route path="orders/confirm" element={<CheckLogin><OrderConfirm /></CheckLogin>} />
          <Route path="orders/refund" element={<CheckLogin><OrderRefund /></CheckLogin>} />
          <Route path="reviews" element={<CheckLogin><ManageReviews /></CheckLogin>} />
          <Route path="blogs" element={<CheckLogin><ManageBlogs /></CheckLogin>} />
          <Route path="voucher" element={<CheckLogin><CreateVoucher /></CheckLogin>} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectRoute requireRoles={["Admin"]} >
            <DashboardLayout />
          </ProtectRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CheckLogin><Dashboard /></CheckLogin>} />
          <Route path="users" element={<CheckLogin><ManageUsers /></CheckLogin>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes >
    </Suspense >
  );
}

export default App;
