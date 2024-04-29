import Infantry from "@/src/logic/game/unit/Infantry";
import Archer from "@/src/logic/game/unit/Archer";
import Unit from "@/src/logic/game/Unit";

export const unitClasses = [Infantry, Archer];

export const unitTypes = unitClasses.reduce((acc, UnitClass) => {
    acc[UnitClass.name] = UnitClass;
    return acc;
}, {} as { [key: string]: typeof Unit });

export function createUnit(unitType: keyof typeof unitTypes): Unit {
    const UnitClass = unitTypes[unitType];
    return new UnitClass();
}