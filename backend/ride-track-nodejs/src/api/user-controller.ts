import { NextFunction, Request, Response } from "express";
import { GetUserByIdCommand } from "../application/user/get-user-by-id";

const addUser = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(201).json({
        message: "user added"
    });
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.id;
    const command = new GetUserByIdCommand();
    const response = await command.getUserById(id);
    return res.status(response.status).json(response.resource);
};

export default { addUser, getUserById };