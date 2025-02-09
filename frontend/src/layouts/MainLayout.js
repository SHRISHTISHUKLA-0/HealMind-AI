import React from 'react';
import { Box, CssBaseline, Container, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const LayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    background: theme.palette.background.default,
    minHeight: '100vh'
}));

const LayoutContent = styled('div')(({ theme, open, isMobile }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: isMobile ? 0 : -240,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const MainLayout = ({ children }) => {
    const [open, setOpen] = React.useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { isAuthenticated } = useAuth();

    React.useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <LayoutRoot>
            <CssBaseline />
            <Navbar 
                open={open} 
                handleDrawerToggle={handleDrawerToggle}
                isMobile={isMobile}
            />
            {isAuthenticated && (
                <Sidebar 
                    open={open} 
                    handleDrawerToggle={handleDrawerToggle}
                    isMobile={isMobile}
                />
            )}
            <LayoutContent open={open} isMobile={isMobile}>
                <Container maxWidth="xl" sx={{ mt: 10 }}>
                    <Box component="main">
                        {children}
                    </Box>
                </Container>
            </LayoutContent>
        </LayoutRoot>
    );
};

export default MainLayout;
