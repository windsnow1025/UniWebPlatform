import Unit from "@/src/logic/game/Unit";

class Archer extends Unit {
    public static attack: number = 5;
    public static defend: number = 1;
    public static health: number = 10;
    public static range: number = 2;
    public static speed: number = 1;
    public static cost: number = 1;
    public currentHealth: number = Archer.health;
}

export default Archer;