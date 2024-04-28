import Army from "@/src/logic/game/Army";
import Unit from "@/src/logic/game/Unit";

class Player {
    public armies: Army<Unit>[] = [];
}

export default Player;