import { Box, Button, Container, TextField, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import { ChangeEvent, useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';
import { RegisterType } from "../utils/types";
import { portserver } from "../utils/portserver";


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
                                Create An Account
                            </Typography>
                            <TextField
                                label="Email"
                                type="email"
                                name="email"
                                fullWidth
                                value={register.email}
                                onChange={handleChange}
                                sx={{ marginBottom: "1rem" }}
                                variant="standard"
                                required
                            />
                            <TextField
                                label="User Name"
                                name="username"
                                fullWidth
                                value={register.username}
                                onChange={handleChange}
                                sx={{ marginBottom: "1rem" }}
                                variant="standard"
                                required
                            />
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                value={register.password}
                                onChange={handleChange}
                                sx={{ marginBottom: "1rem" }}
                                variant="standard"
                                required
                            />
                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                sx={{ marginBottom: "1rem" }}
                                value={confirmPassword}
                                variant="standard"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                gap: 2,
                            }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    type="submit"
                                >
                                    Create Account
                                </Button>
                                {/* login by gg */}

                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    marginTop: '1rem'
                                }}
                            >
                                <Typography sx={{ color: '#757575' }}>
                                    Already have an account? &nbsp; &nbsp;
                                </Typography>
                                <Typography sx={{ textDecoration: 'underline', cursor: 'pointer', color: '#4D4D4D' }} onClick={() => nav('/login')}>
                                    Login
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box >
            </form>
        </Container >
    )
}

export default RegisterPage