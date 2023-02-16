import express, { NextFunction, Request, Response } from "express";
import userController from "./api/user-controller";
import bikeController from "./api/bike-controller";
import { addBikeValidator } from "./application/bike/validator";
import { addUserValidator } from "./application/user/validator";
import activityController from "./api/activity-controller";
import { addActivityValidator } from "./application/activity/validator";

const router = express.Router();
router.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body !== undefined && Object.values(req.body)[0] === '') {
        req.body = JSON.parse(Object.keys(req.body)[0]);
    }
    next();
});

router.post('/user', addUserValidator, userController.addUser);
router.get('/user', userController.getUserById);
router.put('/user', addUserValidator, userController.editUser);

router.post('/bike', addBikeValidator, bikeController.addBike);
router.delete('/bike/:id', bikeController.deleteBike);
router.get('/bike/:id', bikeController.getBikeById);
router.put('/bike/:id', addBikeValidator, bikeController.editBike);
router.get('/bike', bikeController.getBikes);

router.post('/activity', addActivityValidator, activityController.addActivity);
router.get('/activity', activityController.getActivities);
router.get('/activity/:id', activityController.getActivityById);
router.get('/activity/:id/gps-point', activityController.getGpsPointsByActivityId);

export = router;
