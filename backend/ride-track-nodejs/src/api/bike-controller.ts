import { NextFunction, Request, Response } from "express";
import { AddBikeCommand } from "../application/bike/add-bike";
import { BikeForm } from "../contract/bike/bike-form";
import jwtDecode, { JwtPayload } from 'jwt-decode';

const addBike = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const bikeForm = req.body as BikeForm;
    const command = new AddBikeCommand();
    const response = await command.addBike(bikeForm, userId);
    return res.status(response.status).json(response.resource);
}

export default { addBike };