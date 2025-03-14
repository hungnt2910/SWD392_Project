// import { Box, Container, Typography } from "@mui/material";
// import Grid from "@mui/material/Grid2";

// const Footer = () => {
//     return (
//         <Box component="footer" sx={{ backgroundColor: "#000", color: "#fff", py: 1 }}>
//             <Container>
//                 <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
//                     <Grid >
//                         <Typography variant="h6" fontWeight="bold">
//                             Skincare Store
//                         </Typography>
//                         <Typography variant="body2" sx={{ mt: 1 }}>
//                             Providing high quality, safe and effective skin care products.
//                         </Typography>
//                     </Grid>

//                     <Grid>
//                         <Typography variant="h6" fontWeight="bold">
//                             Contact
//                         </Typography>
//                         <Typography variant="body2" sx={{ mt: 1 }}>
//                             Address: 123 Đường ABC, TP.HCM
//                         </Typography>
//                         <Typography variant="body2">Email: support@skincare.com</Typography>
//                         <Typography variant="body2">Phone: 0123-456-789</Typography>
//                     </Grid>
//                 </Grid>

//                 <Box sx={{ textAlign: "center", mt: 4 }}>
//                     <Typography variant="body2">&copy; 2025 Skincare Store. All rights reserved.</Typography>
//                 </Box>
//             </Container>
//         </Box>
//     );
// };

// export default Footer;


import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

const Footer = () => {
    return (
        <Box component="footer" sx={{ backgroundColor: "#FFD1DC", color: "#8B3D69", py: 3 }}>
            <Container>
                <Grid container spacing={4} sx={{ justifyContent: "space-between" }}>
                    {/* Cột thương hiệu */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold">
                            Skincare Store
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                            Providing high quality, safe and effective skin care products.
                        </Typography>
                    </Grid>

                    {/* Cột liên hệ */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold">
                            Contact
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Address: 123 Đường ABC, TP.HCM
                        </Typography>
                        <Typography variant="body2" sx={{ "&:hover": { color: "#B0003A", cursor: "pointer" } }}>
                            Email: support@skincare.com
                        </Typography>
                        <Typography variant="body2" sx={{ "&:hover": { color: "#B0003A", cursor: "pointer" } }}>
                            Phone: 0123-456-789
                        </Typography>
                    </Grid>

                    {/* Cột Social Media */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" fontWeight="bold">
                            Follow us
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, "&:hover": { color: "#B0003A", cursor: "pointer" } }}>
                            Facebook
                        </Typography>
                        <Typography variant="body2" sx={{ "&:hover": { color: "#B0003A", cursor: "pointer" } }}>
                            Instagram
                        </Typography>
                        <Typography variant="body2" sx={{ "&:hover": { color: "#B0003A", cursor: "pointer" } }}>
                            TikTok
                        </Typography>
                    </Grid>
                </Grid>

                {/* Dòng bản quyền */}
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        &copy; 2025 Skincare Store. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
