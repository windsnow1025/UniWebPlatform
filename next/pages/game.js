'use client';

import '../src/asset/css/index.css';

import React, {useEffect, useState} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {Button, Container, CssBaseline, Grid, MenuItem, Select, TextField, Typography} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
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

  const [players, setPlayers] = useState([new Player(), new Player()]);
  const [selectedArmies, setSelectedArmies] = useState({player1: 0, player2: 0});
  const [distance, setDistance] = useState(0);

  const handleInit = (playerIndex, unitType, number) => {
    const newArmy = new Army(() => unitType === 'Infantry' ? new Infantry() : new Archer(), number);
    const newPlayers = [...players];
    newPlayers[playerIndex].armies.push(newArmy);
    setPlayers(newPlayers);
  };

  const handleCombat = () => {
    const {player1, player2} = selectedArmies;
    armyCombat(players[0].armies[player1], players[1].armies[player2], distance);
    setPlayers([...players]);
  };

  const handleSelectArmy = (playerIndex, armyIndex) => {
    setSelectedArmies(prev => ({
      ...prev,
      [`player${playerIndex + 1}`]: armyIndex
    }));
  };

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
  };

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
          <Container className="p-4">
            <Grid container spacing={2}>
              {players.map((player, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Typography variant="h6">Player {i + 1}</Typography>
                  <Button variant="outlined" sx={{m: 1}} onClick={() => handleInit(i, 'Infantry', 10)}>
                    Add Infantry Army
                  </Button>
                  <Button variant="outlined" sx={{m: 1}} onClick={() => handleInit(i, 'Archer', 10)}>
                    Add Archer Army
                  </Button>
                  <Select
                    value={selectedArmies[`player${i + 1}`]}
                    onChange={(e) => handleSelectArmy(i, e.target.value)}
                  >
                    {player.armies.map((army, index) => (
                      <MenuItem value={index} key={index}>Army {index + 1} ({army.units[0].constructor.name})</MenuItem>
                    ))}
                  </Select>
                  <div>
                    {player.armies[selectedArmies[`player${i + 1}`]]?.units.map((unit, index) => (
                      <Typography key={index}>Unit {index + 1}: {unit.currentHealth}/{unit.health} HP</Typography>
                    ))}
                  </div>
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6">
              <TextField
                type="number"
                value={distance}
                onChange={handleDistanceChange}
                label="Distance"
                size="small"
                margin="normal"
                InputProps={{
                  inputProps: {
                    min: 0
                  }
                }}
              />
            </Typography>
            <Button onClick={handleCombat} variant="contained" color="primary">Combat</Button>
          </Container>
        </ThemeProvider>
      }
    </>
  );
}

export default Index;
