import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { client } from '../db';
import { IUserCredentials } from '../../../shared/types';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set.");
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- Helper: Generate JWT ---
const generateToken = (id: string) => {
    // CRITICAL FIX: The payload key MUST be 'userId' to match authMiddleware
    return jwt.sign({ userId: id }, JWT_SECRET, {
        expiresIn: '7d',
    });
};

// --- 1. User Registration (Signup) ---
export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body as IUserCredentials;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        // Check if user exists
        const existingUser = await client.execute({
            sql: "SELECT id FROM users WHERE email = ?",
            args: [email]
        });

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Use a UUID-like approach or let DB handle ID if auto-generated, 
        // but here we rely on the table's default random ID.
        // We need to fetch the user after creation to get the ID for the token, 
        // OR generate the ID in code. 
        // For LibSQL default (randomblob), we can't easily get the ID back in one go without RETURNING clause support.
        // Strategy: Generate ID in code or Select back.
        // Simpler: Select back by email.
        
        await client.execute({
            sql: "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            args: [email, passwordHash]
        });
        
        // Fetch the new user to get the ID for the token (Auto-login after signup)
        const newUserQuery = await client.execute({
             sql: "SELECT id FROM users WHERE email = ?",
             args: [email]
        });
        const user = newUserQuery.rows[0];
        
        const token = generateToken(user.id as string);

        return res.status(201).json({ message: 'User registered successfully.', token });

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
        const userQuery = await client.execute({
            sql: "SELECT id, password_hash FROM users WHERE email = ?",
            args: [email]
        });

        const user = userQuery.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash as string);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Generate Token with 'userId'
        const token = generateToken(user.id as string);
        
        return res.status(200).json({ token });

    } catch (error: unknown) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Login failed.', details: getErrorMessage(error) });
    }
};