import { NextFunction, Request, Response } from "express";
import { validatorCallback } from "../validation/validate";

export const addActivityValidator = async (req: Request, res: Response, next: NextFunction) => {
    const activityRules = {
        "name": "required|max:100",
        "start_date": "required",
        "end_date": "required",
        "moving_time": "required|min:0",
        "bike_id": "required",
        "total_mass": "required|min:0",
        "gps_points": "required|array|min:1",
        "gps_points.*.date": "required",
        "gps_points.*.speed": "required|min:0",
        "gps_points.*.latitude": "required|min:-90|max:90",
        "gps_points.*.longitude": "required|min:-180|max:180",
        "gps_points.*.altitude": "required|min:0"
    }
    await validatorCallback(req.body, activityRules, res, next);
}