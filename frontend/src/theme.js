import { createTheme } from '@mui/material/styles';
import { keyframes } from '@mui/system';

// Animation keyframes
export const breatheAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.7; }
  100% { transform: scale(1); opacity: 0.3; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const sparkle = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 0.5; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 0.5; }
`;

export const wave = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

// Theme palettes
const themePalettes = {
  calm: {
    primary: {
      main: '#64B5F6',
      light: '#90CAF9',
      dark: '#42A5F5',
    },
    secondary: {
      main: '#81C784',
      light: '#A5D6A7',
      dark: '#66BB6A',
    },
  },
  serene: {
    primary: {
      main: '#9575CD',
      light: '#B39DDB',
      dark: '#7E57C2',
    },
    secondary: {
      main: '#4DB6AC',
      light: '#80CBC4',
      dark: '#26A69A',
    },
  },
  sunset: {
    primary: {
      main: '#FF7043',
      light: '#FF8A65',
      dark: '#F4511E',
    },
    secondary: {
      main: '#FFB74D',
      light: '#FFD54F',
      dark: '#FFA726',
    },
  },
  moonlight: {
    primary: {
      main: '#78909C',
      light: '#90A4AE',
      dark: '#546E7A',
    },
    secondary: {
      main: '#7986CB',
      light: '#9FA8DA',
      dark: '#5C6BC0',
    },
  },
  forest: {
    primary: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#43A047',
    },
    secondary: {
      main: '#26A69A',
      light: '#4DB6AC',
      dark: '#00897B',
    },
  },
  ocean: {
    primary: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
    },
    secondary: {
      main: '#26C6DA',
      light: '#4DD0E1',
      dark: '#00ACC1',
    },
  },
  lavender: {
    primary: {
      main: '#BA68C8',
      light: '#CE93D8',
      dark: '#AB47BC',
    },
    secondary: {
      main: '#7E57C2',
      light: '#9575CD',
      dark: '#673AB7',
    },
  },
  rose: {
    primary: {
      main: '#EC407A',
      light: '#F06292',
      dark: '#D81B60',
    },
    secondary: {
      main: '#F06292',
      light: '#F48FB1',
      dark: '#E91E63',
    },
  },
  golden: {
    primary: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    secondary: {
      main: '#FFD54F',
      light: '#FFE082',
      dark: '#FFC107',
    },
  },
  cosmic: {
    primary: {
      main: '#5C6BC0',
      light: '#7986CB',
      dark: '#3949AB',
    },
    secondary: {
      main: '#8E24AA',
      light: '#AB47BC',
      dark: '#6A1B9A',
    },
  }
};

// Create theme function
export const createAppTheme = (mode = 'light', palette = 'calm') => {
  const selectedPalette = themePalettes[palette];

  return createTheme({
    palette: {
      mode,
      primary: selectedPalette.primary,
      secondary: selectedPalette.secondary,
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        subtle: mode === 'light' ? '#fafafa' : '#2d2d2d',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
      },
    },
    typography: {
      fontFamily: "'Poppins', sans-serif",
      h1: {
        fontWeight: 600,
        letterSpacing: '-0.5px',
      },
      h2: {
        fontWeight: 600,
        letterSpacing: '-0.5px',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.5px',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@keyframes ripple': {
            '0%': {
              transform: 'scale(0)',
              opacity: 0.1,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 0,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: mode === 'light' 
                ? '0 12px 24px rgba(0,0,0,0.1)' 
                : '0 12px 24px rgba(0,0,0,0.4)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1) rotate(8deg)',
              backgroundColor: mode === 'light' 
                ? 'rgba(0, 0, 0, 0.04)' 
                : 'rgba(255, 255, 255, 0.08)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            animation: `${slideUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            animation: `${slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            animation: `${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            animation: `${fadeIn} 0.2s cubic-bezier(0.4, 0, 0.2, 1)`,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            overflow: 'hidden',
          },
        },
      },
    },
    shape: {
      borderRadius: 12,
    },
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
    },
  });
};

export const themeNames = Object.keys(themePalettes);
