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
        next(error);
    }
}

export async function getOrganisation(req: Request, res: Response, next: NextFunction) {
    try {

        // @ts-ignore
        const { orgId } = req.params;
        const org = (await Organisation.getOrg(orgId)).rows[0];
        res.status(201).json({
            status: 'success',
            message: `Organisation with id ${orgId}`,
            data: org
        })
    } catch (error) {
        next(error);
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
        next(new ApiError('Client error', 400, 'Bad Request'));
    }
}

export async function addUserToOrg(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.body;
    const { orgId } = req.params;
    try {

        // Check that user is not already in organisation
        const orgs = (await Organisation.getOrgs(userId)).rows;
        if (orgs.find(x => x.userId === userId)) throw new ApiError(`User with id ${userId} already in organisation`, 409, 'Bad request');
        // Check that user 
        await Organisation.addUserToOrg(userId, orgId);
        return res.status(200).json({
            status: "success",
            "message": "User added to organisation successfully",
        })
    } catch (error) {
        next(error);
    }
}