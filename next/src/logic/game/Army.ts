import Unit from "@/src/logic/game/Unit";

class Army<T extends Unit> {
    public units: T[];

    constructor(unitFactory: () => T, unitNumbers: number) {
        this.units = [];
        for (let i = 0; i < unitNumbers; i++) {
            this.units.push(unitFactory());
        }
    }

    removeDeadUnits() {
        this.units = this.units.filter(unit => unit.currentHealth > 0);
    }
}

export default Army;