import * as client from '../db/index.js';
import { nanoid } from 'nanoid';
import Model from './Model.js';
import ApiError from '../errors/Api.error.js';

interface OrgInterface {
    orgId: string,
    name: string,
    description: string,
}

class Organisation extends Model implements OrgInterface {
    orgId!: string;

    constructor(public name: string, public description: string) {
        super();
        this.orgId = nanoid();
    }

    async create() {
        const result = await client.query('INSERT INTO organisations VALUES ($1, $2, $3) RETURNING *', [this.orgId, this.name, this.description]);
        return Object.assign(this, result);
    }

    static async getOrgs(userId: string) {
        const result = await client.query(`
            SELECT * 
            FROM users_organisations 
            INNER JOIN organisations 
            ON users_organisations."organisations_orgId" = organisations."orgId" 
            WHERE users_organisations."users_userId" = $1
        `, [userId]);
        return Object.assign(this, result);
    }

    static async getOrg(orgId: string) {
        return await client.query('SELECT * FROM organisations WHERE "orgId" = $1', [orgId]);
        // return Object.assign(this, result);
    }

    static async addUserToOrg(userId: string, orgId: string) {
        // Check that organisation does not exist
        const org = (await Organisation.getOrg(orgId)).rows[0];
        if (!org) throw new ApiError(`Organisation with id ${orgId} does not exist`);

        // Check that user is not already in organisation
        const orgs = (await Organisation.getOrgs(userId)).rows;
        console.log(orgs);
        if (orgs.find(x => x.users_userId === userId)) throw new ApiError(`User with id ${userId} already in organisation`, 409, 'Bad request');
        
        // Add the userId and orgId to the junction table
        return await client.query(`INSERT INTO users_organisations VALUES($1, $2)`, [userId, orgId]);
    }
}

export { Organisation };