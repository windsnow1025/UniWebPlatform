'use client';

import '../src/asset/css/index.css';

import React, { useEffect, useState } from "react";
import { ThemeProvider, Button, Container, CssBaseline, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
import Infantry from "../src/logic/game/Units/Infantry";
import Archer from "../src/logic/game/Units/Archer";
import Army from "../src/logic/game/Army";
import Player from "../src/logic/game/Player";
import { armyCombat } from "../src/logic/game/Combat";

function Index() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  const [players, setPlayers] = useState([new Player()]);
  const [selectedArmies, setSelectedArmies] = useState({});
  const [distance, setDistance] = useState(0);

  const addPlayer = () => {
    setPlayers([...players, new Player()]);
  };

  const handleInit = (playerIndex, unitType, number) => {
    const newArmy = new Army(() => unitType === 'Infantry' ? new Infantry() : new Archer(), number);
    const newPlayers = [...players];
    newPlayers[playerIndex].armies.push(newArmy);
    setPlayers(newPlayers);
  };

  const handleCombat = (attackerIndex, defenderIndex) => {
    const attackerArmyIndex = selectedArmies[`player${attackerIndex}`];
    const defenderArmyIndex = selectedArmies[`player${defenderIndex}`];

    armyCombat(
      players[attackerIndex].armies[attackerArmyIndex],
      players[defenderIndex].armies[defenderArmyIndex],
      distance
    );

    const updatedPlayers = [...players];
    updatedPlayers[attackerIndex].removeEmptyArmies();
    updatedPlayers[defenderIndex].removeEmptyArmies();

    setPlayers(updatedPlayers);
  };

  const handleSelectArmy = (playerIndex, armyIndex) => {
    setSelectedArmies(prev => ({
      ...prev,
      [`player${playerIndex}`]: armyIndex >= 0 ? armyIndex : null
    }));
  };

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
  };

  return (
    <>
      {muiTheme &&
        <ThemeProvider theme={muiTheme}>
          <CssBaseline enableColorScheme />
          <HeaderAppBar
            title={title}
            systemTheme={systemTheme}
            setSystemTheme={setSystemTheme}
          />
          <Container className="p-4">
            <Button variant="contained" sx={{ m: 1 }} onClick={addPlayer}>Add Player</Button>
            <Grid container spacing={2}>
              {players.map((player, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <Typography variant="h6">Player {i + 1}</Typography>
                  <Button variant="outlined" sx={{ m: 1 }} onClick={() => handleInit(i, 'Infantry', 10)}>
                    Add Infantry Army
                  </Button>
                  <Button variant="outlined" sx={{ m: 1 }} onClick={() => handleInit(i, 'Archer', 10)}>
                    Add Archer Army
                  </Button>
                  <Select
                    value={selectedArmies[`player${i}`] ?? ''}
                    onChange={(e) => handleSelectArmy(i, parseInt(e.target.value, 10))}
                    displayEmpty
                    renderValue={selected => {
                      if (selected === '') {
                        return <em>None</em>;
                      }
                      return `Army ${selected + 1}`;
                    }}
                  >
                    {player.armies.map((army, index) => (
                      <MenuItem value={index} key={index}>
                        Army {index + 1} ({army.units[0].constructor.name})
                      </MenuItem>
                    ))}
                  </Select>
                  <div>
                    {player.armies.map((army, index) => (
                      <div key={index}>
                        <Typography sx={{ fontWeight: selectedArmies[`player${i}`] === index ? 'bold' : 'normal' }}>
                          Army {index + 1}: {army.units[0].constructor.name} - {army.units.length} Units
                        </Typography>
                        {army.units.map((unit, uIndex) => (
                          <Typography key={uIndex} sx={{ ml: 4 }}>
                            Unit {uIndex + 1}: {unit.constructor.name} - {unit.currentHealth}/{unit.health} HP, Attack: {unit.attack}, Defense: {unit.defend}
                          </Typography>
                        ))}
                      </div>
                    ))}
                  </div>
                  {players.map((_, j) => {
                    if (i !== j) {
                      return (
                        <Button
                          key={`combat-${i}-${j}`}
                          onClick={() => handleCombat(i, j)}
                          variant="contained"
                          sx={{ m: 1 }}
                        >
                          Attacks Player {j + 1}
                        </Button>
                      );
                    }
                    return null;
                  })}
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
          </Container>
        </ThemeProvider>
      }
    </>
  );
}

export default Index;