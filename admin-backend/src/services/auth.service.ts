import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'uy456';
const JWT_EXPIRES_IN = '1h';

export class AuthService {
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    static generateToken(payload: { id: number; username: string; isAdmin: boolean }): string {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    static verifyToken(token: string): { id: number; username: string; isAdmin: boolean } | null {
        try {
            return jwt.verify(token, JWT_SECRET) as { id: number; username: string; isAdmin: boolean };
        } catch {
            return null;
        }
    }
}
