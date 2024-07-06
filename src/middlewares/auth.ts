import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken';

export async function authorize(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (await User.findUserById(req.params.id)).rows[0];
        const token: string = req.headers.authorization!.split(' ')[1];
        // @ts-ignore
        const { userId } = jwt.verify(token, process.env.JWT_KEY);
        if (!user) throw new Error(`User with id ${req.params.id} not found`)
        if (userId !== req.params.id) throw new Error("You are not allowed to perform this action");
        // @ts-ignore
        req.user = user;
        next();
    } catch (error) {
        // @ts-ignore
        req.status=401;
        return next(error);
    }

};