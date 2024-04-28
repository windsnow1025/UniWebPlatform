import Unit from "@/src/logic/game/Unit";

class Army {
    public units: Unit[];

    constructor(units: Unit[]) {
        this.units = units;
    }

    removeDeadUnits() {
        this.units = this.units.filter(unit => unit.currentHealth > 0);
    }
}

export default Army;