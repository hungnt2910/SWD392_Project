import * as React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { portserver } from "../../../utils/portserver";



function DashboardLogin() {

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();


  const validatePassword = (inputPassword: string): boolean => {
    const regex = /^(?!\d)[A-Za-z\d@$!%*?&#]{8,}$/;
    return regex.test(inputPassword);
  };

  const validateEmail = (inputEmail: string): boolean => {
    const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(inputEmail);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    const loginData = {
      email,
      password,
    };
  
    axios
      .post(`${portserver}/auth/signin`, loginData)
      .then((res) => {
        console.log("API response:", res.data);
        
        if (res.data.accessToken !== undefined && res.data.accessToken !== null) {
          const accessToken = res.data.accessToken;
          
          localStorage.setItem("token", accessToken);
          
          let roleId = 0;
          let roleName;
          let dashboardPath;
          
          if (email.startsWith("admin")) {
            roleId = 1;
            roleName = "admin";
            dashboardPath = "/dashboard/admin";
          } else if (email.startsWith("staff")) {
            roleId = 3;
            roleName = "staff";
            dashboardPath = "/dashboard/staff";
          } else if (email.startsWith("shipper")) {
            roleId = 4;
            roleName = "shipper";
            dashboardPath = "/dashboard/shipper";
          } else {
            roleId = 3;
            roleName = "staff";
            dashboardPath = "/dashboard/staff";
          }
          
          localStorage.setItem("roleId", roleId.toString());
          localStorage.setItem("userRole", roleName);
          
          toast.success(`Login successful as ${roleName}`, {
            autoClose: 1500,
            onClose: () => nav(dashboardPath),
          });
        } else {
          toast.error("Login failed - Invalid response");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        
        if (err.response) {
          toast.error(`Login failed: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          toast.error("No response from server. Please check your connection.");
        } else {
          toast.error("Login failed - Request error");
        }
        
        setLoading(false);
      });
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #0a1929 0%, #1a2942 50%, #1e3a57 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ToastContainer />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Dashboard Login
          </Typography>

          <TextField
            label="Email"
            type="email"
            name="email"
            placeholder="abc@domain.com"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: "2rem" }}
            variant="standard"
            required
            error={!!email && !validateEmail(email)}
            helperText={
              email && !validateEmail(email)
                ? "Invalid email address format"
                : ""
            }
          />

          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="off"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "1rem" }}
            variant="standard"
            required
            error={!!password && !validatePassword(password)}
            helperText={
              password && !validatePassword(password)
                ? "Password must be at least 8 characters and not start with a number"
                : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{ marginTop: "2rem" }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ color: "white", mr: 1 }} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <Box
            sx={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              marginTop: "1.5rem",
            }}
          >
            <Typography
              sx={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "#1565C0",
              }}
            >
              Forgot Password?
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              textAlign: "center",
              justifyContent: "center",
              marginTop: "1.5rem",
            }}
          >
            <Typography
              sx={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "#4D4D4D",
              }}
              onClick={() => nav("/home")}
            >
              Return to Main Website
            </Typography>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default DashboardLogin;
