import express, { Request, Response } from 'express';
// We are using Prisma client, which is generated after running prisma migrate
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Helper function to safely extract error messages
// This addresses the TS7006 implicit 'any' error 
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

/**
 * @route GET /health
 * @description Health check endpoint for Railway to confirm API is running and DB is accessible.
 */
app.get('/health', (req: Request, res: Response) => {
    // Attempt a lightweight database query to confirm connection status
    prisma.$queryRaw`SELECT 1`.then(() => {
        res.status(200).json({ status: 'ok', database: 'connected' });
    }).catch((error: unknown) => { // Use 'unknown' type for strict type checking
        console.error('Database connection failed:', error);
        res.status(503).json({ 
            status: 'error', 
            database: 'disconnected', 
            details: getErrorMessage(error) 
        });
    });
});

/**
 * @route GET /api/v1/items
 * @description Placeholder for fetching all clothing items.
 */
app.get('/api/v1/items', async (req: Request, res: Response) => {
    try {
        // Find all items, ordering by newest first
        const items = await prisma.clothingItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(items);
    } catch (error: unknown) { // Use 'unknown' type for strict type checking
        console.error('Error fetching items:', error);
        res.status(500).json({ 
            error: 'Failed to fetch items',
            details: getErrorMessage(error)
        });
    }
});


app.listen(PORT, () => {
    console.log(`⚡️ [server]: API running at http://localhost:${PORT}`);
    console.log(`Database client initialized.`);
});