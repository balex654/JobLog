import { NextFunction, Request, Response } from "express";
import { validator } from "../validation/validate";

export const addUserValidator = async (req: Request, res: Response, next: NextFunction) => {
    const rules = {
        "first_name": "required|max:100",
        "last_name": "required|max:100",
        "email": "required|email|max:200",
        "weight": "required",
        "id": "required|max:200"
    };
    await validator(req.body, rules, {}, (err: any, valid: any) => {
        if (!valid) {
            res.status(400).send({
                message: 'Validation failure',
                data: err
            });
        }
        else {
            next();
        }
    }).catch(err => console.log(err));
}