import jwt from 'jsonwebtoken';

export function getAccessToken(email: string, userId: string) {
    return jwt.sign({ email, userId },
        // @ts-ignore
        process.env.JWT_KEY, { expiresIn: '30m' })
}
