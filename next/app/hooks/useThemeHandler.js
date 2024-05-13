import { useEffect, useState } from 'react';
import {applyTheme, createMUITheme} from "../utils/Theme";

const useThemeHandler = () => {
  const [systemTheme, setSystemTheme] = useState("light");
  const [muiTheme, setMuiTheme] = useState(createMUITheme(systemTheme));

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    setSystemTheme(storedTheme);
  }, []);

  useEffect(() => {
    applyTheme(systemTheme);
    setMuiTheme(createMUITheme(systemTheme));
  }, [systemTheme]);

  return { systemTheme, setSystemTheme, muiTheme };
};

export default useThemeHandler;