import {useEffect, useState} from 'react';
import {applyTheme} from "@/app/utils/Theme";

const useThemeHandler = () => {
  const [systemTheme, setSystemTheme] = useState<string>("");

  useEffect(() => {
    if (!["system", "light", "dark"].includes(systemTheme)) {
      setSystemTheme(localStorage.getItem("theme") || "system");
    }
  }, []);

  useEffect(() => {
    applyTheme(systemTheme);
  }, [systemTheme]);

  return {systemTheme, setSystemTheme};
};

export default useThemeHandler;