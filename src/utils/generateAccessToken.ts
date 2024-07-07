import jwt from 'jsonwebtoken';

export function getAccessToken(email: string, userId: string, secretKey?: string) {
    return jwt.sign({ email, userId },
        // @ts-ignore
        process.env.JWT_KEY || secretKey, { expiresIn: '30m' })
}
