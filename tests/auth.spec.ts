import 'dotenv/config.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import request from 'supertest';
// import { app } from '../src/index.js';
import { faker } from '@faker-js/faker';
import { pick } from '../src/utils/pick.js';
import { getAccessToken } from '../src/utils/generateAccessToken.js';

const baseUrl = 'https://hng-stage-2-production-cb35.up.railway.app';

const endpoints = {
    REGISTER_USER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    GET_USER_ORGS: '/api/organisations/'
};

const testUser1Credentials = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
};

const testUser2Credentials = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    phone: faker.phone.number(),
};

let user1AccessToken: string;
let user2AccessToken: string;
let regUser1Response: any;
let regUser2Response: any;
let fetchUser1OrgResponse: any;
let fetchUser2OrgResponse: any;

// Token generation and expiry test
describe('Token Generation and Expiry', () => {
    it('should generate a token that expires in 30 minutes', () => {
        const user = { email: 'user@example.com', userId: 'user123' };
        const token = getAccessToken(user.email, user.userId);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;

        const currentTime = Math.floor(Date.now() / 1000);
        const expirationTime = decodedToken.exp;

        expect(expirationTime).toBeGreaterThan(currentTime);
        expect(expirationTime).toBeLessThanOrEqual(currentTime + 1800); // 1800 seconds = 30 minutes
    });

    it('should contain correct user details in the token', () => {
        const user = { email: 'user@example.com', userId: 'user123' };
        const token = getAccessToken(user.email, user.userId);
        const decodedToken = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;

        expect(decodedToken.userId).toBe(user.userId);
        expect(decodedToken.email).toBe(user.email);
    });
});

// User registration and organization access tests
describe('User Registration and Organization Access', () => {
    beforeAll(async () => {
        // Register user1
        regUser1Response = await request(baseUrl)
            .post(endpoints.REGISTER_USER)
            .send(testUser1Credentials);
        user1AccessToken = regUser1Response.body.data.accessToken;

        // Register user2
        regUser2Response = await request(baseUrl)
            .post(endpoints.REGISTER_USER)
            .send(testUser2Credentials);
        user2AccessToken = regUser2Response.body.data.accessToken;

        fetchUser1OrgResponse = await request(baseUrl)
            .get(endpoints.GET_USER_ORGS)
            .set('Authorization', `Bearer ${user1AccessToken}`);

        fetchUser2OrgResponse = await request(baseUrl)
            .get(endpoints.GET_USER_ORGS)
            .set('Authorization', `Bearer ${user2AccessToken}`);
    });


    it(`Should register user 1 (${testUser1Credentials.firstName}) successfully with default organisation`, async () => {
        expect(regUser1Response.body.status).toBe("success");
        expect(regUser1Response.body.message).toBe("Registration successful");
        expect(regUser1Response.body.data).toBeDefined();
        expect(user1AccessToken).toBeDefined();
        expect(user1AccessToken.length).toBeGreaterThan(0);


        expect(fetchUser1OrgResponse.body.data.organisations[0].name).toEqual(`${testUser1Credentials.firstName}'s Organisation`);
    });

    it(`Should register user 2 (${testUser2Credentials.firstName}) successfully with default organisation`, async () => {
        expect(regUser2Response.body.status).toBe("success");
        expect(regUser2Response.body.message).toBe("Registration successful");
        expect(regUser2Response.body.data).toBeDefined();
        expect(user2AccessToken).toBeDefined();
        expect(user2AccessToken.length).toBeGreaterThan(0);

        expect(fetchUser2OrgResponse.body.data.organisations[0].name).toEqual(`${testUser2Credentials.firstName}'s Organisation`);
    });

    it(`Should fail to register two users due to duplicate email`, async () => {
        // Attempt to register another with the same email
        const response = await request(baseUrl)
            .post(endpoints.REGISTER_USER)
            .send(Object.assign(testUser2Credentials, { email: testUser1Credentials.email }));

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('message', 'Email already exists');
    });


    it('should return validation errors for missing required fields', async () => {
        const requiredFields = ['email', 'password', 'firstName', 'lastName'];
        const incompleteUser = { firstName: 'John', lastName: 'Doe' }; // Missing email and password
        const missingFields = requiredFields.filter(field => !(field in incompleteUser));
        const expectedErrors = missingFields.map(field =>
            expect.objectContaining({ field, message: expect.any(String) })
        );
        const res = await request(baseUrl)
            .post(endpoints.REGISTER_USER)
            .send(incompleteUser);

        expect(res.status).toBe(422);
        expect(res.body).toHaveProperty('errors');
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors).toEqual(expect.arrayContaining(expectedErrors));
    });

    it('Verify the default organisation name for user1 is correctly generated', async () => {
        expect(fetchUser1OrgResponse.status).toBe(200);
        expect(fetchUser1OrgResponse.body.data.organisations.length).toBe(1); // Assuming user1 has only one organisation
        expect(fetchUser1OrgResponse.body.data.organisations[0].name).toEqual(`${testUser1Credentials.firstName}'s Organisation`);
    });

    it('Ensure user1 cannot see user2\'s organisation data', async () => {
        expect(fetchUser1OrgResponse.status).toBe(200);
        expect(fetchUser1OrgResponse.body.data.organisations.length).toBe(1); // Assuming user1 has only one organisation
        expect(fetchUser1OrgResponse.body.data.organisations[0].name).not.toEqual(`${testUser2Credentials.firstName}'s Organisation`);
    });



    it('Ensure user2 cannot see user1\'s organisation data', async () => {
        expect(fetchUser2OrgResponse.status).toBe(200);
        expect(fetchUser2OrgResponse.body.data.organisations.length).toBe(1); // Assuming user2 has only one organisation
        expect(fetchUser2OrgResponse.body.data.organisations[0].name).not.toEqual(`${testUser1Credentials.firstName}'s Organisation`);
    });
});

// User login test
describe('User Login', () => {
    let loginUserResponse: any;

    it('should log the user1 in successfully', async () => {
        loginUserResponse = await request(baseUrl)
            .post(endpoints.LOGIN)
            .send({ email: testUser1Credentials.email, password: testUser1Credentials.password });

        expect(loginUserResponse.status).toBe(200);
        expect(loginUserResponse.body.data).toHaveProperty('accessToken');
        expect(loginUserResponse.body.data.user).toHaveProperty('userId');
        expect(loginUserResponse.body.data.user).toHaveProperty('firstName', testUser1Credentials.firstName);
        expect(loginUserResponse.body.data.user).toHaveProperty('lastName', testUser1Credentials.lastName);
        expect(loginUserResponse.body.data.user).toHaveProperty('email', testUser1Credentials.email);
        expect(loginUserResponse.body.data.user).toHaveProperty('phone', testUser1Credentials.phone);
    });

    it('should fail to log in with incorrect credentials', async () => {
        const res = await request(baseUrl)
            .post(endpoints.LOGIN)
            .send({ email: testUser1Credentials.email, password: 'incorrectpassword' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('status', 'Bad request');
        expect(res.body).toHaveProperty('message', 'Authentication failed');
    });
});
