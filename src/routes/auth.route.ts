import { Router, Request, Response, NextFunction } from "express";
import * as userValidation from '../validations/user.validation.js';
// import * as organisationValidation from '../validations/organisation.validation.js';
import { registerUser } from "../controllers/auth.route.js";
import validate from "../middlewares/validate.js";
const authRouter = Router();

authRouter.route('/register').post(validate(userValidation.registerUser), registerUser);

export default authRouter;
