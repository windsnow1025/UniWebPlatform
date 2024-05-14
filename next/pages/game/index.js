'use client';

import React, {useEffect, useState} from "react";
import {
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  ThemeProvider,
  Typography
} from "@mui/material";
import HeaderAppBar from "../../app/components/common/HeaderAppBar";
import useThemeHandler from "../../app/hooks/useThemeHandler";
import graph from "../../src/logic/game/data/Graph";
import unitClasses from "../../src/logic/game/data/Unit";
import initPlayers from "../../src/logic/game/data/Player";

import dynamic from 'next/dynamic';
import GameSystem from "../../src/logic/game/GameSystem";
import UnitProperties from "../../app/components/game/UnitProperties";

const GraphComponent = dynamic(() => import('../../app/components/game/GraphComponent'), {
  ssr: false,
});

function Index() {
  const {systemTheme, setSystemTheme, muiTheme} = useThemeHandler();
  const title = "Game";
  useEffect(() => {
    document.title = title;
  }, []);

  const [, forceUpdate] = useState();

  const [gameSystem, setGameSystem] = useState(new GameSystem(initPlayers, graph));
  const [armySelectedByPlayers, setArmySelectedByPlayers] = useState(gameSystem.players.map(() => 0));
  const [armyMoveLocationOfPlayers, setArmyMoveLocationOfPlayers] = useState(
    gameSystem.players.map(player => player.armies.map(() => ""))
  );

  const handleAddArmy = (playerIndex, unitType, number) => {
    gameSystem.addArmyToPlayer(playerIndex, unitType, number);

    const newMoveLocations = [...armyMoveLocationOfPlayers];
    newMoveLocations[playerIndex] = [...newMoveLocations[playerIndex], ""];
    setArmyMoveLocationOfPlayers(newMoveLocations);

    forceUpdate({});
  };

  const handleCombat = (attackerPlayerIndex, defenderPlayerIndex) => {
    const attackerArmyIndex = armySelectedByPlayers[attackerPlayerIndex];
    const defenderArmyIndex = armySelectedByPlayers[defenderPlayerIndex];

    gameSystem.playerArmyCombat(attackerPlayerIndex, defenderPlayerIndex, attackerArmyIndex, defenderArmyIndex);
    forceUpdate({});
  };

  const handleSelectArmy = (playerIndex, armyIndex) => {
    const updatedSelectedArmies = [...armySelectedByPlayers];
    updatedSelectedArmies[playerIndex] = armyIndex;
    setArmySelectedByPlayers(updatedSelectedArmies);
  };

  const handleMoveLocationChange = (playerIndex, armyIndex, newLocation) => {
    const newMoveLocations = armyMoveLocationOfPlayers.map((locations, pIndex) =>
      pIndex === playerIndex
        ? locations.map((location, aIndex) =>
          aIndex === armyIndex ? newLocation : location
        )
        : locations
    );
    setArmyMoveLocationOfPlayers(newMoveLocations);
  };

  const handleMoveArmy = (playerIndex, armyIndex) => {
    console.log(armyMoveLocationOfPlayers);
    const newLocation = armyMoveLocationOfPlayers[playerIndex][armyIndex];
    if (!newLocation) {
      return;
    }
    gameSystem.movePlayerArmy(playerIndex, armyIndex, newLocation);
    forceUpdate({});
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme/>
      <HeaderAppBar
        title={title}
        systemTheme={systemTheme}
        setSystemTheme={setSystemTheme}
      />
      <div className="m-4">
        <UnitProperties/>
        <GraphComponent graph={graph} attributes={gameSystem.locationInfos}/>
        <div className="flex-around">
          {gameSystem.players.map((player, playerIndex) => (
            <div key={playerIndex}>
              <Typography variant="h6">Player {player.name}</Typography>
              <Typography variant="subtitle1">Money: ${player.money}</Typography>
              {unitClasses.map((unitClass, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  sx={{m: 1}}
                  onClick={() => handleAddArmy(playerIndex, unitClass.name, 10)}
                >
                  10*{unitClass.name}
                </Button>
              ))}
              <RadioGroup
                value={armySelectedByPlayers[playerIndex]}
                onChange={(e) => handleSelectArmy(playerIndex, parseInt(e.target.value))}
              >
                {player.armies.map((army, armyIndex) => (
                  <FormControlLabel
                    value={armyIndex}
                    control={<Radio/>}
                    label={
                      <div className="flex-around">
                        <div>
                          {army.units.length} * {army.unitType} - {army.location}
                        </div>
                        <div className="flex-around m-2">
                          <div className="m-2">
                            <FormControl size="small">
                              <InputLabel>Move To</InputLabel>
                              <Select
                                value={armyMoveLocationOfPlayers[playerIndex][armyIndex]}
                                label="Move To"
                                onChange={(e) => handleMoveLocationChange(playerIndex, armyIndex, e.target.value)}
                                sx={{width: 120}}
                              >
                                {army.getMovableLocations(graph).map(location => (
                                  <MenuItem key={location} value={location}>{location}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          <Button
                            variant="contained"
                            onClick={() => handleMoveArmy(playerIndex, armyIndex)}
                            size="small"
                          >
                            Move
                          </Button>
                        </div>
                      </div>
                    }
                    key={armyIndex}
                  />
                ))}
              </RadioGroup>
              {gameSystem.players.map((_, defenderPlayerIndex) => {
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
  );
}

export default Index;