import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { client } from '../db';
import { IUserCredentials } from '../../../shared/types'; // We'll define this type next

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set.");
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- Helper: Generate JWT ---
const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
};

// --- 1. User Registration (Signup) ---
export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body as IUserCredentials;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        // Check if user already exists
        const existingUser = await client.execute({
            sql: "SELECT id FROM users WHERE email = ?",
            args: [email]
        });

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        // 1. Hash the password (using 10 salt rounds for security)
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 2. Insert new user into Turso database
        const result = await client.execute({
            sql: "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            args: [email, passwordHash]
        });

        // LibSQL doesn't return the last inserted ID easily, but this is sufficient for success response
        return res.status(201).json({ message: 'User registered successfully. Please log in.' });

    } catch (error: unknown) {
        console.error('Registration Error:', error);
        return res.status(500).json({ error: 'Registration failed.', details: getErrorMessage(error) });
    }
};

// --- 2. User Login ---
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body as IUserCredentials;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        // 1. Find user by email
        const userQuery = await client.execute({
            sql: "SELECT id, password_hash FROM users WHERE email = ?",
            args: [email]
        });

        const user = userQuery.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash as string);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // 3. Generate a JWT and return it to the client
        const token = generateToken(user.id as string);
        
        return res.status(200).json({ token });

    } catch (error: unknown) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Login failed.', details: getErrorMessage(error) });
    }
};