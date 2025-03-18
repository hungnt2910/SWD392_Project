import { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, Chip, Container, Divider, CircularProgress, Avatar
} from '@mui/material';
import axios from 'axios';
import { FaSun, FaMoon } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import { portserver } from '../utils/portserver';

interface User {
    id: number;
    skinType: string;
    concerns: string;
    morningRoutine: string[];
    eveningRoutine: string[];
    recommendedProducts: string[];
    user: {
        id: string;
        username: string;
        email: string;
    };
}

function SkincareRoutine() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;

    useEffect(() => {
        axios.get(`${portserver}/skincare-route/${decode?.userId}`)
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching user routines:', error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);


    return (
        <Container>
            <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold" sx={{ mt: 3, color: '#333' }}>
                Your Personalized Skincare Routine ✨
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <CircularProgress size={60} thickness={4} color="primary" />
                </Box>
            ) : (
                users.map(user => (
                    <Box key={user.id} sx={{ my: 3 }}>
                        <Card sx={{
                            background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                            borderRadius: "16px",
                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            p: 3
                        }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                    <Avatar sx={{ bgcolor: "#3498db", mr: 2 }}>{user.user.username[0]}</Avatar>
                                    <Typography variant="h5" fontWeight="bold">{user.user.username} - {user.skinType} Skin</Typography>
                                </Box>
                                <Typography variant="body1" color="textSecondary" textAlign="center" gutterBottom>
                                    Concerns: <b>{user.concerns}</b>
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>

                                    <Box sx={{ width: '45%', textAlign: 'right', p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
                                            <Typography variant="h6" fontWeight="bold" sx={{ mr: 1 }}>Morning Routine</Typography>
                                            <FaSun color="#FFA500" size={28} />
                                        </Box>
                                        {user.morningRoutine.map((item, index) => (
                                            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                                                ☀️ Step {index + 1}: <b>{item}</b>
                                            </Typography>
                                        ))}
                                    </Box>

                                    <Divider orientation="vertical" flexItem sx={{ mx: 3, backgroundColor: '#000', width: '2px' }} />

                                    <Box sx={{ width: '45%', textAlign: 'left', p: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <FaMoon color="#483D8B" size={28} />
                                            <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>Evening Routine</Typography>
                                        </Box>
                                        {user.eveningRoutine.map((item, index) => (
                                            <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                                                🌙 Step {index + 1}: <b>{item}</b>
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Recommended Products */}
                                <Typography variant="h6" sx={{ mt: 3, textAlign: 'center' }}>Recommended Products:</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mt: 2 }}>
                                    {user.recommendedProducts.map((item, index) => (
                                        <Chip key={index} label={item} sx={{
                                            mr: 1, mb: 1,
                                            bgcolor: 'rgba(52, 152, 219, 0.2)',
                                            fontWeight: 'bold'
                                        }} />
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                ))
            )}
        </Container>
    );
}

export default SkincareRoutine;
