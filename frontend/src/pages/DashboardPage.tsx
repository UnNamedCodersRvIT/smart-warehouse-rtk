import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

export function DashboardPage() {
  useEffect(() => {
    document.title = "Дашборд | Умный склад";
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h3">Дашборд</Typography>
      <Typography>Добро пожаловать!</Typography>
    </Box>
  );
}
