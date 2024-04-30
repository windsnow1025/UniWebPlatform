import Unit from "@/src/logic/game/Unit";
import {createUnit, unitTypeMap, UnitTypeNames} from "@/src/logic/game/UnitFactory";
import Graph from "@/src/logic/game/Graph";

class Army<T extends Unit> {
    public units: T[];
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
            this.units.push(createUnit(this.unitType) as T);
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

    move(newLocation: string, graph: Graph) {
        if (!this.canMove(newLocation, graph)) {
            return false;
        }
        this.location = newLocation;
        return true;
    }
}

export default Army;