import Unit from "@/src/logic/game/Unit";

class Army<T extends Unit> {
    public units: T[];
    public unitFactory: () => T;

    constructor(unitFactory: () => T, unitNumbers: number) {
        this.units = [];
        this.unitFactory = unitFactory;
    }

    addUnits(numbers: number) {
        for (let i = 0; i < numbers; i++) {
            this.units.push(this.unitFactory());
        }
    }

    removeDeadUnits() {
        this.units = this.units.filter(unit => unit.currentHealth > 0);
    }
}

export default Army;