import Player from "@/src/game/Player";
import Graph from "@/src/game/Graph";
import {UnitTypeNames} from "@/src/game/UnitFactory";
import playerLocations from "@/src/game/data/PlayerLocation";
import graph from "@/src/game/data/Graph";

interface LocationInfo {
  type: string;
  count: number;
  playerIndex: number;
}

interface LocationInfos {
  [location: string]: LocationInfo[];
}

class GameSystem {
  public players: Player[];
  public graph: Graph;

  constructor(players: Player[], graph: Graph) {
    this.players = players;
    this.graph = graph;
  }

  get locationInfos(): LocationInfos {
    return this.players.reduce<LocationInfos>((acc, player, playerIndex) => {
      player.armies.forEach(army => {
        if (!acc[army.location]) {
          acc[army.location] = [];
        }
        acc[army.location].push({
          type: army.unitType as string,
          count: army.units.length,
          playerIndex: playerIndex
        });
      });
      return acc;
    }, {});
  }

  addArmyToPlayer(playerIndex: number, unitType: UnitTypeNames, number: number) {
    const location = playerLocations[playerIndex];
    this.players[playerIndex].buyUnitsToLocation(unitType, location, number);
  }

  playerArmyCombat(attackerPlayerIndex: number, defenderPlayerIndex: number, attackerArmyIndex: number, defenderArmyIndex: number) {
    const attackerPlayer = this.players[attackerPlayerIndex];
    const defenderPlayer = this.players[defenderPlayerIndex];
    attackerPlayer.attack(defenderPlayer, attackerArmyIndex, defenderArmyIndex, this.graph);
  }

  movePlayerArmy(playerIndex: number, armyIndex: number, newLocation: string) {
    this.players[playerIndex].moveArmy(armyIndex, newLocation, graph);
  }

}

export default GameSystem;