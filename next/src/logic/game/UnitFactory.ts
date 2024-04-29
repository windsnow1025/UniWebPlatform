import Unit from "@/src/logic/game/Unit";
import {unitClasses} from "@/src/logic/game/data/Unit";

export const unitTypes = unitClasses.reduce((acc, UnitClass) => {
    acc[UnitClass.name] = UnitClass;
    return acc;
}, {} as { [key: string]: typeof Unit });

export function createUnit(unitType: keyof typeof unitTypes): Unit {
    const UnitClass = unitTypes[unitType];
    return new UnitClass();
}