import Army from "@/src/logic/game/Army";
import Unit from "@/src/logic/game/Unit";
import Infantry from "@/src/logic/game/Units/Infantry";
import Archer from "@/src/logic/game/Units/Archer";
import Graph from "@/src/logic/game/Graph";
import {armyCombat} from "@/src/logic/game/Combat";

const unitTypes = {
    Infantry: Infantry,
    Archer: Archer
};

class Player {
    public armies: Army<Unit>[];
    public money: number;

    constructor() {
        this.armies = [];
        this.money = 100;
    }

    addArmy(unitType: keyof typeof unitTypes, location: string) {
        const UnitClass = unitTypes[unitType];
        const unitFactory = () => new UnitClass();

        const army = new Army<Unit>(unitFactory, location);
        this.armies.push(army);
    }

    addUnitsToArmy(armyIndex: number, numbers: number) {
        const army = this.armies[armyIndex];
        army.addUnits(numbers);
        this.money -= army.units[0].cost * numbers;

        this.mergeArmies();
    }

    combat(defenderPlayer: Player, attackerArmyIndex: number, defenderArmyIndex: number, graph: Graph) {
        const attackerArmy = this.armies[attackerArmyIndex];
        const defenderArmy = defenderPlayer.armies[defenderArmyIndex];

        if (!attackerArmy || !defenderArmy) {
            return;
        }

        armyCombat(attackerArmy, defenderArmy, graph.getDistance(attackerArmy.location, defenderArmy.location));

        this.removeEmptyArmies();
        defenderPlayer.removeEmptyArmies();
    }

    removeEmptyArmies() {
        this.armies = this.armies.filter(army => army.units.length > 0);
    }

    mergeArmies() {
        const locationMap = new Map<string, Map<string, Army<Unit>>>();

        // Organize armies by location and unit type
        this.armies.forEach(army => {
            let typeMap = locationMap.get(army.location);
            if (!typeMap) {
                typeMap = new Map<string, Army<Unit>>();
                locationMap.set(army.location, typeMap);
            }
            const unitType = army.units[0].constructor.name;
            if (typeMap.has(unitType)) {
                const existingArmy = typeMap.get(unitType)!;
                existingArmy.addUnits(army.units.length);
            } else {
                typeMap.set(unitType, army);
            }
        });

        // Flatten the map to a single list of merged armies
        this.armies = [];
        locationMap.forEach(typeMap => {
            typeMap.forEach(army => {
                this.armies.push(army);
            });
        });
    }
}

export default Player;