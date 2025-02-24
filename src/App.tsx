import { Route, Routes, Navigate } from "react-router-dom"
import { Suspense, lazy } from "react"
import MainLayout from "./page/MainLayout"
import ShowAllProduct from "./page/ShowAllProduct"
import Dashboard from "./dashboard/Dashboard";
import StaffLayout from "./dashboard/layouts/StaffLayout";
import ManageMembers from "./dashboard/pages/staff/ManageMembers";

const LoginPage = lazy(() => import("./page/LoginPage"))
const RegisterPage = lazy(() => import("./page/RegisterPage"))
const HomePage = lazy(() => import("./page/Home/HomePage"))
const NotFoundPage = lazy(() => import("./page/NotFoundPage"))
const CartPage = lazy(() => import("./page/CartPage"))

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("token") ? true : false
  }

  const ProtectRoute = ({ children }: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <LoginPage />
  }

  return (
    
    <Suspense fallback={<div>Loading...</div>}>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/allproduct" element={<MainLayout><ShowAllProduct /></MainLayout>} />

        <Route path="/dashboard/staff" element={<StaffLayout />}>
          <Route path="members" element={<ManageMembers/>} />
        </Route>
        
        <Route path="/cart" element={
          <ProtectRoute>
            <MainLayout><CartPage /></MainLayout>
          </ProtectRoute>
        } />

        <Route path="/" element={<Navigate to={'/home'} />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
