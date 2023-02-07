import express from "express";
import UserController from "./api/user-controller";

const router = express.Router();

router.post('/user', UserController.addUser);
router.get('/user/:id', UserController.getUserById);

export = router;