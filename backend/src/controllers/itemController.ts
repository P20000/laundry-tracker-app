import { Request, Response } from 'express';
import { client } from '../db'; // Import the raw LibSQL client
import { IClothingItem, INewItemPayload } from '../../../shared/types'; 
// import { logEvent } from './adminController'; // Optional: Uncomment if admin controller exists
import { randomUUID } from 'crypto';

// --- Helper: Error Message Formatter ---
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- Helper: Convert SQL result into typed array ---
// LibSQL results are generic, so we map them back to the IClothingItem type.
const mapResultToItems = (rows: any[]): IClothingItem[] => {
    return rows.map(row => ({
        id: row.id,
        userId: row.userId,
        name: row.name,
        itemType: row.itemType,
        category: row.category,
        size: row.size,
        color: row.color,
        imageUrl: row.imageUrl,
        currentStatus: row.currentStatus,
        damageLog: row.damageLog,
        damageLevel: row.damageLevel,
        lastWashed: row.lastWashed ? new Date(row.lastWashed) : null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
    }));
};

// --- Database Operations ---

export const createItem = async (req: Request, res: Response) => {
    // 1. Get the authenticated User ID from the request (set by authMiddleware)
    const userId = req.userId;
    const { name, itemType, category, size, color, imageUrl, damageLevel } = req.body as INewItemPayload;

    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });
    if (!name || !itemType) return res.status(400).json({ error: 'Missing required fields.' });

    try {
        const newItemId = randomUUID();
        
        // The SQL expects 8 total values now: (id, name, itemType, category, size, color, imageUrl, userId)
        const sql = `
            INSERT INTO clothing_items 
            (id, name, itemType, category, size, color, imageUrl, currentStatus, damageLevel, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'CLEAN', ?)
            `;
        
        // FIX 2: Pass exactly 8 arguments
        const args = [
            newItemId,              // 1. The new ID
            name,                   // 2
            itemType,               // 3
            category || 'Casuals',  // 4
            size || 'M',            // 5
            color || '#000000',     // 6
            imageUrl || '',         // 7
            damageLevel || 1,       // NEW: damageLevel
            userId                  // 8
        ];

        await client.execute({ sql, args });

        return res.status(201).json({ id: newItemId, message: "Item created successfully." });
    } catch (error: unknown) {
        const msg = getErrorMessage(error);
        console.error('Error creating item:', error);
        // await logEvent('ERROR', 'Failed to create item', msg); 
        return res.status(500).json({ error: 'Failed to create new item.', details: msg });
    }
};

export const getAllItems = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // Filter by userId so users only see their own clothes
        const result = await client.execute({
            sql: "SELECT * FROM clothing_items WHERE userId = ? ORDER BY createdAt DESC",
            args: [userId]
        });
        return res.status(200).json(mapResultToItems(result.rows));
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch catalog.' });
    }
};

export const getLaundryItems = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        const sql = `
            SELECT * FROM clothing_items 
            WHERE userId = ? AND currentStatus IN ('READY_FOR_WASH', 'OVERDUE') 
            ORDER BY lastWashed ASC
        `;
        const result = await client.execute({ sql, args: [userId] });
        return res.status(200).json(mapResultToItems(result.rows));
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch laundry list.' });
    }
};

export const getDamagedItems = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        const result = await client.execute({
            sql: "SELECT * FROM clothing_items WHERE userId = ? AND currentStatus = 'DAMAGED' ORDER BY updatedAt DESC",
            args: [userId]
        });
        return res.status(200).json(mapResultToItems(result.rows));
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch damaged log.' });
    }
};

export const markAsWashed = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // 1. Log the wash event (Ensure item belongs to user)
        await client.execute({
            sql: `INSERT INTO wash_events (clothingItemId, washDate, createdAt) 
                  SELECT ?, datetime('now'), datetime('now') 
                  WHERE EXISTS (SELECT 1 FROM clothing_items WHERE id = ? AND userId = ?)`,
            args: [id, id, userId]
        });

        // 2. Update item status (Ensure item belongs to user)
        const sql = `
            UPDATE clothing_items 
            SET currentStatus = 'CLEAN', lastWashed = datetime('now')
            WHERE id = ? AND userId = ?
        `;
        await client.execute({ sql: sql, args: [id, userId] });
        
        return res.status(200).json({ message: "Item marked as washed." });
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to process wash event.' });
    }
};

export const updateItemStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; 
    const userId = req.userId; // Get User ID

    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });
    if (!status) return res.status(400).json({ error: 'Status is required.' });

    try {
        // Add userId to WHERE clause for security
        const sql = `UPDATE clothing_items SET currentStatus = ?, updatedAt = datetime('now') WHERE id = ? AND userId = ?`;
        await client.execute({ sql: sql, args: [status, id, userId] });
        
        return res.status(200).json({ message: "Status updated." });
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to update status.' });
    }
};

export const getItemHistory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // Fetch all wash events for the given item, verifying ownership
        const sql = `
            SELECT 
                w.washDate, 
                w.notes 
            FROM wash_events w
            JOIN clothing_items ci ON w.clothingItemId = ci.id
            WHERE ci.id = ? AND ci.userId = ?
            ORDER BY w.washDate DESC
        `;
        const result = await client.execute({ sql, args: [id, userId] });

        // Since the rows are simple, we return them directly
        return res.status(200).json(result.rows);

    } catch (error: unknown) {
        console.error('Error fetching item history:', error);
        return res.status(500).json({ error: 'Failed to fetch item history.' });
    }
};

export const deleteItem = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // SQL DELETE statement ensures only items belonging to the authenticated user are deleted.
        const result = await client.execute({
            sql: "DELETE FROM clothing_items WHERE id = ? AND userId = ?",
            args: [id, userId]
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Item not found or does not belong to user." });
        }

        return res.status(200).json({ message: "Item deleted successfully." });

    } catch (error: unknown) {
        console.error('Error deleting item:', error);
        // Log to database for dashboard (uncomment logEvent if integrated)
        // await logEvent('ERROR', 'Failed to delete item', getErrorMessage(error));
        return res.status(500).json({ error: 'Failed to delete item.' });
    }
};