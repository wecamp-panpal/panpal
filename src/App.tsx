import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/lib/muiTheme";
import LandingPage from "@/pages/LandingPage";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <LandingPage />
    </ThemeProvider>
  );
}

export default App;
