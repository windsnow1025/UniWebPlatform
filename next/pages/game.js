'use client';

import '../src/asset/css/index.css';

import React, {useEffect} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {CssBaseline} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
import Button from "@mui/material/Button";
import Infantry from "../src/logic/game/Units/Infantry";
import Archer from "../src/logic/game/Units/Archer";
import Army from "../src/logic/game/Army";
import {armyCombat} from "../src/logic/game/Combat";

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  let army1;
  let army2;

  const init = () => {
    army1 = new Army([
      new Infantry(),
      new Infantry(),
      new Infantry(),
      new Infantry(),
      new Infantry(),
      new Infantry(),
      new Infantry(),
      new Infantry(),
      new Infantry(),
      new Infantry(),
    ]);
    army2 = new Army([
      new Archer(),
      new Archer(),
      new Archer(),
      new Archer(),
      new Archer(),
      new Archer(),
      new Archer(),
      new Archer(),
      new Archer(),
      new Archer(),
    ]);
  }

  const combat = () => {
    console.log(army1);
    console.log(army2);
    armyCombat(army1, army2, 1);
    console.log(army1);
    console.log(army2);
  }

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme/>
          <HeaderAppBar
            title={title}
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <Button onClick={init}>Init</Button>
          <Button onClick={combat}>Combat</Button>
        </ThemeProvider>
      }
    </>
  );
}

export default Index;
