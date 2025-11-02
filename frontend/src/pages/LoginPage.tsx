import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { loginStyles } from "../styles/theme";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    document.title = "Вход | Умный склад";
  }, []);

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.includes("@")) {
      return "Email должен содержать символ '@'";
    }
    
    const parts = email.split("@");
    if (parts.length > 2) {
      return "Часть адреса после символа '@' не должна содержать символ '@'";
    }
    
    if (parts[1].includes("@")) {
      return "Часть адреса после символа '@' не должна содержать символ '@'";
    }
    
    if (!emailRegex.test(email)) {
      return "Введите корректный email адрес";
    }
    
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Заполните все поля");
    }

    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      throw new Error(emailValidationError);
    }

    if (password.length < 6) {
      throw new Error("Пароль должен содержать минимум 6 символов");
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    validateForm();

    // Имитация запроса к API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Простой редирект на dashboard
    window.location.href = '/dashboard';
    
  } catch (err) {
    setError(err instanceof Error ? err.message : "Ошибка авторизации");
  } finally {
    setLoading(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <Box sx={loginStyles.page}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={8} sx={{ p: 4, ...loginStyles.container }}>
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <img
              src="/logo_rt_horiz_ru.png"
              alt="Логотип Ростелеком"
              style={loginStyles.logo}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <Typography component="h1" variant="h4" sx={loginStyles.title}>
              Умный склад
            </Typography>
            <Typography variant="h6">
              Вход в систему
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
            sx={loginStyles.form}
            noValidate
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              placeholder="example@rostelecom.ru"
              disabled={loading}
              error={!!emailError}
              helperText={emailError}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={loading}
            />

            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Запомнить меня"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={loginStyles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Войти"
              )}
            </Button>
          </Box>

          <Box sx={loginStyles.footer}>
            <Typography variant="caption" color="text.secondary">
              Система управления складскими операциями
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              © 2025 Ростелеком
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}