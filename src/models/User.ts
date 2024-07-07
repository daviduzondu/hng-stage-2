import * as client from '../db/index.js';
import { nanoid } from 'nanoid';
import Model from './Model.js';
import ApiError from '../errors/Api.error.js';

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
        const { rows } = await User.findUserByEmail(this.email);

        if (rows.length > 0) {
            throw new ApiError("Email already exists", 422, 'ApiError');
        }

        const result = await client.query('INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [this.userId, this.firstName, this.lastName, this.email, this.password, this.phone]);
        return Object.assign(this, result);
    }

    static async findUserByEmail(email: string) {
        return await client.query('SELECT * FROM users where email = $1', [email]);
    }

    static async findUserById(id: string) {
        return await client.query('SELECT * FROM users where "userId" = $1', [id]);
    }

    static async getUserOrUserInOrg(userId: string) {
        const query = `
        WITH UserOrg AS (
            SELECT o."orgId"
            FROM "users" u
            JOIN "users_organisations" uo ON u."userId" = uo."users_userId"
            JOIN "organisations" o ON uo."organisations_orgId" = o."orgId"
            WHERE u."userId" = $1
        )
        SELECT u.*
        FROM "users" u
        JOIN "users_organisations" uo ON u."userId" = uo."users_userId"
        WHERE u."userId" = $1
           OR uo."organisations_orgId" IN (SELECT "orgId" FROM UserOrg);
    `;

        const result = await client.query(query, [userId]);
        return result;
    }
}

export { User };