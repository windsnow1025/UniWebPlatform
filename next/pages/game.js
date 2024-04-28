'use client';

import '../src/asset/css/index.css';

import React, {useEffect, useState} from "react";
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

  const [infantryArmy, setInfantryArmy] = useState(null);
  const [archerArmy, setArcherArmy] = useState(null);

  const init = () => {
    const newInfantryArmy = new Army([
      new Infantry(), new Infantry(), new Infantry(), new Infantry(),
      new Infantry(), new Infantry(), new Infantry(), new Infantry(),
      new Infantry(), new Infantry(),
    ]);
    const newArcherArmy = new Army([
      new Archer(), new Archer(), new Archer(), new Archer(),
      new Archer(), new Archer(), new Archer(), new Archer(),
      new Archer(), new Archer(),
    ]);
    console.log(newArcherArmy);
    console.log(newInfantryArmy);
    setInfantryArmy(newInfantryArmy);
    setArcherArmy(newArcherArmy);
  };

  const combat = () => {
    armyCombat(archerArmy, infantryArmy, 0);
    console.log(infantryArmy);
    console.log(archerArmy);
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
