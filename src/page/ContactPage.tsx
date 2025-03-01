import { Container, Grid, Typography, Card, CardContent, Box } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";

const ContactPage = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Contact
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <CallIcon color="primary" />
                                <Typography variant="h6">Call To Us</Typography>
                            </Box>
                            <Typography variant="body1" mt={1}>
                                We are available 24/7, 7 days a week.
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" mt={1}>
                                Phone: +8801611112222
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Card sx={{ height: "100%" }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={2}>
                                <EmailIcon color="primary" />
                                <Typography variant="h6">Write To Us</Typography>
                            </Box>
                            <Typography variant="body1" mt={1}>
                                Fill out our form and we will contact you within 24 hours.
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" mt={1}>
                                Email: customer@exclusive.com
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                                Email: support@exclusive.com
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ContactPage;


