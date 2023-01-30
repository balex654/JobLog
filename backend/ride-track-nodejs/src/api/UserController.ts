import { NextFunction, Request, Response } from "express";

const addUser = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(201).json({
        message: "user added"
    });
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = req.params.id;
    return res.status(200).json({
        message: id
    });
};

export default { addUser, getUser };