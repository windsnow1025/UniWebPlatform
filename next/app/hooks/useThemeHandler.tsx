import { useEffect } from 'react';
import { applyTheme } from "@/app/utils/Theme";

interface UseThemeHandlerProps {
    systemTheme: string | undefined;
    setSystemTheme: (theme: string) => void;
}

const useThemeHandler = ({ systemTheme, setSystemTheme }: UseThemeHandlerProps) => {
    useEffect(() => {
        let currentSystemTheme = systemTheme;
        if (systemTheme !== "system" && systemTheme !== "light" && systemTheme !== "dark") {
            currentSystemTheme = localStorage.getItem("theme") || "system";
            setSystemTheme(currentSystemTheme);
        }
        applyTheme(currentSystemTheme!!);
    }, [systemTheme, setSystemTheme]);
};

export default useThemeHandler;