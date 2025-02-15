import { Box, Button, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { ChangeEvent, useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import background from '../assets/cosmetic-background.jpg';
import { RegisterType } from "../utils/types";
import { portserver } from "../utils/portserver";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";


function RegisterPage() {
    const [register, setRegister] = useState<RegisterType>({
        email: '',
        password: '',
        username: '',
    })

    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const nav = useNavigate()

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (register.password !== confirmPassword) {
                toast.error("Password not match")
                return
            }
            axios.post(`${portserver}auth/signup`, register)
                .then(res => {
                    if (res.data.message === "Register success") {
                        toast.success("Register success")
                        nav('/login')
                    } else {
                        toast.error("Register failed")
                    }
                })
                .catch(err => {
                    console.log(err)
                    toast.error("Register failed")
                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRegister({
            ...register,
            [name]: value
        })
    }

    //add eye-icon to password
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);


    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    //validate username and password
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [email, setEmail] = React.useState("");


    const validateUsername = (inputUsername: string): boolean => {
        const regex = /^(?!\d)[A-Za-z\d@$!%*?&#]{8,}$/;
        return regex.test(inputUsername);
    };

    const validatePassword = (inputPassword: string): boolean => {
        const regex = /^(?!\d)[A-Za-z\d@$!%*?&#]{8,}$/;
        return regex.test(inputPassword);
    };

    const validateEmail = (inputEmail: string): boolean => {
        const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
        return regex.test(inputEmail);
    };

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

            {/* Centered Form */}
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
                <form onSubmit={handleRegister} style={{ width: '100%' }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Create Your Account
                    </Typography>

                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="abc@domain.com"
                        fullWidth
                        value={email}
                        //onChange={handleChange}
                        sx={{ marginBottom: "1rem" }}
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
                        label="User Name"
                        name="username"
                        fullWidth
                        id="username"
                        sx={{ marginBottom: "1rem" }}
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={!!username && !validateUsername(username)}
                        helperText={
                            username && !validateUsername(username)
                                ? "Tên đăng nhập phải có tối thiểu 8 kí tự và không bắt đầu bằng số."
                                : ""
                        }
                        variant="standard"

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
                    <TextField
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        sx={{ marginBottom: "1rem" }}
                        value={confirmPassword}
                        variant="standard"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                        required
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                        sx={{ marginTop: "1rem" }}
                    >
                        Create Account
                    </Button>

                    <Box
                        sx={{
                            display: 'flex',
                            textAlign: 'center',
                            justifyContent: 'center',
                            marginTop: '1rem'
                        }}
                    >
                        <Typography sx={{ color: '#757575' }}>
                            Already have an account? &nbsp;
                        </Typography>
                        <Typography
                            sx={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                color: '#4D4D4D'
                            }}
                            onClick={() => nav('/login')}
                        >
                            Login
                        </Typography>
                    </Box>
                </form>
            </Box>
        </Container>
    );

}

export default RegisterPage