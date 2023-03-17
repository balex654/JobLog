import { Unit } from "./Unit";

export interface UserResponse {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
    weight: number;
    unit: Unit;
}