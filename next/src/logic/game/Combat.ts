import Unit from "@/src/logic/game/Unit";
import Army from "@/src/logic/game/Army";

export function armyCombat(army1: Army, army2: Army, distance: number) {
    if (army1.units.length <= 0 || army2.units.length <= 0) {
        return;
    }
    if (army1.units[0].range >= distance) {
        armyAttack(army1, army2);
    }
    if (army2.units[0].range >= distance) {
        armyAttack(army2, army1);
    }
}

function armyAttack(attackerArmy: Army, defenderArmy: Army) {
    for (const attackerUnit of attackerArmy.units) {
        const defenderUnit = findWeakestUnit(defenderArmy);
        combat(attackerUnit, defenderUnit);
        defenderArmy.removeDeadUnits();
    }
}

function findWeakestUnit(army: Army): Unit {
    return army.units.reduce((weakest, unit) => {
        const currentHealthRatio = unit.currentHealth / unit.health;
        const weakestHealthRatio = weakest.currentHealth / weakest.health;
        return currentHealthRatio < weakestHealthRatio ? unit : weakest;
    }, army.units[0]);
}

function combat(attackerUnit: Unit, defenderUnit: Unit) {
    defenderUnit.currentHealth -= attackerUnit.attack - defenderUnit.defend;
}
