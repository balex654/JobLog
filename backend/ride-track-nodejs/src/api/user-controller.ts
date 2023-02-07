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
    const user = await command.getUserById(id);
    if (user == undefined) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    return res.status(200).json(user);
};

export default { addUser, getUserById };