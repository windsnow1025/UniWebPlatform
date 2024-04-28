import Unit from "@/src/logic/game/Unit";

class Archer extends Unit {
    public attack: number = 5;
    public defend: number = 1;
    public health: number = 10;
    public currentHealth: number = this.health;
    public range: number = 1;
    public speed: number = 1;
    public cost: number = 1;
}

export default Archer;