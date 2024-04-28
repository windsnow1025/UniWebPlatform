import Army from "@/src/logic/game/Army";
import Unit from "@/src/logic/game/Unit";
import Infantry from "@/src/logic/game/Units/Infantry";

class Player {
    public armies: Army<Unit>[];
    public money: number;

    constructor() {
        this.armies = [new Army<Unit>(() => new Infantry(), 10)];
        this.money = 100;
    }

    removeEmptyArmies() {
        this.armies = this.armies.filter(army => army.units.length > 0);
    }
}

export default Player;