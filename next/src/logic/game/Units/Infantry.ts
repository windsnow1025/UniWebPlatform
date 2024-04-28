import Unit from "@/src/logic/game/Unit";

class Infantry extends Unit {
    public attack: number = 7;
    public defend: number = 2;
    public health: number = 10;
    public currentHealth: number = this.health;
    public range: number = 0;
    public speed: number = 1;
    public cost: number = 1;
}

export default Infantry;