import { Box, Button, Container, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { ChangeEvent, useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import { RegisterType } from "../utils/types";

function RegisterPage() {
    const [register, setRegister] = useState<RegisterType>({
        email: '',
        password: '',
        userName: '',
        phone: '',
        address: ''
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
            axios.post('', register)
                .then(res => {
                    console.log(res.data)
                    if (res.data === "success") {
                        toast.success("Register success")
                        console.log("Register success")
                        nav('/login')
                    } else {
                        toast.error("Register failed")
                        console.log("Register failed")
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
            <form onSubmit={handleRegister}>
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
                                <Box sx={{ marginBottom: '1rem', marginTop: '7rem' }}> <h1>Skincare Shop</h1></Box>
                                <img src={logo} alt="logo" style={{ width: '100%', height: 'auto' }} />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 6, md: 7 }}>
                            <Typography variant="h4" align="center" gutterBottom>
                                Register
                            </Typography>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                fullWidth
                                value={register.email}
                                onChange={handleChange}
                                sx={{ marginBottom: "2rem" }}
                                required
                            />
                            <TextField
                                label="User Name"
                                name="userName"
                                fullWidth
                                value={register.userName}
                                onChange={handleChange}
                                sx={{ marginBottom: "2rem" }}
                                required
                            />
                            <TextField
                                label="Phone"
                                name="phone"
                                fullWidth
                                value={register.phone}
                                onChange={handleChange}
                                sx={{ marginBottom: "2rem" }}
                                required
                            />
                            <TextField
                                label="Address"
                                name="address"
                                fullWidth
                                value={register.address}
                                onChange={handleChange}
                                sx={{ marginBottom: "2rem" }}
                                required
                            />
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={register.password}
                                onChange={handleChange}
                                sx={{ marginBottom: "2rem" }}
                                required
                            />
                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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
                                    onClick={() => nav('/login')}
                                    sx={{ marginTop: "2rem" }}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    type="submit"
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

export default RegisterPage