import {AppBar} from "@mui/material";
import AuthDiv from "./AuthDiv";
import ThemeSelect from "./ThemeSelect";
import React from "react";

function HeaderAppBar({ title, useAuthDiv = true}) {
    return (
        <AppBar position="static" color="secondary">
            <div className="flex-around p-2">
                <h1 className="grow">{title}</h1>
                {useAuthDiv && <div className="m-1"><AuthDiv/></div>}
                <div className="m-1"><ThemeSelect/></div>
            </div>
        </AppBar>
    )
}

export default HeaderAppBar;