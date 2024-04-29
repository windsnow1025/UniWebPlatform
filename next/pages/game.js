'use client';

import '../src/asset/css/index.css';

import React, {useEffect, useState} from "react";
import {
  Button,
  Container,
  CssBaseline, FormControl,
  FormControlLabel,
  Grid, InputLabel, MenuItem,
  Paper,
  Radio,
  RadioGroup, Select,
  ThemeProvider,
  Typography
} from "@mui/material";
import HeaderAppBar from "../app/components/common/HeaderAppBar";
import useThemeHandler from "../app/hooks/useThemeHandler";
import Player from "../src/logic/game/Player";
import graph from "../src/logic/game/data/Graph";

import dynamic from 'next/dynamic';
import {unitClasses} from "../src/logic/game/data/Unit";

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
  const [moveLocations, setMoveLocations] = useState(players.map(() => ""));

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

  const handleMoveArmy = (playerIndex, armyIndex) => {
    const newPlayers = [...players];
    const player = newPlayers[playerIndex];
    const army = player.armies[armyIndex];
    const newLocation = moveLocations[playerIndex];

    if (newLocation) {
      army.move(newLocation, graph);
      setPlayers(newPlayers);
    }
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
          <div className="m-4">
            <Typography variant="h5" className="text-center">Unit Properties</Typography>
            <div className="flex-around">
              {unitClasses.map((unitClass, index) => (
                <Paper key={index} elevation={3} className="m-4 p-4 pr-32">
                  <Typography variant="h6">{unitClass.name}</Typography>
                  <Typography>Attack: {unitClass.attack}</Typography>
                  <Typography>Defense: {unitClass.defend}</Typography>
                  <Typography>Health: {unitClass.health}</Typography>
                  <Typography>Range: {unitClass.range}</Typography>
                  <Typography>Speed: {unitClass.speed}</Typography>
                  <Typography>Cost: {unitClass.cost}</Typography>
                </Paper>
              ))}
            </div>
            <GraphComponent graph={graph} armies={armies}/>
            <div className="flex-around">
              {players.map((player, playerIndex) => (
                <div key={playerIndex}>
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
                        control={<Radio />}
                        label={
                          <div className="flex-around">
                            <div>
                              Army {index + 1}: {army.units.length} x {army.unitType} - {army.location}
                            </div>
                            <div className="flex-around m-2">
                              <div className="m-2">
                                <FormControl size="small">
                                  <InputLabel id={`move-select-label-${playerIndex}-${index}`}>Move To</InputLabel>
                                  <Select
                                    labelId={`move-select-label-${playerIndex}-${index}`}
                                    value={moveLocations[playerIndex]}
                                    label="Move To"
                                    onChange={(e) => {
                                      const newMoveLocations = [...moveLocations];
                                      newMoveLocations[playerIndex] = e.target.value;
                                      setMoveLocations(newMoveLocations);
                                    }}
                                    sx={{ width: 120 }}
                                  >
                                    {Array.from(graph.nodes.keys()).filter(node => army.canMove(node, graph)).map(node => (
                                      <MenuItem key={node} value={node}>{node}</MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>
                              <Button variant="contained" onClick={() => handleMoveArmy(playerIndex, index)} size="small">Move</Button>
                            </div>
                          </div>
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
                </div>
              ))}
            </div>
          </div>
        </ThemeProvider>
      }
    </>
  );
}

export default Game;