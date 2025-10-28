import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export interface HeaderProps {
  userInfo: {
    name: string;
    role: string;
  };
  onLogout: () => void;
}

export function Header({ userInfo, onLogout }: HeaderProps) {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: "white", 
        color: "text.primary",
        boxShadow: 1,
        borderBottom: 3,
        borderColor: "error.main"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Левая часть - Логотип */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo_rt_horiz_ru.png"
            alt="Логотип Ростелеком"
            style={{
              height: "40px",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
            }}
          />
        </Box>

        {/* Центральная часть - Название системы */}
        <Box sx={{ 
          position: "absolute", 
          left: "50%", 
          transform: "translateX(-50%)" 
        }}>
          <Typography 
            variant="h6" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1.25rem"
            }}
          >
            Умный склад
          </Typography>
        </Box>

        {/* Правая часть - Информация о пользователе и кнопка выхода */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                fontSize: "0.875rem"
              }}
            >
              {userInfo.name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: "text.secondary",
                fontSize: "0.75rem"
              }}
            >
              {userInfo.role}
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            size="small"
            onClick={onLogout}
            sx={{
              borderColor: "grey.300",
              color: "text.primary",
              textTransform: "none",
              fontSize: "0.875rem",
              "&:hover": {
                borderColor: "grey.400",
                bgcolor: "grey.50"
              }
            }}
          >
            Выход
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}