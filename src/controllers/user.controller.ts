import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import ApiError from '../errors/Api.error.js';

export async function getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
        // @ts-ignore
        const user = (await User.getUserOrUserInOrg(id)).rows[0];


        if (!user) throw new Error('Failed to retrieve user with id ' + id);
        
        const { userId, firstName, email, lastName, phone } = user;
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
        return next(new ApiError(error.message, 401, 'Bad request'))
    }
}