import * as db from '../db/index.js';
import { nanoid } from 'nanoid';

interface UserInterface {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string
}
// @ts-ignore
class User implements UserInterface {
    userId: string;
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string,
        public phone: string,
    ) {
        this.userId = nanoid();
    }

    async create(): Promise<any> {
        return new Promise<any>((resolve) => {
            const userId = nanoid();
            resolve(db.query('INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [userId, this.firstName, this.lastName, this.email, this.password, this.phone]));
        })
        // const createNewOrganisation = db.query('INSERT INTO organisations VALUES ($1, $2, $3) RETURNING *', [orgId, nam])
        // console.log(result);
    }
}

export { User };