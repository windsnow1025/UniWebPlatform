import Unit from "@/src/game/Unit";
import unitClasses from "@/src/game/data/Unit";

interface UnitTypeMap {
    [key: string]: typeof Unit;
}

export const unitTypeMap = unitClasses.reduce<UnitTypeMap>((acc, UnitClass) => {
    acc[UnitClass.name] = UnitClass;
    return acc;
}, {});

export type UnitTypeNames = keyof typeof unitTypeMap;
