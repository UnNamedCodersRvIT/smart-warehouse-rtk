import { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Дашборд | Умный склад";
  }, []);

  const handleLogout = () => {
    console.log("Выход из системы");
    navigate("/login");
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
    name: "Иван Иванов",
    role: "Администратор"
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
          Добро пожаловать в систему "Умный склад"!
        </Typography>
        
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" gutterBottom>
            Состояние склада в реальном времени
          </Typography>
          <Typography>
            Здесь отображается текущая загруженность склада, активные операции 
            и последние события.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}