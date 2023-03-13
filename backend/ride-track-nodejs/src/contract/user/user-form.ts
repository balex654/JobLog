import { Unit } from "../../domain/unit";

export interface UserForm {
    first_name: string;
    last_name: string;
    weight: number;
    email: string;
    id: string;
    unit: Unit;
}