import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./page/MainLayout";
import ShowAllProduct from "./page/ShowAllProduct";
import ProductDetails from "./page/ProductDetails";
import ContactPage from "./page/ContactPage";

import DashboardRoutes from "./dashboard/routes/DashboardRoutes";
import QuizPage from "./page/QuizPage"
import SearchPage from "./page/SearchPage"
import CartLayout from "./page/Cart/CartLayout"

//staff:
import ManageGoods from "./dashboard/pages/staff/ManageGoods";
import ManageMembers from "./dashboard/pages/staff/ManageMembers";
import OrderList from "./dashboard/pages/staff/OrderList";
import OrderConfirm from "./dashboard/pages/staff/OrderConfirm";
import ManageReviews from "./dashboard/pages/staff/ManageReviews";
import ManageBlogs from "./dashboard/pages/staff/ManageBlogs";
import CreateVoucher from "./dashboard/pages/staff/CreateVoucher";
//admin:
import Dashboard from "./dashboard/pages/admin/Dashboard";
import ManageUsers from "./dashboard/pages/admin/ManageUsers";

const LoginPage = lazy(() => import("./page/LoginPage"))
const RegisterPage = lazy(() => import("./page/RegisterPage"))
const HomePage = lazy(() => import("./page/Home/HomePage"))
const NotFoundPage = lazy(() => import("./page/NotFoundPage"))
const CartPage = lazy(() => import("./page/CartPage"))

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("token") ? true : false;
  };

  const ProtectRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <LoginPage />;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/allproduct" element={<MainLayout><ShowAllProduct /></MainLayout>} />
        <Route path="/productdetail/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/quiz" element={
          <ProtectRoute>
            <MainLayout><QuizPage /></MainLayout>
          </ProtectRoute>
        } />

        <Route path="/searchproduct" element={<MainLayout><SearchPage /></MainLayout>} />

        <Route path="/cart" element={
          <ProtectRoute>
            <MainLayout><CartLayout><CartPage /></CartLayout></MainLayout>
          </ProtectRoute>
        } />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />

        <Route path="/" element={<Navigate to={'/home'} />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
