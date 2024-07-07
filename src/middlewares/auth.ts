import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';
import ApiError from "../errors/Api.error.js";

export async function authorize(req: Request, res: Response, next: NextFunction) {
    try {
        const token: string = req.headers.authorization!.split(' ')[1];
        // @ts-ignore
        const { userId } = jwt.verify(token, process.env.JWT_KEY);
        const user = (await User.findUserById(userId)).rows[0];
        if (!user) throw new ApiError(`User with id ${req.params.id} not found`)
        if (req.params.id && (userId !== req.params.id) && req.method !== "GET") throw new ApiError("You are not allowed to perform this action", 403, 'UnauthorizedRequestError');
        // @ts-ignore
        req.user = user;
        next();
    } catch (error) {
        // @ts-ignore
        req.status = 401;
        return next(error);
    }
};