import { Route, Routes } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import HomePage from "./page/HomePage"
import RegisterPage from "./page/RegisterPage"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
