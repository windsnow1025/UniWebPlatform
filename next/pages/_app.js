import '../src/global.css';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import useThemeHandler from "../app/hooks/useThemeHandler";

export default function App({Component, pageProps}) {
  const { muiTheme } = useThemeHandler();

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}