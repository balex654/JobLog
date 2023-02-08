import { NextFunction, Response } from "express";

const Validator = require('validatorjs');

export const validator = async (body: any, rules: any, customMessages: any, callback: any) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
}

export const validatorCallback = async (body: any, rules: any, res: Response, next: NextFunction) => {
    await validator(body, rules, {}, (err: any, valid: any) => {
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