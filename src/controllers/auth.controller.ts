import { NextFunction, Request, Response } from "express";
import { User } from "../models/User.js";
import { Organisation } from "../models/Organisation.js";
import * as client from '../db/index.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

function getAccessToken(email: string, userId: string) {
    return jwt.sign({ email, userId },
        // @ts-ignore
        process.env.JWT_KEY, { expiresIn: '30m' })
}

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

        const user = { ...newUser.pick(Object.keys({ ...req.body, userId: newUser.userId }).filter(x => x !== 'password')) };
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
    } catch (error) {
        console.error(error);
        client.rollback();
        res.status(400).json({
            "status": "Bad request",
            "message": "Registration unsuccessful",
            "statusCode": 400
        })
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
        // Find user
        const user = (await User.findUserByEmail(email)).rows[0];

        if (!user?.email) throw new Error("Email does not exist");
        const { userId, email: emailInDB, password: hashedPw, firstName, lastName, phone } = user;
        // Validate password
        const passwordMatch = await bcrypt.compare(password, hashedPw);

        if (!passwordMatch) throw new Error("Incorrect password");

        const accessToken = getAccessToken(email, userId)
        res.status(200).json({
            "status": "success",
            "message": "Login successful",
            "data": {
                "accessToken": accessToken,
                "user": {
                    userId, firstName, lastName, emailInDB, phone
                }
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            "status": "Bad request",
            "message": "Authentication failed",
            "statusCode": 401
        })
    }
}
