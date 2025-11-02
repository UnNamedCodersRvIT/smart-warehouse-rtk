import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"monitoring" | "history">("monitoring");

  useEffect(() => {
    document.title = "Дашборд | Умный склад";
  }, []);

  const handleLogout = () => {
    console.log("Выход из системы");
  };

  const handleTabChange = (tab: "monitoring" | "history") => {
    setActiveTab(tab);
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
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onCsvUpload={handleCsvUpload} 
      />
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" gutterBottom>
          Дашборд
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Добро пожаловать в систему "Умный склад"!
        </Typography>
        <Typography>
          Активная вкладка: {activeTab === "monitoring" ? "Текущий мониторинг" : "Исторические данные"}
        </Typography>
      </Box>
    </Box>
  );
}