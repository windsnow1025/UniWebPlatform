import Unit from "@/src/game/Unit";

class Infantry extends Unit {
    public static attack: number = 7;
    public static defend: number = 2;
    public static health: number = 10;
    public static range: number = 1;
    public static speed: number = 1;
    public static cost: number = 1;
    public currentHealth: number = Infantry.health;
}

export default Infantry;