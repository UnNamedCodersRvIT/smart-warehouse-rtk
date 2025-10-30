import { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function HistoryPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = "Исторические данные | Умный склад";
  }, []);

  const handleLogout = () => {
    console.log("Выход из системы");
    logout();
    // После logout произойдет автоматический редирект на /login через ProtectedRoute
  };

  const handleTabChange = (tab: "monitoring" | "history") => {
    if (tab === "monitoring") {
      navigate("/dashboard");
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
        activeTab="history" 
        onTabChange={handleTabChange} 
        onCsvUpload={handleCsvUpload} 
      />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" gutterBottom>
          Исторические данные
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Анализ исторических данных склада
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Статистика за последний месяц
          </Typography>
          <Typography>
            Здесь будет отображаться график активности, таблица с историческими данными 
            и аналитика по движениям товаров.
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Просмотр истории доступен для: {user.role}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}