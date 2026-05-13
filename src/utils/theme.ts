import { createTheme } from "@mui/material/styles";

type Mode = "light" | "dark";

export function getAppTheme(mode: Mode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#8ab4ff" : "#2563eb",
      },
      background: {
        default: isDark ? "#0b0f19" : "#f3f5f9",
        paper: isDark ? "#121826" : "#ffffff",
      },
      text: {
        primary: isDark ? "#f8fafc" : "#0f172a",
        secondary: isDark ? "#94a3b8" : "#475569",
      },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: `"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif`,
    },
  });
}