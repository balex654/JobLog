import { NextFunction, Request, Response } from "express";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { AddActivityCommand } from "../application/activity/add-activity";
import { ActivityForm } from "../contract/activity/activity-form";

const addActivity = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const activityForm = req.body as ActivityForm;
    const command = new AddActivityCommand();
    const response = await command.addActivity(activityForm, userId);
    return res.status(response.status).json(response.resource);
};

export default { addActivity };