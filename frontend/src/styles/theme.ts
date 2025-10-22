import { createTheme } from "@mui/material/styles";

const palette = {
  primary: {
    main: "#7700FF",
    light: "#749FD6",
    dark: "#4B00CC",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#FF4F12",
    contrastText: "#ffffff",
  },
  background: {
    default: "#F4F6F8",
    paper: "#FFFFFF",
  },
};

export const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: [
      "RostelecomBasis",
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
    },
  },
});
