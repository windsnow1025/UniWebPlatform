'use client';

import '../src/asset/css/index.css';

import React, {useEffect, useState} from "react";
import {
  Button,
  Container,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
import Infantry from "../src/logic/game/Units/Infantry";
import Archer from "../src/logic/game/Units/Archer";
import Army from "../src/logic/game/Army";
import Player from "../src/logic/game/Player";
import {armyCombat} from "../src/logic/game/Combat";

function Game() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  const [players, setPlayers] = useState([new Player()]);
  const [selectedArmies, setSelectedArmies] = useState([0]);
  const [distance, setDistance] = useState(0);

  const addPlayer = () => {
    setPlayers([...players, new Player()]);
    setSelectedArmies([...selectedArmies, 0]);
  };

  const handleAddArmy = (playerIndex, unitType, number) => {
    let unitFactory;
    if (unitType === "Infantry") {
      unitFactory = () => new Infantry();
    } else if (unitType === "Archer") {
      unitFactory = () => new Archer();
    }
    const newArmy = new Army(unitFactory);
    newArmy.addUnits(number);
    const newPlayers = [...players];
    newPlayers[playerIndex].armies.push(newArmy);
    setPlayers(newPlayers);
  };

  const handleAddUnitsToArmy = (playerIndex, armyIndex, number) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].armies[armyIndex].addUnits(number);
    setPlayers(newPlayers);
  };

  const handleCombat = (attackerPlayerIndex, defenderPlayerIndex) => {
    const attackerArmyIndex = selectedArmies[attackerPlayerIndex];
    const defenderArmyIndex = selectedArmies[defenderPlayerIndex];

    const attackerArmy = players[attackerPlayerIndex].armies[attackerArmyIndex];
    const defenderArmy = players[defenderPlayerIndex].armies[defenderArmyIndex];

    if (!attackerArmy || !defenderArmy) {
      return;
    }

    armyCombat(attackerArmy, defenderArmy, distance);

    const updatedPlayers = [...players];
    updatedPlayers[attackerPlayerIndex].removeEmptyArmies();
    updatedPlayers[defenderPlayerIndex].removeEmptyArmies();

    setPlayers(updatedPlayers);
  };

  const handleSelectArmy = (playerIndex, armyIndex) => {
    const updatedSelectedArmies = [...selectedArmies];
    updatedSelectedArmies[playerIndex] = armyIndex;
    setSelectedArmies(updatedSelectedArmies);
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
          <Container sx={{p: 4}}>
            <Typography variant="h5">Unit Properties</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Paper elevation={3} sx={{p: 2}}>
                  <Typography variant="h6">Infantry</Typography>
                  <Typography>Attack: 7</Typography>
                  <Typography>Defense: 2</Typography>
                  <Typography>Health: 10</Typography>
                  <Typography>Range: 0</Typography>
                  <Typography>Cost: 1</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} md={3}>
                <Paper elevation={3} sx={{p: 2}}>
                  <Typography variant="h6">Archer</Typography>
                  <Typography>Attack: 5</Typography>
                  <Typography>Defense: 1</Typography>
                  <Typography>Health: 10</Typography>
                  <Typography>Range: 1</Typography>
                  <Typography>Cost: 1</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Button variant="contained" sx={{m: 1}} onClick={addPlayer}>Add Player</Button>
            <Grid container spacing={2}>
              {players.map((player, playerIndex) => (
                <Grid item xs={12} md={6} key={playerIndex}>
                  <Typography variant="h6">Player {playerIndex + 1}</Typography>
                  <Button variant="outlined" sx={{m: 1}} onClick={() => handleAddArmy(playerIndex, 'Infantry', 10)}>
                    Add Infantry Army
                  </Button>
                  <Button variant="outlined" sx={{m: 1}} onClick={() => handleAddArmy(playerIndex, 'Archer', 10)}>
                    Add Archer Army
                  </Button>
                  <FormControl>
                    <InputLabel>Army</InputLabel>
                    <Select
                      label="Army"
                      value={selectedArmies[playerIndex]}
                      onChange={(e) => handleSelectArmy(playerIndex, parseInt(e.target.value))}
                    >
                      {player.armies.map((army, index) => (
                        <MenuItem value={index} key={index}>
                          Army {index + 1}: {army.units[0].constructor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div>
                    {player.armies.map((army, index) => (
                      <Grid key={index} container alignItems="center">
                        <Grid item>
                          <Typography sx={{ fontWeight: selectedArmies[playerIndex] === index ? 'bold' : 'normal' }}>
                            Army {index + 1}: {army.units[0].constructor.name} - {army.units.length} Units
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="outlined"
                            sx={{ m: 1 }}
                            onClick={() => handleAddUnitsToArmy(playerIndex, index, 1)}
                          >
                            Add 1 Unit
                          </Button>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                  {players.map((_, defenderPlayerIndex) => {
                    if (playerIndex !== defenderPlayerIndex) {
                      return (
                        <Button
                          key={`${playerIndex}-${defenderPlayerIndex}`}
                          variant="contained"
                          sx={{m: 1}}
                          onClick={() => handleCombat(playerIndex, defenderPlayerIndex)}
                        >
                          Attacks Player {defenderPlayerIndex + 1}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </Grid>
              ))}
            </Grid>
            <div>
              <TextField
                label="Distance"
                type="number"
                value={distance}
                onChange={(event) => setDistance(event.target.value)}
                size="small"
                margin="normal"
                InputProps={{
                  inputProps: {
                    min: 0
                  }
                }}
              />
            </div>
          </Container>
        </ThemeProvider>
      }
    </>
  );
}

export default Game;