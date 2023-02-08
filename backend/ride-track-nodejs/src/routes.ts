import express from "express";
import userController from "./api/user-controller";
import bikeController from "./api/bike-controller";
import { addBikeValidator } from "./application/bike/validator";
import { addUserValidator } from "./application/user/validator";

const router = express.Router();

router.post('/user', addUserValidator, userController.addUser);
router.get('/user', userController.getUserById);

router.post('/bike', addBikeValidator, bikeController.addBike);
router.delete('/bike/:id', bikeController.deleteBike);
router.get('/bike/:id', bikeController.getBikeById);
router.put('/bike/:id', addBikeValidator, bikeController.editBike);
router.get('/bike', bikeController.getBikes);

export = router;
