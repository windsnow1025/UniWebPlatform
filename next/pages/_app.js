import '../src/global.css';
import {ThemeProvider as MUIThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import {AppThemeProvider, useAppTheme} from "../app/contexts/ThemeContext";

function ThemedApp({ Component, pageProps }) {
  const { muiTheme } = useAppTheme();

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <Component {...pageProps} />
    </MUIThemeProvider>
  );
}

export default function App(props) {
  return (
    <AppThemeProvider>
      <ThemedApp {...props} />
    </AppThemeProvider>
  );
}