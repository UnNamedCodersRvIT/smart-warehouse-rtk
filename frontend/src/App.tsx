import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { useAuth } from "./hooks/useAuth";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Публичные роуты --- */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* --- Защищённые роуты --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* <Route path="/history" element={<HistoryPage />} /> */}
        </Route>

        {/* --- Редирект с главной страницы --- */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* --- Страница 404 Not Found --- */}
        <Route path="*" element={<div>Страница не найдена (404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
