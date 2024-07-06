import { Router, Request, Response, NextFunction } from "express";
import * as userValidation from '../validations/user.validation.js';
import { login, registerUser } from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.js";
import { getUser } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.route("/:id").get(validate(userValidation.getUser), authorize, getUser)

export default userRouter;