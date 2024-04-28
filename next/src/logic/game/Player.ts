import Army from "@/src/logic/game/Army";
import Unit from "@/src/logic/game/Unit";

class Player {
    public armies: Army<Unit>[];
    public money: number;

    constructor() {
        this.armies = [];
        this.money = 100;
    }

    addArmy(unitFactory: () => Unit) {
        const army = new Army<Unit>(unitFactory);
        this.armies.push(army);
    }

    addUnitsToArmy(armyIndex: number, numbers: number) {
        const army = this.armies[armyIndex];
        army.addUnits(numbers);
        this.money -= army.units[0].cost * numbers;
    }

    removeEmptyArmies() {
        this.armies = this.armies.filter(army => army.units.length > 0);
    }
}

export default Player;