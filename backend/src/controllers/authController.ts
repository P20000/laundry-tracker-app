import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto'; // Native Node.js ID generator
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

const generateToken = (id: string) => {
    // Ensure ID is never null when signing
    if (!id) throw new Error("Cannot sign token: User ID is missing");
    
    return jwt.sign({ userId: id }, JWT_SECRET, {
        expiresIn: '7d',
    });
};

export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body as IUserCredentials;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        // 1. Check if user exists
        const existingUser = await client.execute({
            sql: "SELECT id FROM users WHERE email = ?",
            args: [email]
        });

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists.' });
        }

        // 2. Hash Password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 3. Generate ID explicitly (FIX for null ID)
        const newUserId = randomUUID();

        // 4. Insert with explicit ID
        await client.execute({
            sql: "INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)",
            args: [newUserId, email, passwordHash]
        });
        
        // 5. Generate token using the known ID
        const token = generateToken(newUserId);

        return res.status(201).json({ message: 'User registered successfully.', token });

    } catch (error: unknown) {
        console.error('Registration Error:', error);
        return res.status(500).json({ error: 'Registration failed.', details: getErrorMessage(error) });
    }
};

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

        // Ensure ID is valid before signing
        if (!user.id) {
             throw new Error("Database user has no ID");
        }

        const token = generateToken(user.id as string);
        
        return res.status(200).json({ token });

    } catch (error: unknown) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Login failed.', details: getErrorMessage(error) });
    }
};