import { NextFunction, Request, Response } from "express";
import { validator, validatorCallback } from "../validation/validate";

export const addUserValidator = async (req: Request, res: Response, next: NextFunction) => {
    const rules = {
        "first_name": "required|max:100",
        "last_name": "required|max:100",
        "email": "required|email|max:200",
        "weight": "required",
        "id": "required|max:200"
    };
    await validatorCallback(req.body, rules, res, next);
}