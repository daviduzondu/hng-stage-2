import 'dotenv/config.js';
// import jest from 'jest';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getAccessToken } from '../src/utils/generateAccessToken'

// Tests for token generation
describe('Token Generation', () => {
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

describe('Organisation', ()=>{

})