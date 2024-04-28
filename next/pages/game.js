'use client';

import '../src/asset/css/index.css';

import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
import Infantry from "../src/logic/game/Units/Infantry";
import Archer from "../src/logic/game/Units/Archer";
import Player from "../src/logic/game/Player";
import { armyCombat } from "../src/logic/game/Combat";
import Graph from "../src/logic/game/Graph";

import dynamic from 'next/dynamic';

const GraphComponent = dynamic(() => import('../app/components/GraphComponent'), {
  ssr: false,
});

function Game() {
  const { systemTheme, setSystemTheme, muiTheme } = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  const [graph, setGraph] = useState(new Graph());

  useEffect(() => {
    graph.addNode("Player 1");
    graph.addNode("Player 1 City D");
    graph.addNode("Player 1 City L");
    graph.addNode("Player 1 City R");
    graph.addNode("Player 2");
    graph.addNode("Player 2 City D");
    graph.addNode("Player 2 City L");
    graph.addNode("Player 2 City R");
    graph.addNode("Player 3");
    graph.addNode("Player 3 City D");
    graph.addNode("Player 3 City L");
    graph.addNode("Player 3 City R");
    graph.addNode("Gate 12");
    graph.addNode("Gate 12");
    graph.addNode("Gate 23");
    graph.addNode("Center");
    graph.addEdge("Player 1", "Player 1 City D");
    graph.addEdge("Player 2", "Player 2 City D");
    graph.addEdge("Player 3", "Player 3 City D");
    graph.addEdge("Player 1 City D", "Center");
    graph.addEdge("Player 2 City D", "Center");
    graph.addEdge("Player 3 City D", "Center");
    graph.addEdge("Player 1", "Player 1 City R");
    graph.addEdge("Player 1 City R", "Gate 12");
    graph.addEdge("Player 1", "Player 1 City L");
    graph.addEdge("Player 1 City L", "Gate 13");
    graph.addEdge("Player 2", "Player 2 City R");
    graph.addEdge("Player 2 City R", "Gate 23");
    graph.addEdge("Player 2", "Player 2 City L");
    graph.addEdge("Player 2 City L", "Gate 12");
    graph.addEdge("Player 3", "Player 3 City R");
    graph.addEdge("Player 3 City R", "Gate 13");
    graph.addEdge("Player 3", "Player 3 City L");
    graph.addEdge("Player 3 City L", "Gate 23");
    setGraph(graph);
  }, []);

  const units = [new Infantry(), new Archer()];

  const [players, setPlayers] = useState([new Player()]);
  const [selectedArmies, setSelectedArmies] = useState([0]);
  const [distance, setDistance] = useState(0);

  const addPlayer = () => {
    setPlayers([...players, new Player()]);
    setSelectedArmies([...selectedArmies, 0]);
  };

  const handleAddArmy = (playerIndex, unitType, number) => {
    const newPlayers = [...players];
    const player = newPlayers[playerIndex];
    player.addArmy(unitType);
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
              {units.map((unit, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Paper elevation={3} sx={{ p: 2 }}>
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
            <GraphComponent graph={graph}/>
            <Button variant="contained" sx={{m: 1}} onClick={addPlayer}>Add Player</Button>
            <Grid container spacing={2}>
              {players.map((player, playerIndex) => (
                <Grid item xs={4} md={4} key={playerIndex}>
                  <Typography variant="h6">Player {playerIndex + 1}</Typography>
                  <Typography variant="subtitle1">Money: ${player.money}</Typography>
                  <Button variant="outlined" sx={{m: 1}} onClick={() => handleAddArmy(playerIndex, 'Infantry', 10)}>
                    Add Infantry Army
                  </Button>
                  <Button variant="outlined" sx={{m: 1}} onClick={() => handleAddArmy(playerIndex, 'Archer', 10)}>
                    Add Archer Army
                  </Button>
                  <RadioGroup
                    value={selectedArmies[playerIndex]}
                    onChange={(e) => handleSelectArmy(playerIndex, parseInt(e.target.value))}
                  >
                    {player.armies.map((army, index) => (
                      <FormControlLabel
                        value={index}
                        control={<Radio />}
                        label={
                          <Grid container alignItems="center">
                            <Grid item xs>
                              Army {index + 1}: {army.units[0].constructor.name} - {army.units.length} Units
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