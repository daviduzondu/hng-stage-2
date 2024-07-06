import * as db from '../db/index.js';
import { nanoid } from 'nanoid';
import Model from './Model.js';

interface UserInterface {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
}
// @ts-ignore
class User extends Model implements UserInterface {
    userId: string;
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public phone: string,
    ) {
        super();
        this.userId = nanoid();
    }


    async create() {
        const result = await db.query('INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [this.userId, this.firstName, this.lastName, this.email, this.password, this.phone]);
        return Object.assign(this, result);
    }
    // async create(): Promise<any> {
    //     return new Promise<any>((resolve) => {
    //     })
    //     // const createNewOrganisation = db.query('INSERT INTO organisations VALUES ($1, $2, $3) RETURNING *', [orgId, nam])
    //     // console.log(result);
    // }
}

export { User };