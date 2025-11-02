import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// --- Импорты для Material-UI ---
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./styles/theme.ts";

// --- Импорт глобальных стилей ---
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
