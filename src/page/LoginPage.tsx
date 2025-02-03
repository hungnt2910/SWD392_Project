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
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '40em',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 5 }} sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <img src={logo} alt="logo" style={{ width: '100%', height: 'auto' }} />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Typography variant="h4" align="center" gutterBottom>
                                Log in to Skincare Shop
                            </Typography>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                fullWidth
                                value={login.email}
                                onChange={handleChange}
                                sx={{ marginBottom: "2rem" }}
                                variant="standard"
                                required
                            />
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={login.password}
                                onChange={handleChange}
                                variant="standard"
                                required
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                gap: 2,
                                marginTop: '2rem'
                            }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{ width: '10rem' }}
                                >
                                    Login
                                </Button>
                                <Box>
                                    <Typography sx={{ textDecoration: 'underline', cursor: 'pointer', color: '#1565C0' }}>
                                        Forget Password?
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    marginTop: '1.5rem'
                                }}
                            >
                                <Typography sx={{ textDecoration: 'underline', cursor: 'pointer', color: '#4D4D4D' }} onClick={() => nav('/register')}>
                                    Create an account?
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box >
            </form>
        </Container >
    )
}

export default LoginPage