import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { Organisation } from "../models/Organisation.js";
import * as client from "../db/index.js";
const authRouter = Router();

authRouter.route('/register').post(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, phone } = req.body;
    const orgName = `${firstName}'s Organisation`;
    const orgDescription = `This is the description for ${firstName}'s Organisation`;
    try {
        await client.begin();
        const newUser = await new User(firstName, lastName, email, password, phone).create();
        const newOrg = await new Organisation(orgName, orgDescription).create();
        // const orgResult = await newOrg.create();

        // @ts-ignore
        await client.query(`INSERT INTO users_organisations VALUES($1, $2)`, [newUser.userId, newOrg.orgId]);

        const user = { ...newUser.pick(Object.keys(req.body).filter(x => x !== 'password')) };
        await client.commit();
        res.status(200).json({
            status: "success",
            message: "Registration successful",
            data: {
                accessToken: 'something',
                user
            }
        });
    } catch (error) {
        client.rollback();
        next(error);
    }
});

export default authRouter;
