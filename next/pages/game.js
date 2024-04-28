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
import Player from "../src/logic/game/Player";

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  const [player1, setPlayer1] = useState(new Player());
  const [player2, setPlayer2] = useState(new Player());

  const init = () => {
    const infantryArmy = new Army(() => new Infantry(), 10);
    const archerArmy = new Army(() => new Archer(), 10);
    player1.armies.push(infantryArmy);
    player2.armies.push(archerArmy);
  };

  const combat = () => {
    armyCombat(player1.armies[0], player2.armies[0], 0);
    console.log(player1.armies[0]);
    console.log(player2.armies[0]);
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
