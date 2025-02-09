import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    IconButton,
} from '@mui/material';
import {
    Notifications,
    Palette,
    VolumeUp,
    Security,
    Language,
    AccessTime,
    Download,
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';

const Settings = () => {
    const { mode, themePalette, toggleMode, changeTheme, availableThemes } = useTheme();
    const { user, updateProfile } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('en');
    const [timezone, setTimezone] = useState('UTC');
    const [volume, setVolume] = useState(70);
    const [showAlert, setShowAlert] = useState(false);

    const handleSave = async () => {
        try {
            await updateProfile({
                settings: {
                    notifications,
                    language,
                    timezone,
                    volume,
                },
            });
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const handleExportData = async () => {
        try {
            // Implement data export logic
            console.log('Exporting user data...');
        } catch (error) {
            console.error('Failed to export data:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>

            {showAlert && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    Settings saved successfully!
                </Alert>
            )}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Appearance
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Dark Mode"
                                secondary="Toggle dark/light theme"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={mode === 'dark'}
                                    onChange={toggleMode}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Theme"
                                secondary="Choose your preferred color theme"
                            />
                            <ListItemSecondaryAction>
                                <FormControl variant="outlined" size="small">
                                    <Select
                                        value={themePalette}
                                        onChange={(e) => changeTheme(e.target.value)}
                                    >
                                        {availableThemes.map((theme) => (
                                            <MenuItem key={theme} value={theme}>
                                                {theme}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Preferences
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Notifications"
                                secondary="Enable push notifications"
                            />
                            <ListItemSecondaryAction>
                                <Switch
                                    edge="end"
                                    checked={notifications}
                                    onChange={(e) => setNotifications(e.target.checked)}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Language"
                                secondary="Choose your preferred language"
                            />
                            <ListItemSecondaryAction>
                                <FormControl variant="outlined" size="small">
                                    <Select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <MenuItem value="en">English</MenuItem>
                                        <MenuItem value="es">Spanish</MenuItem>
                                        <MenuItem value="fr">French</MenuItem>
                                        <MenuItem value="de">German</MenuItem>
                                    </Select>
                                </FormControl>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Timezone"
                                secondary="Set your local timezone"
                            />
                            <ListItemSecondaryAction>
                                <FormControl variant="outlined" size="small">
                                    <Select
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                    >
                                        <MenuItem value="UTC">UTC</MenuItem>
                                        <MenuItem value="EST">EST</MenuItem>
                                        <MenuItem value="PST">PST</MenuItem>
                                        <MenuItem value="IST">IST</MenuItem>
                                    </Select>
                                </FormControl>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                            <ListItemText
                                primary="Sound Volume"
                                secondary="Adjust meditation sounds volume"
                            />
                            <ListItemSecondaryAction>
                                <TextField
                                    type="number"
                                    size="small"
                                    value={volume}
                                    onChange={(e) => setVolume(e.target.value)}
                                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                                    sx={{ width: 80 }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Data & Privacy
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Export Data"
                                secondary="Download your data in JSON format"
                            />
                            <ListItemSecondaryAction>
                                <Button
                                    variant="outlined"
                                    startIcon={<Download />}
                                    onClick={handleExportData}
                                >
                                    Export
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    size="large"
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default Settings;
