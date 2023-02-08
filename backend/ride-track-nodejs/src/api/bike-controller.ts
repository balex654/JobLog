import { NextFunction, Request, Response } from "express";
import { AddBikeCommand } from "../application/bike/add-bike";
import { BikeForm } from "../contract/bike/bike-form";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { DeleteBikeCommand } from "../application/bike/delete-bike";

const addBike = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const bikeForm = req.body as BikeForm;
    const command = new AddBikeCommand();
    const response = await command.addBike(bikeForm, userId);
    return res.status(response.status).json(response.resource);
}

const deleteBike = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const bikeId = parseInt(req.params.id);
    const command = new DeleteBikeCommand()
    const response = await command.deleteBikeCommand(bikeId, userId);
    return res.status(response.status).json(response.resource);
}

export default { addBike, deleteBike };