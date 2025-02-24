import * as React from 'react';
import { styled } from '@mui/material/styles';
//import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
//import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
//import Typography from '@mui/material/Typography';
//import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import StaffMenuContent from '../layouts/StaffMenuContent';
//import OptionsMenu from './OptionsMenu';

const drawerWidth = 240;


const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >

      <Box sx={{display: 'flex' ,p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <p>Menu</p>
      </Box>


      {/* <Box
        sx={{
          ,
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <SelectContent />
      </Box>
      <Divider /> */}
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <StaffMenuContent />

      </Box>

    </Drawer>
  );
}
