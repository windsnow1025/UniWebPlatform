import { useEffect, useState } from 'react';
import {applyTheme, createMUITheme} from "@/app/utils/Theme";
import { Theme } from "@mui/material/styles";

const useThemeHandler = () => {
  const [systemTheme, setSystemTheme] = useState();
  const [muiTheme, setMuiTheme] = useState();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "system";
    if (systemTheme === undefined || !["system", "light", "dark"].includes(systemTheme)) {
      setSystemTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (systemTheme === undefined) {
      return;
    }
    applyTheme(systemTheme);
    setMuiTheme(createMUITheme(systemTheme));
  }, [systemTheme]);

  return { systemTheme, setSystemTheme, muiTheme };
};

export default useThemeHandler;