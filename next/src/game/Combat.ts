import Unit from "@/src/game/Unit";
import Army from "@/src/game/Army";

export function armyCombat(
  attackerArmy: Army, defenderArmy: Army, distance: number
) {
  if (isCombatEnd(attackerArmy, defenderArmy)) return;
  if (attackerArmy.unitClass.range >= distance) {
    const isCombatEnd = armyAttack(attackerArmy, defenderArmy);
    if (isCombatEnd) {
      return;
    }
  }
  if (defenderArmy.unitClass.range >= distance) {
    armyAttack(defenderArmy, attackerArmy);
  }
}

function isCombatEnd(
  army1: Army, army2: Army
): boolean {
  return (army1.units.length <= 0 || army2.units.length <= 0)
}

function armyAttack(
  attackerArmy: Army, defenderArmy: Army
) {
  for (const attackerUnit of attackerArmy.units) {
    const defenderUnit = findWeakestUnit(defenderArmy);
    unitAttack(defenderUnit, attackerArmy.unitClass, defenderArmy.unitClass);
    defenderArmy.removeDeadUnits();
    if (isCombatEnd(attackerArmy, defenderArmy)) {
      return true;
    }
  }
  return false;
}

function findWeakestUnit<T extends Unit>(
  army: Army
): Unit {
  const unitHealth = army.unitClass.health
  return army.units.reduce((weakest, unit) => {
    const currentHealthRatio = unit.currentHealth / unitHealth;
    const weakestHealthRatio = weakest.currentHealth / unitHealth;
    return currentHealthRatio < weakestHealthRatio ? unit : weakest;
  }, army.units[0]);
}

function unitAttack(defenderUnit: Unit, attackerClass: typeof Unit, defenderClass: typeof Unit) {
  defenderUnit.currentHealth -= attackerClass.attack - defenderClass.defend;
}
