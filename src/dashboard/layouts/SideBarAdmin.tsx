import React from 'react';
import { Grid, Box } from '@mui/material';
import AdminMenuContent from './AdminMenuContent';


function SideBarAdmin({ children }: { children: React.ReactNode }) {
    return (
        <Grid container height="100vh">
            <Grid item xs={2.5} sx={{ bgcolor: 'grey.200', p: 2 }}>
                <AdminMenuContent />
            </Grid>

            <Grid item xs={9.5} sx={{ p: 3 }}>
                <Box>{children}</Box>
            </Grid>
        </Grid>
    );
}

export default SideBarAdmin