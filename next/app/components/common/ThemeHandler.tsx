import React, {useEffect} from 'react';
import {applyTheme} from "../../utils/Theme";

interface ThemeSelectProps {
    systemTheme: string;
    setSystemTheme: (theme: string) => void;
}

const ThemeHandler: React.FC<ThemeSelectProps> = ({systemTheme, setSystemTheme}) => {
    useEffect(() => {
        if (systemTheme !== "system" && systemTheme !== "light" && systemTheme !== "dark") {
            const currentSystemTheme = localStorage.getItem("theme") || "system";
            setSystemTheme(currentSystemTheme);
        }
        applyTheme(systemTheme);
    }, []);

    return (
        <></>
    );
};

export default ThemeHandler;