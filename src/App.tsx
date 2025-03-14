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
import SkincareRoutine from "./page/SkincareRoutine";
import Order from "./page/Cart/Order";
import Shipper from './page/Shipper/Shipper'

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
        <Route path="/cart" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><CartLayout><CartPage /></CartLayout></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/order" element={<CheckLogin><ProtectRoute requireRoles={["User"]}><MainLayout><CartLayout><Order /></CartLayout></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/skincareroutine" element={<CheckLogin><ProtectRoute requireRoles={["User", "Admin"]}><MainLayout><SkincareRoutine /></MainLayout></ProtectRoute></CheckLogin>} />
        <Route path="/" element={<Navigate to={'/home'} />} />

        {/* Shipper */}
        <Route path="/shipper" element={<CheckLogin><ProtectRoute requireRoles={["Shipper"]}><MainLayout><Shipper /></MainLayout></ProtectRoute></CheckLogin>} />

        {/* Staff */}
        <Route path="/staff" element={
          <ProtectRoute requireRoles={["Staff"]} >
            <DashboardLayout />
          </ProtectRoute>
        }>
          <Route index element={<Navigate to="members" replace />} />
          <Route path="goods" element={<CheckLogin><ManageGoods /></CheckLogin>} />
          <Route path="members" element={<CheckLogin><ManageMembers /></CheckLogin>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes >
    </Suspense >
  );
}

export default App;
