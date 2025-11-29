import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  createTheme,
} from "@mui/material";
import MainRouter from "./MainRouter.jsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1565c0", // deep blue
    },
    secondary: {
      main: "#ffb300", // amber
    },
    background: {
      default: "#f4f5fb", // light grey background
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999, // pill buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);