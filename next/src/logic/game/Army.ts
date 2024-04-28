import Unit from "@/src/logic/game/Unit";

class Army<T extends Unit> {
    public units: T[];

    constructor(units: T[]) {
        this.units = units;
    }

    removeDeadUnits() {
        this.units = this.units.filter(unit => unit.currentHealth > 0);
    }
}

export default Army;