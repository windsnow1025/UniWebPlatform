import Unit from "@/src/game/Unit";

class Cavalry extends Unit {
  public static attack: number = 9;
  public static defend: number = 3;
  public static health: number = 20;
  public static range: number = 1;
  public static speed: number = 2;
  public static cost: number = 2;
  public currentHealth: number = Cavalry.health;
}

export default Cavalry;