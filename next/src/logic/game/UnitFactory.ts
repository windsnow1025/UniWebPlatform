import Infantry from "@/src/logic/game/Units/Infantry";
import Archer from "@/src/logic/game/Units/Archer";
import Unit from "@/src/logic/game/Unit";

export const unitTypes = {
    Infantry: Infantry,
    Archer: Archer
};

export function createUnit(unitType: keyof typeof unitTypes): Unit {
    const UnitClass = unitTypes[unitType];
    return new UnitClass();
}