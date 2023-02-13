import { NextFunction, Request, Response } from "express";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { AddActivityCommand } from "../application/activity/add-activity";
import { GetActivitiesQuery } from "../application/activity/get-activities";
import { GetActivityByIdQuery } from "../application/activity/get-activity-by-id";
import { ActivityForm } from "../contract/activity/activity-form";

const addActivity = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const activityForm = req.body as ActivityForm;
    const command = new AddActivityCommand();
    const response = await command.addActivity(activityForm, userId);
    return res.status(response.status).json(response.resource);
};

const getActivities = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const query = new GetActivitiesQuery();
    const response = await query.getActivites(userId);
    return res.status(response.status).json(response.resource);
}

const getActivityById = async (req: Request, res: Response, next: NextFunction) => {
    const userId = jwtDecode<JwtPayload>(req.headers.authorization!).sub!;
    const activityId = parseInt(req.params.id);
    const query = new GetActivityByIdQuery();
    const response = await query.getActivityById(activityId, userId);
    return res.status(response.status).json(response.resource);
}

export default { addActivity, getActivities, getActivityById };