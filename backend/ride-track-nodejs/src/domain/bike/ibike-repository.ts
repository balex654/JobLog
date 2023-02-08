import { Bike } from "./bike";

export interface IBikeRepository {
    addBike(bike: Bike): Promise<Bike>;
}