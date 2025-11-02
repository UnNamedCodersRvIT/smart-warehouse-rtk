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
        background: "linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%)",
        color: "text.primary",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        borderRadius: 0,
        borderBottom: "1px solid",
        borderColor: "rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ 
        justifyContent: "space-between",
        minHeight: "64px !important",
      }}>
        {/* Левая часть - Логотип и название */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src="/logo_rt_horiz_ru.png"
            alt="Логотип Ростелеком"
            style={{
              height: "52px",
            }}
          />
          <Box sx={{ 
            height: "32px",
            width: "1px", 
            bgcolor: "black",
            mx: 1 
          }} />
          <Typography 
            variant="h6" 
            component="h1"
            sx={{ 
              fontWeight: 500,
              color: "black",
              fontSize: "1.3rem",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            Умный склад
          </Typography>
        </Box>

        {/* Правая часть - Информация о пользователе и кнопка выхода */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500,
                fontSize: "1rem",
                color: "black"
              }}
            >
              {userInfo.name}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: "blue",
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
              borderColor: "red",
              color: "#2c3e50",
              textTransform: "none",
              fontSize: "0.8rem",
              borderRadius: 1,
              px: 2,
              "&:hover": {
                borderColor: "red",
                bgcolor: "pink"
              }
            }}
          >
            Выйти
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}