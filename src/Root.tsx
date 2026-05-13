import React from "react";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useUIStore } from "./store/uiStore"; // ייבוא ה-Store
import { getAppTheme } from "./utils/theme";
const Root: React.FC = () => {
  // שליפת ה-mode הנוכחי מה-Store
  const mode = useUIStore((state) => state.mode);

  // יצירת ה-theme המתאים בכל פעם שה-mode משתנה
  const theme = getAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

export default Root;