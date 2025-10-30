import { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = "Дашборд | Умный склад";
  }, []);

  const handleLogout = () => {
    console.log("Выход из системы");
    logout();
    // После logout произойдет автоматический редирект на /login через ProtectedRoute
  };

  const handleTabChange = (tab: "monitoring" | "history") => {
    if (tab === "history") {
      navigate("/history");
    }
  };

  const handleCsvUpload = () => {
    console.log("Загрузка CSV файла");
  };

  const userInfo = {
    name: user?.name || "Иван Иванов",
    role: user?.role || "Администратор"
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Header 
        userInfo={userInfo} 
        onLogout={handleLogout} 
      />
      <Navigation 
        activeTab="monitoring" 
        onTabChange={handleTabChange} 
        onCsvUpload={handleCsvUpload} 
      />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" gutterBottom>
          Текущий мониторинг
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Добро пожаловать в систему "Умный склад", {user?.name || 'пользователь'}!
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Состояние склада в реальном времени
          </Typography>
          <Typography>
            Здесь отображается текущая загруженность склада, активные операции 
            и последние события.
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Вы вошли как: {user.role} ({user.email})
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}