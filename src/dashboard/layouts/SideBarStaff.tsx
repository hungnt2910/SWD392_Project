import React from 'react';
import StaffMenuContent from './StaffMenuContent';
import { Grid, Box } from '@mui/material';

function SideBarStaff({ children }: { children: React.ReactNode }) {
    return (
        <Grid container height="100vh">
            <Grid item xs={2.5} sx={{ bgcolor: 'grey.200', p: 2 }}>
                <StaffMenuContent />
            </Grid>

            <Grid item xs={9.5} sx={{ p: 3 }}>
                <Box>{children}</Box>
            </Grid>
        </Grid>
    );
}

export default SideBarStaff;
