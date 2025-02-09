import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createAppTheme, themeNames } from '../theme';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });

    const [themePalette, setThemePalette] = useState(() => {
        const savedPalette = localStorage.getItem('themePalette');
        return savedPalette || 'calm';
    });

    const theme = React.useMemo(
        () => createAppTheme(mode, themePalette),
        [mode, themePalette]
    );

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    useEffect(() => {
        localStorage.setItem('themePalette', themePalette);
    }, [themePalette]);

    const toggleMode = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const changeTheme = (newTheme) => {
        if (themeNames.includes(newTheme)) {
            setThemePalette(newTheme);
        }
    };

    const value = {
        mode,
        themePalette,
        toggleMode,
        changeTheme,
        availableThemes: themeNames
    };

    return (
        <ThemeContext.Provider value={value}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
