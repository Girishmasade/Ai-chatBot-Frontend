// src/theme.ts
import { createTheme } from "@mui/material/styles";
import { blueGrey } from "@mui/material/colors";

// Load Inter font via @fontsource (installed via npm)
import "@fontsource/inter/variable.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0D47A1", // deep blue
    },
    background: {
      default: "#090909",
      paper: "#111111",
    },
    secondary: {
      main: "#F59E0B", // amber for accent
    },
  },
  typography: {
    fontFamily: "Inter Variable, Arial, sans-serif",
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(17,17,17,0.85)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(17,17,17,0.85)",
        },
      },
    },
  },
});

export default theme;
