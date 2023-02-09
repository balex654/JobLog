import express, { NextFunction, Request, Response } from "express";
import userController from "./api/user-controller";
import bikeController from "./api/bike-controller";
import { addBikeValidator } from "./application/bike/validator";
import { addUserValidator } from "./application/user/validator";

const router = express.Router();
router.use((req: Request, res: Response, next: NextFunction) => {
    if (req.body !== undefined && Object.values(req.body)[0] === '') {
        req.body = JSON.parse(Object.keys(req.body)[0]);
    }
    next();
});

router.post('/user', addUserValidator, userController.addUser);
router.get('/user', userController.getUserById);

router.post('/bike', addBikeValidator, bikeController.addBike);
router.delete('/bike/:id', bikeController.deleteBike);
router.get('/bike/:id', bikeController.getBikeById);
router.put('/bike/:id', addBikeValidator, bikeController.editBike);
router.get('/bike', bikeController.getBikes);

export = router;
