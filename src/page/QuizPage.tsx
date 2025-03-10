import React, { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import axios from "axios";
import { portserver } from "../utils/portserver";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { LuNotebookText } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import { Box } from "@mui/system";
import sensitiveSkin from '../assets/dry_skin.png'
import drySkin from '../assets/sensitive_skin.png'
import normalSkin from '../assets/normal_skin.png'
import oilSkin from '../assets/oily_skin.png'
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

type Quiz = {
    quizId: number;
    title: string;
    choices: { quizChoiceId: number, choice: String }[];
}

type SelectedAnswers = {
    quizId: number;
    quizChoiceId: number;
}

type SkinType = "Da dầu" | "Da nhạy cảm" | "Da thường" | "Da khô" | ''

const QuizPage = () => {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers[]>([]);
    const [quizs, setQuizs] = useState<Quiz[]>([]);
    const [result, setResult] = useState<SkinType>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const getAllQuiz = async () => {
        axios.get(`${portserver}/quiz`)
            .then(res => {
                setQuizs(res.data)
            })
            .catch(err => {
                console.log("get quiz error", err)
            })
    }

    useEffect(() => {
        getAllQuiz()
    }, [])

    const handleChange = (quizId: number, quizChoiceId: number) => {
        setSelectedAnswers((prev) => {
            const updatedAnswers = prev.filter(answer => answer.quizId !== quizId);
            return [...updatedAnswers, { quizId, quizChoiceId }];
        });
    }

    const handleSubmit = async () => {
        if (selectedAnswers.length !== quizs.length) {
            toast.error("Please answer all questions")
            return;
        }

        setIsLoading(true);
        setResult("");

        const formatedAns = selectedAnswers.map((a) => ({ quizId: a.quizId, quizAnswer: a.quizChoiceId }))

        try {
            await axios.post(`${portserver}/quiz`, formatedAns)
                .then(res => {
                    setResult(res.data)
                    setTimeout(() => {
                        setIsLoading(false);
                        setOpenDialog(true)
                    }, 1500)
                })
        } catch (error) {
            console.error("Error submitting answers: ", error);
        }
    };

    const getSkinTypeImage = (skinType: SkinType) => {
        const images = {
            "Da dầu": oilSkin,
            "Da nhạy cảm": sensitiveSkin,
            "Da thường": normalSkin,
            "Da khô": drySkin,
            "": "https://example.com/default-skin.jpg"
        };
        return images[skinType];
    };


    return (
        <>
            <Container maxWidth="md" style={{ marginTop: "20px" }}>
                <ToastContainer />
                {/* <Dialog open={openDialog || isLoading} onClose={() => setOpenDialog(false)} fullWidth>
                    <DialogTitle>
                        Result &nbsp;<LuNotebookText />
                    </DialogTitle>
                    <DialogContent>
                        {isLoading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                                <Typography variant="h6" gutterBottom>{result}</Typography>
                                <img
                                    src={getSkinTypeImage(result)}
                                    alt={result}
                                    style={{ width: 150, height: 150, borderRadius: 10, marginBottom: 10 }}
                                />
                            </Box>
                        )}
                    </DialogContent>
                    {!isLoading && (
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    )}
                </Dialog> */}

                <Dialog open={openDialog || isLoading} onClose={() => setOpenDialog(false)} fullWidth>
                    <DialogTitle sx={{ background: "linear-gradient(to right, #6a11cb, #2575fc)", color: "white", textAlign: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                            <Typography variant="h6" fontWeight="bold">
                                Kết quả của bạn
                            </Typography>
                            <LuNotebookText size={24} />
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {isLoading ? (
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={200}>
                                <CircularProgress color="secondary" />
                                <Typography mt={2}>Đang phân tích kết quả...</Typography>
                            </Box>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" p={2}>
                                    <Typography variant="h5" fontWeight="bold" color="#6a11cb" gutterBottom>
                                        {result}
                                    </Typography>
                                    <motion.img
                                        src={getSkinTypeImage(result)}
                                        alt={result}
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
                                    paddingX: 3,
                                    "&:hover": { background: "linear-gradient(to right, #5a0fc8, #2061db)" }
                                }}
                            >
                                Đóng
                            </Button>
                        </DialogActions>
                    )}
                </Dialog>
                <Typography variant="h4" sx={{ my: 3 }}>Thực hiện bài test để nhận biết loại da</Typography>
                {quizs?.map((q) => (
                    <Card key={q.quizId} style={{ marginBottom: "20px" }}>
                        <CardContent>
                            <Typography variant="h6">{q.title}</Typography>
                            <RadioGroup
                                value={selectedAnswers.find((a) => a.quizId === q.quizId)?.quizChoiceId || ""}
                                onChange={(e) => handleChange(q.quizId, q.choices.find((c) => c.quizChoiceId === Number(e.target.value))?.quizChoiceId || 0)}
                            >
                                {q.choices.map((option) => (
                                    <FormControlLabel key={option.quizChoiceId} value={option.quizChoiceId} control={<Radio />} label={option.choice} />
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))}
                <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
            </Container>
        </>
    );
};

export default QuizPage;