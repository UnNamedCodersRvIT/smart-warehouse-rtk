import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Вход | Умный склад";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Здесь будет реальная логика авторизации
      console.log("Login attempt:", { email, password, rememberMe });
      
      // Пример обработки ошибки
      if (!email || !password) {
        throw new Error("Заполните все поля");
      }
      
      if (!email.includes('@')) {
        throw new Error("Введите корректный email");
      }
      
      // Успешная авторизация
      // navigate('/dashboard');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Инициирован процесс восстановления пароля");
    
    // Здесь можно добавить логику для восстановления пароля
    if (email) {
      console.log(`Отправка ссылки для восстановления на email: ${email}`);
      // В реальном приложении здесь был бы вызов API
    } else {
      console.log("Для восстановления пароля укажите email");
      setError("Для восстановления пароля укажите email");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ff6b35 0%, #8e44ad 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              mb: 3,
              textAlign: "center",
            }}
          >
            <img
              src="/logo_rt_horiz_ru.png"
              alt="Логотип Ростелеком"
              style={{ 
                width: "250px", 
                marginBottom: "16px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
              }}
            />
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                background: "linear-gradient(135deg, #ff6b35 0%, #8e44ad 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 1
              }}
            >
              Умный склад
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Вход в систему
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: "100%" }}>
            {/* Блок ошибок */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    color: "error.main"
                  }
                }}
              >
                {error}
              </Alert>
            )}

            {/* Поле ввода email */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите email"
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            {/* Поле ввода пароля */}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            {/* Чекбокс "Запомнить меня" */}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  sx={{
                    color: "primary.main",
                    "&.Mui-checked": {
                      color: "primary.main",
                    },
                  }}
                />
              }
              label="Запомнить меня"
              sx={{ mt: 1 }}
            />

            {/* Кнопка "Войти" */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #ff6b35 0%, #8e44ad 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #e55a2b 0%, #7d3c98 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                },
                "&:disabled": {
                  background: "grey.300",
                },
                transition: "all 0.3s ease",
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Войти"}
            </Button>

            {/* Ссылка "Забыли пароль?" */}
            <Box sx={{ textAlign: "center" }}>
              <Link 
                href="#" 
                variant="body2" 
                onClick={handleForgotPassword}
                sx={{
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.dark",
                    cursor: "pointer",
                  },
                }}
              >
                Забыли пароль?
              </Link>
            </Box>
          </Box>

          {/* Дополнительная информация */}
          <Box sx={{ mt: 4, textAlign: "center" }}>
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
