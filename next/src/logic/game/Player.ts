import Army from "@/src/logic/game/Army";
import Unit from "@/src/logic/game/Unit";
import Graph from "@/src/logic/game/Graph";
import {armyCombat} from "@/src/logic/game/Combat";
import {unitTypes} from "@/src/logic/game/UnitFactory";

class Player {
    public armies: Army<Unit>[];
    public money: number;

    constructor() {
        this.armies = [];
        this.money = 100;
    }

    public addUnitsToLocation(unitType: keyof typeof unitTypes, location: string, numbers: number) {
        const existingArmyIndex = this.armies.findIndex(army =>
            army.unitType === unitType && army.location === location
        );

        if (existingArmyIndex !== -1) {
            this.addUnitsToArmy(existingArmyIndex, numbers);
        } else {
            this.addArmy(unitType, location);
            this.addUnitsToArmy(this.armies.length - 1, numbers);
        }
    }

    public combat(defenderPlayer: Player, attackerArmyIndex: number, defenderArmyIndex: number, graph: Graph) {
        const attackerArmy = this.armies[attackerArmyIndex];
        const defenderArmy = defenderPlayer.armies[defenderArmyIndex];

        if (!attackerArmy || !defenderArmy) {
            return;
        }

        armyCombat(attackerArmy, defenderArmy, graph.getDistance(attackerArmy.location, defenderArmy.location));

        this.removeEmptyArmies();
        defenderPlayer.removeEmptyArmies();
    }

    private addArmy(unitType: keyof typeof unitTypes, location: string) {
        const army = new Army<Unit>(unitType, location);
        this.armies.push(army);
    }

    private addUnitsToArmy(armyIndex: number, numbers: number) {
        const army = this.armies[armyIndex];
        army.addUnits(numbers);
        this.money -= army.units[0].cost * numbers;
    }

    private removeEmptyArmies() {
        this.armies = this.armies.filter(army => army.units.length > 0);
    }
}

export default Player;