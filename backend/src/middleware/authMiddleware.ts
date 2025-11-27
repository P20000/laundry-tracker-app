import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set.");
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[Auth Middleware] No token provided');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        
        // Debug Log (Remove in production)
        console.log('[Auth Middleware] Decoded Token:', decoded);

        // Check for userId specifically
        if (!decoded.userId) {
             console.error('[Auth Middleware] Token missing userId field');
             return res.status(401).json({ error: 'Invalid token structure: userId missing.' });
        }

        req.userId = decoded.userId;
        next();
        
    } catch (error: any) {
        console.error('[Auth Middleware] Verification Failed:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};