import Unit from "@/src/logic/game/Unit";
import {unitTypeMap, UnitTypeNames} from "@/src/logic/game/UnitFactory";
import Graph from "@/src/logic/game/Graph";

class Army {
    public units: Unit[];
    public unitType: UnitTypeNames;
    public unitClass: typeof Unit;
    public location: string;

    constructor(unitType: UnitTypeNames, location: string) {
        this.units = [];
        this.unitType = unitType;
        this.unitClass = unitTypeMap[unitType];
        this.location = location;
    }

    addUnits(numbers: number) {
        for (let i = 0; i < numbers; i++) {
            const UnitClass = unitTypeMap[this.unitType];
            this.units.push(new UnitClass());
        }
    }

    removeDeadUnits() {
        this.units = this.units.filter(unit => unit.currentHealth > 0);
    }

    canMove(newLocation: string, graph: Graph): boolean {
        const distance = graph.getDistance(this.location, newLocation);
        if (distance > this.unitClass.speed || newLocation === this.location) {
            return false;
        } else {
            return true;
        }
    }
}

export default Army;