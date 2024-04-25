import {AppBar, IconButton, Typography} from "@mui/material";
import AuthDiv from "./AuthDiv";
import ThemeSelect from "./ThemeSelect";
import React from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HomeIcon from '@mui/icons-material/Home';
import {useRouter} from "next/navigation";

const HeaderAppBar = ({title, useAuthDiv = true, systemTheme, setSystemTheme}) => {
  const router = useRouter();

  return (
    <AppBar position="static" color="secondary">
      <div className="flex-around p-2">
        <IconButton aria-label="home" onClick={() => router.push("/")}>
          <HomeIcon fontSize="large"/>
        </IconButton>
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