import { NextFunction, Request, Response } from "express";
import { validatorCallback } from "../validation/validate";

export const addBikeValidator = async (req: Request, res: Response, next: NextFunction) => {
    const rules = {
        "name": "required|max:100",
        "weight": "required|min:0"
    }
    await validatorCallback(req.body, rules, res, next);
}