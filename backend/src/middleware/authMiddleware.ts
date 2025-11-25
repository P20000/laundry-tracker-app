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

// Ensure the JWT_SECRET is available
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set.");
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    // 1. Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401 Unauthorized
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        // 4. Attach userId to the request for controllers to use
        req.userId = decoded.userId;

        next(); // Proceed to the next middleware or controller
        
    } catch (error) {
        // 5. Handle invalid/expired tokens
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};