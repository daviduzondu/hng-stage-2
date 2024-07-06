import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';

export async function getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
        // const user = (await User.findUserById(id)).rows[0];

        // if (!user) throw new Error(`No user with id "${id}" found`);
        // @ts-ignore
        const { userId, firstName, email, lastName, phone } = req.user;

        res.status(200).json({
            "status": "success",
            "message": "User found!",
            "data": {
                userId,
                firstName,
                lastName,
                email,
                phone
            }
        })
    } catch (error: any) {
        console.error(error);
        return res.status(401).json({
            status: "Bad request",
            message: error.message,
            statusCode: 401
        })
    }
}