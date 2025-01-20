import { Box, Button, Container, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { ChangeEvent, useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoginType } from "../utils/types";
import logo from '../assets/logo.png';

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

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(login)
        axios.post('', login)
            .then(res => {
                console.log(res.data)
                if (login.email === res.data[0]?.email && login.password === res.data[0]?.password) {
                    toast.success("Login success")
                    console.log("Login success")
                    nav('/home')
                } else {
                    toast.error("Login failed")
                    console.log("Login failed")
                }
            })
            .catch(err => {
                console.log(err)
                toast.error("Login failed")
            })
    }

    const handleRegister = () => {
        nav('/register')
    }

    return (
        <Container
            maxWidth="md"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '100vh',
            }}
        >
            <ToastContainer />
            <form onSubmit={handleLogin}>
                <Box
                    sx={{
                        padding: 4,
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '40em',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 6, md: 5 }}>
                            <Box sx={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                                <Box sx={{ marginBottom: '1rem' }}> <h1>Skincare Shop</h1></Box>
                                <img src={logo} alt="logo" style={{ width: '100%', height: 'auto' }} />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 6, md: 7 }}>
                            <Typography variant="h4" align="center" gutterBottom>
                                Login
                            </Typography>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                fullWidth
                                value={login.email}
                                onChange={handleChange}
                                sx={{ marginBottom: "2rem" }}
                                required
                            />
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={login.password}
                                onChange={handleChange}
                                required
                            />
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                            }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    type="submit"
                                    sx={{ marginTop: "2rem" }}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={handleRegister}
                                    sx={{ marginTop: "2rem" }}
                                >
                                    Register
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box >
            </form>
        </Container >
    )
}

export default LoginPage