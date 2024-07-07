import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { Organisation } from "../models/Organisation.js";
import * as client from '../db/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import ApiError from "../errors/Api.error.js";
import { getAccessToken } from "../utils/generateAccessToken.js";

export async function registerUser(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password, phone } = req.body;
    const orgName = `${firstName}'s Organisation`;
    const orgDescription = `This is the description for ${firstName}'s Organisation`;
    try {
        await client.begin();
        const hashedPw = await bcrypt.hash(password, 12);
        const newUser = await new User(firstName, lastName, email, hashedPw, phone).create();
        const newOrg = await new Organisation(orgName, orgDescription).create();
        await client.query(`INSERT INTO users_organisations VALUES($1, $2)`, [newUser.userId, newOrg.orgId]);

        const user = { userId: newUser.userId, firstName, lastName, email, phone };
        const accessToken = getAccessToken(email, newUser.userId);
        await client.commit();
        res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
                accessToken,
                user
            }
        });
    } catch (error: any) {
        client.rollback();
        if (error.name === 'ApiError') next(error);
        next(new ApiError('Registration unsuccessful', 400, 'Bad request'))
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
        // Find user
        const user = (await User.findUserByEmail(email)).rows[0];

        if (!user?.email) throw new ApiError("Email does not exist", 404, 'Bad request');
        const { userId, email: emailInDB, password: hashedPw, firstName, lastName, phone } = user;
        // Validate password
        const passwordMatch = await bcrypt.compare(password, hashedPw);

        if (!passwordMatch) throw new ApiError("Incorrect password", 422, 'Bad request');

        const accessToken = getAccessToken(email, userId)
        res.status(200).json({
            "status": "success",
            "message": "Login successful",
            "data": {
                "accessToken": accessToken,
                "user": {
                    userId, firstName, lastName, email, phone
                }
            }
        })
    } catch (error) {
        next(new ApiError('Authentication failed', 401, 'Bad request'));
    }
}
