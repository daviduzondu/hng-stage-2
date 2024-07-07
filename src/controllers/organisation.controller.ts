import { NextFunction, Request, Response } from "express";
import { Organisation } from "../models/Organisation.js";
import ApiError from "../errors/Api.error.js";
import { pick } from "../utils/pick.js";
import * as client from '../db/index.js';

export async function getOrganisations(req: Request, res: Response, next: NextFunction) {
    try {
        // @ts-ignore
        const { userId } = req.user;
        const orgs = (await Organisation.getOrgs(userId)).rows.map(x => ({ ...pick(x, ['orgId', 'name', 'description']) }));

        res.status(200).json({
            status: 'success',
            message: `Organisations for user with id ${userId}`,
            data: {
                organisations: orgs
            }
        });
    } catch (error: any) {
        return next(error);
    }
}

export async function getOrganisation(req: Request, res: Response, next: NextFunction) {
    try {

        // @ts-ignore
        const { orgId } = req.params;
        const org = (await Organisation.getOrg(orgId)).rows[0];
        if (!org) throw new ApiError("Organisation does not exist", 404, "Bad request");
        res.status(201).json({
            status: 'success',
            message: `Organisation with id ${orgId} found`,
            data: org
        })
    } catch (error) {
        return next(error);
    }
}

export async function createOrganisation(req: Request, res: Response, next: NextFunction) {
    const { name, description } = req.body;
    try {
        await client.begin();
        // @ts-ignore
        const { userId } = req.user;
        const newOrg = (await new Organisation(name, description).create()).rows[0];
        const { orgId } = newOrg;
        await client.query(`INSERT INTO users_organisations VALUES($1, $2)`, [userId, orgId]);
        await client.commit();
        return res.status(200).json({
            status: 'success',
            "message": "Organisation created successfully",
            data: {
                orgId: orgId,
                name, description
            }
        });
    } catch (error: any) {
        await client.rollback();
        return next(new ApiError('Client error', 400, 'Bad Request'));
    }
}

export async function addUserToOrg(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body;
    const { orgId } = req.params;
    try {

       
        // Check that user 
        await Organisation.addUserToOrg(userId, orgId);
        return res.status(200).json({
            status: "success",
            "message": "User added to organisation successfully",
        })
    } catch (error) {
        return next(error);
    }
}