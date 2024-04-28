import Army from "@/src/logic/game/Army";
import Unit from "@/src/logic/game/Unit";

class Player {
    public armies: Army<Unit>[] = [];

    removeEmptyArmies() {
        this.armies = this.armies.filter(army => army.units.length > 0);
    }
}

export default Player;