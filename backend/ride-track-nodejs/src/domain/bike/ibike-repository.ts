import { Bike } from "./bike";

export interface IBikeRepository {
    addBike(bike: Bike): Promise<Bike>;
    deleteBike(bikeId: number, userId: string): Promise<undefined>;
    getBikeById(bikeId: number, userId: string): Promise<Bike>;
}