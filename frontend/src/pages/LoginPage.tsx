import { useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";

const LoginFormPlaceholder = () => (
  <Box sx={{ mt: 4, p: 2, border: "1px dashed grey" }}>
    <Typography>Здесь будет форма входа</Typography>
  </Box>
);

export function LoginPage() {
  useEffect(() => {
    document.title = "Вход | Умный склад";
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/logo_rt_horiz_ru.png"
          alt="Логотип Ростелеком"
          style={{ width: "250px", marginBottom: "24px" }}
        />
        <Typography component="h1" variant="h5">
          Вход в систему "Умный склад"
        </Typography>
        <LoginFormPlaceholder />
      </Box>
    </Container>
  );
}
