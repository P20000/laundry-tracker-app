import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include the userId property
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
    // 1. Allow OPTIONS requests (Preflight) to pass without auth
    if (req.method === 'OPTIONS') {
        return next();
    }

    // 2. Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log(`[Auth Error] Missing or malformed header: ${authHeader}`);
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 3. Extract token
    const token = authHeader.split(' ')[1];

    try {
        // 4. Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        if (!decoded.userId) {
            console.log(`[Auth Error] Token decoded but missing userId:`, decoded);
            return res.status(401).json({ error: 'Invalid token structure.' });
        }

        // 5. Attach userId to the request
        req.userId = decoded.userId;
        
        // console.log(`[Auth Success] User ${req.userId} authenticated.`); // Optional: Uncomment for success logs
        next();
        
    } catch (error: any) {
        // 6. Log the SPECIFIC reason for failure
        console.error(`[Auth Failed] Token verification error: ${error.message}`);
        
        // Check specifically for TokenExpiredError
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired. Please log in again.' });
        }
        
        return res.status(401).json({ error: 'Invalid token.' });
    }
};