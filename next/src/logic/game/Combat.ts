import Unit from "@/src/logic/game/Unit";
import Army from "@/src/logic/game/Army";

export function armyCombat<T extends Unit, U extends Unit>(
    attackerArmy: Army<T>, defenderArmy: Army<U>, distance: number
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

function isCombatEnd<T extends Unit, U extends Unit>(
    army1: Army<T>, army2: Army<U>
): boolean {
    return (army1.units.length <= 0 || army2.units.length <= 0)
}

function armyAttack<T extends Unit, U extends Unit>(
    attackerArmy: Army<T>, defenderArmy: Army<U>
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
    army: Army<T>
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
