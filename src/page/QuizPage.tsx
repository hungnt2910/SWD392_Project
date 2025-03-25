import React, { useEffect, useState } from "react";
import {
    Container, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel,
    Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Box
} from "@mui/material";
import axios from "axios";
import { portserver } from "../utils/portserver";
import { LuNotebookText } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import sensitiveSkin from '../assets/dry_skin.png';
import drySkin from '../assets/sensitive_skin.png';
import normalSkin from '../assets/normal_skin.png';
import oilSkin from '../assets/oily_skin.png';
import { jwtDecode } from "jwt-decode";

type Quiz = {
    quizId: number;
    title: string;
    choices: { quizChoiceId: number; choice: string }[];
};

type SelectedAnswer = {
    quizId: number;
    quizChoiceId: number;
};

type SkinType =
    | { type: "Da dầu", skinTypeId: 2 }
    | { type: "Da nhạy cảm", skinTypeId: 4 }
    | { type: "Da thường", skinTypeId: 1 }
    | { type: "Da khô", skinTypeId: 1 }
    | { type: "", skinTypeId: 5 };


const QuizPage: React.FC = () => {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([]);
    const [quizs, setQuizs] = useState<Quiz[]>([]);
    const [result, setResult] = useState<SkinType | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const token = localStorage.getItem('token');
    const decode = token ? jwtDecode<{ userId: number }>(token) : null;

    useEffect(() => {
        axios.get(`${portserver}/quiz`)
            .then(res => setQuizs(res.data))
            .catch(err => console.log("get quiz error", err));
    }, []);

    const handleChange = (quizId: number, quizChoiceId: number) => {
        setSelectedAnswers(prev => {
            const updatedAnswers = prev.filter(answer => answer.quizId !== quizId);
            return [...updatedAnswers, { quizId, quizChoiceId }];
        });
    };

    const handleSubmit = () => {
        if (selectedAnswers.length !== quizs.length) {
            toast.error("Please answer all questions")
            return;
        }

        setIsLoading(true);
        setResult(null);

        const formatedAns = selectedAnswers.map((a) => ({ quizId: a.quizId, quizAnswer: a.quizChoiceId }))

        axios.post(`${portserver}/quiz/${decode?.userId}`, formatedAns)
            .then(res => {
                localStorage.setItem('skinTypeId', res.data.skinTypeId)
                setResult(res.data.type)
                setTimeout(() => {
                    setIsLoading(false);
                    setOpenDialog(true);
                    setSelectedAnswers([])
                }, 1500)
            })
            .catch(e => {
                toast.error(e.response.data.message)
                setTimeout(() => {
                    setIsLoading(false);
                    setSelectedAnswers([])
                }, 1000)
            })

    };

    const getSkinTypeImage = (skinType: SkinType): string => {
        const images: Record<string, string> = {
            "Da dầu": oilSkin,
            "Da nhạy cảm": sensitiveSkin,
            "Da thường": normalSkin,
            "Da khô": drySkin,
            "": "https://example.com/default-skin.jpg"
        };
        return images[skinType.type] || images[""];
    };

    console.log(result)
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <ToastContainer />
            <Dialog open={openDialog || isLoading} onClose={() => setOpenDialog(false)} fullWidth>
                <DialogTitle sx={{
                    background: "linear-gradient(to right, #6a11cb, #2575fc)",
                    color: "white",
                    textAlign: "center"
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                        <Typography variant="h6" fontWeight="bold">Result</Typography>
                        <LuNotebookText size={24} />
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {isLoading ? (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={200}>
                            <CircularProgress color="secondary" />
                            <Typography mt={2}>processing...</Typography>
                        </Box>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" p={2}>
                                <Typography variant="h5" fontWeight="bold" color="#6a11cb" gutterBottom>{result?.type}</Typography>
                                <motion.img
                                    src={result ? getSkinTypeImage(result) : "https://example.com/default-skin.jpg"}
                                    alt={result?.type || "Unknown"}
                                    style={{ width: 150, height: 150, borderRadius: 10, marginBottom: 10 }}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                            </Box>
                        </motion.div>
                    )}
                </DialogContent>
                {!isLoading && (
                    <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                        <Button
                            onClick={() => setOpenDialog(false)}
                            variant="contained"
                            sx={{
                                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                                color: "white",
                                px: 3,
                                "&:hover": { background: "linear-gradient(to right, #5a0fc8, #2061db)" }
                            }}
                        >
                            Đóng
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
            <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>Take the quiz to better understand your skin.</Typography>
            {quizs.map(q => (
                <motion.div key={q.quizId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>{q.title}</Typography>
                            <RadioGroup
                                value={selectedAnswers.find(a => a.quizId === q.quizId)?.quizChoiceId || ""}
                                onChange={(e) => handleChange(q.quizId, Number(e.target.value))}
                            >
                                {q.choices.map(option => (
                                    <FormControlLabel key={option.quizChoiceId} value={option.quizChoiceId} control={<Radio />} label={option.choice} />
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
            <Button variant="contained" onClick={handleSubmit} sx={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "white",
                display: "block",
                mx: "auto",
                mt: 3,
                px: 5,
                "&:hover": { background: "linear-gradient(to right, #5a0fc8, #2061db)" }
            }}>Submit</Button>
        </Container>
    );
};

export default QuizPage;