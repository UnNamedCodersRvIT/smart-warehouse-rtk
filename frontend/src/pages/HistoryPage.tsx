// src/pages/HistoryPage.tsx
import { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";

export function HistoryPage() {
  useEffect(() => {
    document.title = "Исторические данные | Умный склад";
  }, []);

  const handleLogout = () => {
    console.log("Выход из системы");
  };

  const handleTabChange = (tab: "monitoring" | "history") => {
    if (tab === "monitoring") {
      window.location.href = "/dashboard";
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
        </Paper>
      </Box>
    </Box>
  );
}