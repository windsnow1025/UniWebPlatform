import Unit from "@/src/game/Unit";
import {unitTypeMap, UnitTypeNames} from "@/src/game/UnitFactory";
import Graph from "@/src/game/Graph";

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

  public addUnits(numbers: number) {
    for (let i = 0; i < numbers; i++) {
      const UnitClass = unitTypeMap[this.unitType];
      this.units.push(new UnitClass());
    }
  }

  public removeDeadUnits() {
    this.units = this.units.filter(unit => unit.currentHealth > 0);
  }

  public getMovableLocations(graph: Graph) {
    return Array.from(graph.nodes.keys())
      .filter(location => this.canMove(location, graph));
  }

  public canMove(newLocation: string, graph: Graph): boolean {
    const distance = graph.getDistance(this.location, newLocation);
    if (distance > this.unitClass.speed || newLocation === this.location) {
      return false;
    } else {
      return true;
    }
  }

}

export default Army;