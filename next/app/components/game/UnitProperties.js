import {Paper, Typography} from "@mui/material";
import unitClasses from "../../../src/logic/game/data/Unit";
import React from "react";

export default function UnitProperties() {
  return (
    <div>
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
    </div>
  )
}