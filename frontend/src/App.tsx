// frontend/src/App.tsx
import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HistoryPage } from "./pages/HistoryPage";
import { useAuth } from "./hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";

function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <CircularProgress />
    </Box>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
}

function App() {
  const { checkAuth, isLoading } = useAuth();

  useEffect(() => {
    // Проверяем авторизацию только при первом монтировании
    checkAuth();
  }, []); // Убрал checkAuth из зависимостей

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Защищенные маршруты */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        {/* Маршруты по умолчанию */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<div>Страница не найдена (404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;