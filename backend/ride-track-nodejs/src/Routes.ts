import express from "express";
import UserController from "./api/UserController";

const router = express.Router();

router.post('/user', UserController.addUser);
router.get('/user/:id', UserController.getUser);

export = router;