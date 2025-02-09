import React, { useState, useEffect } from 'react';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  Paper,
  Tab,
  Tabs,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoodIcon from '@mui/icons-material/Mood';
import TimerIcon from '@mui/icons-material/Timer';
import AirIcon from '@mui/icons-material/Air';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuIcon from '@mui/icons-material/Menu';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HotelIcon from '@mui/icons-material/Hotel';
import ArticleIcon from '@mui/icons-material/Article';
import RegisterScreen from './components/RegisterScreen';
import ChatInterface from './components/ChatInterface';
import MoodTracker from './components/MoodTracker';
import MeditationTimer from './components/MeditationTimer';
import BreathingExercises from './components/BreathingExercises';
import GratitudeJournal from './components/GratitudeJournal';
import PositiveAffirmations from './components/PositiveAffirmations';
import GoalTracker from './components/GoalTracker';
import SleepJournal from './components/SleepJournal';
import WellnessTips from './components/WellnessTips';
import { createAppTheme, themeNames } from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PaletteIcon from '@mui/icons-material/Palette';
import { Tooltip } from '@mui/material';

const theme = createAppTheme('light', 'calm');

function TabPanel({ children, value, index }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      sx={{ p: { xs: 2, sm: 3 } }}
    >
      {value === index && children}
    </Box>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });
  const [themePalette, setThemePalette] = useState(() => {
    const savedPalette = localStorage.getItem('themePalette');
    return savedPalette || 'calm';
  });
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('themePalette', themePalette);
  }, [themePalette]);

  const theme = React.useMemo(
    () => createAppTheme(mode, themePalette),
    [mode, themePalette]
  );

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setUser(null);
    handleMenuClose();
  };

  const handleThemeMenuOpen = (event) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchor(null);
  };

  const handleThemeChange = (palette) => {
    setThemePalette(palette);
    handleThemeMenuClose();
  };

  const tabs = [
    { label: 'Chat', icon: <ChatIcon />, component: <ChatInterface user={user} /> },
    { label: 'Mood', icon: <MoodIcon />, component: <MoodTracker /> },
    { label: 'Meditate', icon: <TimerIcon />, component: <MeditationTimer /> },
    { label: 'Breathe', icon: <AirIcon />, component: <BreathingExercises /> },
    { label: 'Gratitude', icon: <FavoriteIcon />, component: <GratitudeJournal /> },
    { label: 'Affirmations', icon: <AutoAwesomeIcon />, component: <PositiveAffirmations /> },
    { label: 'Goals', icon: <TrackChangesIcon />, component: <GoalTracker /> },
    { label: 'Sleep', icon: <HotelIcon />, component: <SleepJournal /> },
    { label: 'Tips', icon: <ArticleIcon />, component: <WellnessTips /> }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!user ? (
        <RegisterScreen onRegister={handleRegister} />
      ) : (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar position="fixed" color="primary" elevation={0}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                HealMind AI
              </Typography>
              <IconButton
                onClick={handleMenuClick}
                color="inherit"
              >
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {user.name?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    Signed in as {user.name}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                  <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit">
                    {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Change color theme">
                  <IconButton
                    onClick={handleThemeMenuOpen}
                    color="inherit"
                  >
                    <PaletteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
            <Paper sx={{ bgcolor: 'primary.main' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTab-root': {
                    color: 'primary.contrastText',
                    opacity: 0.7,
                    '&.Mui-selected': {
                      opacity: 1,
                    },
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    label={!isMobile && tab.label}
                    icon={tab.icon}
                    iconPosition={isMobile ? "top" : "start"}
                  />
                ))}
              </Tabs>
            </Paper>
          </AppBar>

          <Menu
            anchorEl={themeMenuAnchor}
            open={Boolean(themeMenuAnchor)}
            onClose={handleThemeMenuClose}
          >
            {themeNames.map((name) => (
              <MenuItem
                key={name}
                onClick={() => handleThemeChange(name)}
                selected={themePalette === name}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </MenuItem>
            ))}
          </Menu>

          <Container sx={{ mt: 12, mb: 4 }}>
            {tabs.map((tab, index) => (
              <TabPanel key={index} value={activeTab} index={index}>
                {tab.component}
              </TabPanel>
            ))}
          </Container>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default App;