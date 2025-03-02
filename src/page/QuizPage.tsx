import React, { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
import axios from "axios";
import { portserver } from "../utils/portserver";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { LuNotebookText } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";

type Quiz = {
    quizId: number;
    title: string;
    choices: { quizChoiceId: number, choice: String }[];
}

type SelectedAnswers = {
    quizId: number;
    quizChoiceId: number;
}

const QuizPage = () => {
    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers[]>([]);
    const [quizs, setQuizs] = useState<Quiz[]>([]);
    const [result, setResult] = useState<string>("");
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

    return (
        <>
            <Container maxWidth="md" style={{ marginTop: "20px" }}>
                <ToastContainer />
                <Dialog open={openDialog || isLoading} onClose={() => setOpenDialog(false)} fullWidth>
                    <DialogTitle>Result &nbsp;<LuNotebookText /></DialogTitle>
                    <DialogContent>
                        {isLoading ? (
                            <Typography>Loading...</Typography>
                        ) :
                            <Typography>{result}</Typography>
                        }
                    </DialogContent>
                    {!isLoading && (
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    )}
                </Dialog>

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