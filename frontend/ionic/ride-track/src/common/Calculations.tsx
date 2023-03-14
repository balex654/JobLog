import { Unit } from "../model/user/Unit";
import { Storage } from "@ionic/storage";

export function ConvertPoundsToKilos(pounds: number): number {
    const kilos = pounds * 0.453592;
    const rounded = Math.round(kilos * 10) / 10;
    return rounded;
}

export function ConvertKilosToPounds(kilos: number): number {
    const pounds = kilos * 2.20462;
    const rounded = Math.round(pounds * 10) / 10;
    return rounded;
}

export async function GetWeightValueByUnit(kilos: number, storage: Storage) {
    const unit = JSON.parse(await storage.get("user")!).unit;
    if (unit === Unit.Imperial) {
        return ConvertKilosToPounds(kilos);
    }
    else {
        return kilos;
    }
}