import { NextFunction, Request, Response } from "express";
import { GetUserByIdQuery } from "../application/user/get-user-by-id";
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { UserForm } from "../contract/user/user-form";
import { AddUserCommand } from "../application/user/add-user";
import { EditUserCommand } from "../application/user/edit-user";

const addUser = async (req: Request, res: Response, next: NextFunction) => {
    const userForm = req.body as UserForm;
    const comamnd = new AddUserCommand();
    const response = await comamnd.addUser(userForm);
    return res.status(response.status).json(response.resource);
}

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const command = new GetUserByIdQuery();
    const response = await command.getUserById(id);
    return res.status(response.status).json(response.resource);
};

const editUser = async (req: Request, res: Response, next: NextFunction) => {
    let id: string = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const userForm = req.body as UserForm;
    userForm.id = id;
    const command = new EditUserCommand();
    const response = await command.editUser(userForm);
    return res.status(response.status).json(response.resource);
}

export default { addUser, getUserById, editUser };