import Unit from "@/src/logic/game/Unit";
import {unitClasses} from "@/src/logic/game/data/Unit";

export const unitTypeMap = unitClasses.reduce((acc, UnitClass) => {
    acc[UnitClass.name] = UnitClass;
    return acc;
}, {} as { [key: string]: typeof Unit });

export type UnitTypeNames = keyof typeof unitTypeMap;

export function createUnit(unitType: UnitTypeNames): Unit {
    const UnitClass = unitTypeMap[unitType];
    return new UnitClass();
}