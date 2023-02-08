import express from "express";
import UserController from "./api/user-controller";
import { addUserValidator } from "./application/user/validator";

const router = express.Router();

router.post('/user', addUserValidator, UserController.addUser);
router.get('/user', UserController.getUserById);

export = router;
