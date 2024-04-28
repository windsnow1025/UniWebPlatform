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
import Infantry from "../src/logic/game/Units/Infantry";
import Archer from "../src/logic/game/Units/Archer";
import Player from "../src/logic/game/Player";
import Graph from "../src/logic/game/Graph";

import dynamic from 'next/dynamic';

const GraphComponent = dynamic(() => import('../app/components/GraphComponent'), {
  ssr: false,
});

const graph = new Graph();

graph.addNode("Main City 1");
graph.addNode("City 1 D");
graph.addNode("City 1 L");
graph.addNode("City 1 R");
graph.addNode("Main City 2");
graph.addNode("City 2 D");
graph.addNode("City 2 L");
graph.addNode("City 2 R");
graph.addNode("Main City 3");
graph.addNode("City 3 D");
graph.addNode("City 3 L");
graph.addNode("City 3 R");
graph.addNode("Gate 12");
graph.addNode("Gate 12");
graph.addNode("Gate 23");
graph.addNode("Center");
graph.addEdge("Main City 1", "City 1 D");
graph.addEdge("Main City 2", "City 2 D");
graph.addEdge("Main City 3", "City 3 D");
graph.addEdge("City 1 D", "Center");
graph.addEdge("City 2 D", "Center");
graph.addEdge("City 3 D", "Center");
graph.addEdge("Main City 1", "City 1 R");
graph.addEdge("City 1 R", "Gate 12");
graph.addEdge("Main City 1", "City 1 L");
graph.addEdge("City 1 L", "Gate 13");
graph.addEdge("Main City 2", "City 2 R");
graph.addEdge("City 2 R", "Gate 23");
graph.addEdge("Main City 2", "City 2 L");
graph.addEdge("City 2 L", "Gate 12");
graph.addEdge("Main City 3", "City 3 R");
graph.addEdge("City 3 R", "Gate 13");
graph.addEdge("Main City 3", "City 3 L");
graph.addEdge("City 3 L", "Gate 23");

function Game() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  const units = [new Infantry(), new Archer()];

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
          type: army.units[0].constructor.name,
          count: army.units.length
        });
      });
      return acc;
    }, {});
    console.log(armies)
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
    player.addArmy(unitType, location);
    player.addUnitsToArmy(player.armies.length - 1, number);
    setPlayers(newPlayers);
  };

  const handleAddUnitsToArmy = (playerIndex, armyIndex, number) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].addUnitsToArmy(armyIndex, number);
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
              {units.map((unit, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Paper elevation={3} sx={{p: 2}}>
                    <Typography variant="h6">{unit.constructor.name}</Typography>
                    <Typography>Attack: {unit.attack}</Typography>
                    <Typography>Defense: {unit.defend}</Typography>
                    <Typography>Health: {unit.health}</Typography>
                    <Typography>Range: {unit.range}</Typography>
                    <Typography>Speed: {unit.speed}</Typography>
                    <Typography>Cost: {unit.cost}</Typography>
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
                  <Button variant="outlined" sx={{m: 1}} onClick={() => handleAddArmy(playerIndex, 'Infantry', 10)}>
                    Infantry Group +
                  </Button>
                  <Button variant="outlined" sx={{m: 1}} onClick={() => handleAddArmy(playerIndex, 'Archer', 10)}>
                    Archer Group +
                  </Button>
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
                              Army {index + 1}: {army.units.length} x {army.units[0].constructor.name} - {army.location}
                            </Grid>
                            <Grid item>
                              <Button
                                size="small"
                                onClick={() => handleAddUnitsToArmy(playerIndex, index, 1)}
                              >
                                Add 1 Unit
                              </Button>
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
                          Attacks Player {defenderPlayerIndex + 1}
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