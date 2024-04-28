'use client';

import '../src/asset/css/index.css';

import React, {useEffect, useState} from "react";
import {
  Button,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  ThemeProvider,
  Typography
} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
import Player from "../src/logic/game/Player";
import graph from "../src/logic/game/data/Graph";

import dynamic from 'next/dynamic';
import {unitClasses, unitInstances} from "../src/logic/game/UnitFactory";

const GraphComponent = dynamic(() => import('../app/components/GraphComponent'), {
  ssr: false,
});

function Game() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  const [players, setPlayers] = useState([new Player(), new Player(), new Player()]);
  const [selectedArmies, setSelectedArmies] = useState([0, 0, 0]);

  const [armies, setArmies] = useState();
  useEffect(() => {
    const armies = players.reduce((acc, player) => {
      player.armies.forEach(army => {
        if (!acc[army.location]) {
          acc[army.location] = [];
        }
        acc[army.location].push({
          type: army.unitType,
          count: army.units.length
        });
      });
      return acc;
    }, {});
    setArmies(armies);
  }, [players]);

  const handleAddArmy = (playerIndex, unitType, number) => {
    let location;
    if (playerIndex === 0) {
      location = "Main City 1";
    } else if (playerIndex === 1) {
      location = "Main City 2";
    } else if (playerIndex === 2) {
      location = "Main City 3";
    }

    const newPlayers = [...players];
    const player = newPlayers[playerIndex];
    player.addUnitsToLocation(unitType, location, number);
    setPlayers(newPlayers);
  };

  const handleCombat = (attackerPlayerIndex, defenderPlayerIndex) => {
    const attackerArmyIndex = selectedArmies[attackerPlayerIndex];
    const defenderArmyIndex = selectedArmies[defenderPlayerIndex];

    const attackerPlayer = players[attackerPlayerIndex];
    const defenderPlayer = players[defenderPlayerIndex];

    attackerPlayer.combat(defenderPlayer, attackerArmyIndex, defenderArmyIndex, graph);

    const updatedPlayers = [...players];
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
              {unitClasses.map((unitClass, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Paper elevation={3} sx={{p: 2}}>
                    <Typography variant="h6">{unitClass.name}</Typography>
                    <Typography>Attack: {unitClass.attack}</Typography>
                    <Typography>Defense: {unitClass.defend}</Typography>
                    <Typography>Health: {unitClass.health}</Typography>
                    <Typography>Range: {unitClass.range}</Typography>
                    <Typography>Speed: {unitClass.speed}</Typography>
                    <Typography>Cost: {unitClass.cost}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <GraphComponent graph={graph} armies={armies}/>
            <Grid container spacing={2}>
              {players.map((player, playerIndex) => (
                <Grid item xs={4} md={4} key={playerIndex}>
                  <Typography variant="h6">Player {playerIndex + 1}</Typography>
                  <Typography variant="subtitle1">Money: ${player.money}</Typography>
                  {unitClasses.map((unitClass, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      sx={{m: 1}}
                      onClick={() => handleAddArmy(playerIndex, unitClass.name, 10)}>
                      {unitClass.name} Group +
                    </Button>
                  ))}
                  <RadioGroup
                    value={selectedArmies[playerIndex]}
                    onChange={(e) => handleSelectArmy(playerIndex, parseInt(e.target.value))}
                  >
                    {player.armies.map((army, index) => (
                      <FormControlLabel
                        value={index}
                        control={<Radio/>}
                        label={
                          <Grid container alignItems="center">
                            <Grid item xs>
                              Army {index + 1}: {army.units.length} x {army.unitType} - {army.location}
                            </Grid>
                          </Grid>
                        }
                        key={index}
                      />
                    ))}
                  </RadioGroup>
                  {players.map((_, defenderPlayerIndex) => {
                    if (playerIndex !== defenderPlayerIndex) {
                      return (
                        <Button
                          key={`${playerIndex}-${defenderPlayerIndex}`}
                          variant="contained"
                          sx={{m: 1}}
                          onClick={() => handleCombat(playerIndex, defenderPlayerIndex)}
                        >
                          Attack Player {defenderPlayerIndex + 1}
                        </Button>
                      );
                    }
                    return null;
                  })}
                </Grid>
              ))}
            </Grid>
          </Container>
        </ThemeProvider>
      }
    </>
  );
}

export default Game;