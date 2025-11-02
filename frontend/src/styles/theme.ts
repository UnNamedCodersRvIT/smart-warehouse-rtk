import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Голубой вместо оранжевого
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#8e44ad',
      light: '#a563c1',
      dark: '#7d3c98',
    },
    background: {
      default: 'linear-gradient(135deg, #ff6b35 0%, #8e44ad 100%)',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      color: 'text.secondary',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontSize: '1.1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          color: '#ffffff', // Белый текст для кнопок
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
          '&:disabled': {
            transform: 'none',
            boxShadow: 'none',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #ff6b35 0%, #8e44ad 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #e55a2b 0%, #7d3c98 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#2196f3', // Голубой при наведении
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2196f3', // Голубой при фокусе
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#2196f3', // Голубой цвет для лейбла при фокусе
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        icon: {
          color: 'error.main',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#2196f3', // Голубой для чекбокса
          '&.Mui-checked': {
            color: '#2196f3', // Голубой для отмеченного чекбокса
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          '&.Mui-focused': {
            color: '#2196f3', // Голубой для лейбла чекбокса при фокусе
          },
        },
      },
    },
  },
});

// Дополнительные стили для компонентов
export const loginStyles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ff6b35 0%, #8e44ad 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    py: 4,
    px: 2,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: '250px',
    mb: 2,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
  },
  title: {
    fontWeight: 600,
    background: 'linear-gradient(135deg, #ff6b35 0%, #8e44ad 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    mb: 1,
  },
  form: {
    mt: 2,
    width: '100%',
  },
  submitButton: {
    mt: 3,
    mb: 2,
    py: 1.5,
    color: '#ffffff !important', // Белый текст для кнопки входа
  },
  footer: {
    mt: 4,
    textAlign: 'center',
  },
} as const;
