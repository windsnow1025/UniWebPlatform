import {AppBar} from "@mui/material";
import AuthDiv from "./AuthDiv";
import ThemeSelect from "./ThemeSelect";
import React from "react";

function HeaderAppBar({ title, useAuthDiv = true, systemTheme, setSystemTheme}) {
    return (
        <AppBar position="static" color="secondary">
            <div className="flex-around p-2">
                <h1 className="grow">
                  {title}
                </h1>
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
    )
}

export default HeaderAppBar;