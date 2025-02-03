import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const NotFoundPage = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
        >
            <Typography variant="h1" sx={{ color: 'red' }} gutterBottom>
                404
            </Typography>
            <Typography variant="h5" color="textSecondary" gutterBottom>
                Oops! The page you are looking for does not exist.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/home">
                Back to Home
            </Button>
        </Box>
    );
};

export default NotFoundPage;
