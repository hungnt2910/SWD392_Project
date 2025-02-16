import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { ChangeEvent, useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginType } from "../utils/types";
import { portserver } from "../utils/portserver";
import background from '../assets/cosmetic-background.jpg';
import React from "react";
import { VisibilityOff, Visibility } from "@mui/icons-material";


function LoginPage() {
    const [login, setLogin] = useState<LoginType>({
        email: '',
        password: ''
    })
    const [mess, setMesss] = useState<string>('')
    const nav = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setLogin({
            ...login,
            [name]: value
        })
    }

    const [password, setPassword] = React.useState("");
    const [email, setEmail] = React.useState("");


    const validatePassword = (inputPassword: string): boolean => {
        const regex = /^(?!\d)[A-Za-z\d@$!%*?&#]{8,}$/;
        return regex.test(inputPassword);
    };

    const validateEmail = (inputEmail: string): boolean => {
        const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
        return regex.test(inputEmail);
    };

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`${portserver}auth/signin`, login)
            .then(res => {
                if (res.data?.accessToken) {
                    toast.success("Login success", {
                        autoClose: 1500,
                        onClose: () => nav('/home')
                    })
                    localStorage.setItem("token", JSON.stringify(res.data.accessToken))
                } else {
                    toast.error("Login failed")
                }
            })
            .catch(err => {
                console.log(err)
                toast.error("Login failed")
            })
    }


    return (
        <Container
            maxWidth={false} // Full width
            disableGutters // Remove padding
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100vw', // Full viewport width
                height: '100vh', // Full viewport height
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <ToastContainer />

            {/* Centered Login Form */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '400px', // Adjust width for better centering
                    padding: '2rem',
                }}
            >
                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Log In
                    </Typography>

                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="abc@domain.com"
                        fullWidth
                        value={email}
                        //onChange={handleChange}
                        sx={{ marginBottom: "2rem" }}
                        variant="standard"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!email && !validateEmail(email)}
                        helperText={
                            email && !validateEmail(email)
                                ? "Địa chỉ email không hợp lệ"
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
                                ? "Mật khẩu phải có tối thiểu 8 kí tự và không bắt đầu bằng số."
                                : ""
                        }
                        slotProps={{
                            input: {
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
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        sx={{ marginTop: "2rem" }}
                    >
                        Login
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            textAlign: 'center',
                            justifyContent: 'center',
                            marginTop: '1.5rem'
                        }}
                    >
                        <Typography
                            sx={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                color: '#1565C0'
                            }}
                        >
                            Forgot Password?
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            textAlign: 'center',
                            justifyContent: 'center',
                            marginTop: '1.5rem'
                        }}
                    >
                        <Typography
                            sx={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                color: '#4D4D4D'
                            }}
                            onClick={() => nav('/register')}
                        >
                            Create an account?
                        </Typography>
                    </Box>
                </form>
            </Box>
        </Container>
    );

}

export default LoginPage