import * as client from '../db/index.js';
import { nanoid } from 'nanoid';
import Model from './Model.js';

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

    async getOrgs(userId: string) {
        const result = await client.query('SELECT * FROM user_organisations WHERE users_userId = $1', [userId]);
        return Object.assign(this, result);
    }

    async getOrg(orgId: string) {
        const result = await client.query('SELECT * FROM organisations WHERE orgId = $1', [orgId]);
        return Object.assign(this, result);
    }
    // async create() {
    //     return new Promise<any>((resolve) => {
    //         resolve();
    //     });
    // }
}

export { Organisation };