import * as client from '../db/index.js';
import { nanoid } from 'nanoid';

interface OrgInterface {
    orgId: string,
    name: string,
    description: string,
}

class Organisation implements OrgInterface {
    orgId!: string;

    constructor(public name: string, public description: string) {
        this.orgId = nanoid();
    }

    async create() {
        return new Promise<any>((resolve) => {
            resolve(client.query('INSERT INTO organisations VALUES ($1, $2, $3) RETURNING *', [this.orgId, this.name, this.description]));
        });
    }
}

export { Organisation };