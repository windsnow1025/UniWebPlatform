import Unit from "@/src/logic/game/Unit";
import unitClasses from "@/src/logic/game/data/Unit";

interface UnitTypeMap {
    [key: string]: typeof Unit;
}

export const unitTypeMap = unitClasses.reduce<UnitTypeMap>((acc, UnitClass) => {
    acc[UnitClass.name] = UnitClass;
    return acc;
}, {});

export type UnitTypeNames = keyof typeof unitTypeMap;
