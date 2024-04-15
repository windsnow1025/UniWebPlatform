import {AppBar, Typography} from "@mui/material";
import AuthDiv from "./AuthDiv";
import ThemeSelect from "./ThemeSelect";
import React from "react";

interface HeaderAppBarProps {
    title: string;
    useAuthDiv?: boolean;
    systemTheme: string;
    setSystemTheme: (theme: string) => void;
}

const HeaderAppBar: React.FC<HeaderAppBarProps> = ({ title, useAuthDiv = true, systemTheme, setSystemTheme}) => {
    return (
        <AppBar position="static" color="secondary">
            <div className="flex-around p-2">
                <Typography variant="h4" className="grow">
                  {title}
                </Typography>
                {useAuthDiv &&
                  <div className="m-1">
                    <AuthDiv/>
                  </div>
                }
                <div className="m-1">
                  <ThemeSelect
                    systemTheme={systemTheme}
                    setSystemTheme={setSystemTheme}
                  />
                </div>
            </div>
        </AppBar>
    );
};

export default HeaderAppBar;