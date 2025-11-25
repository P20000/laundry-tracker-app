import { Request, Response } from 'express';
import { client } from '../db'; // Import the raw LibSQL client
import { IClothingItem, INewItemPayload } from '../../../shared/types'; 

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
        lastWashed: row.lastWashed ? new Date(row.lastWashed) : null,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
    }));
};

// --- Database Operations ---

export const createItem = async (req: Request, res: Response) => {
    const { name, itemType, category, size, color, imageUrl } = req.body as INewItemPayload;
    if (!name || !itemType) return res.status(400).json({ error: 'Missing required fields.' });

    try {
        const sql = `
            INSERT INTO clothing_items 
            (name, itemType, category, size, color, imageUrl, currentStatus, userId)
            VALUES (?, ?, ?, ?, ?, ?, 'CLEAN', 'demo-user')
        `;
        // Use client.execute to run raw SQL
        await client.execute({
            sql: sql,
            args: [name, itemType, category || 'Casuals', size || 'M', color || '#000000', imageUrl || '']
        });

        // NOTE: SQL insert returns limited data; client must fetch new list to update UI.
        return res.status(201).json({ message: "Item created successfully." });
    } catch (error: unknown) {
        console.error('Error creating item:', error);
        return res.status(500).json({ error: 'Failed to create new item.', details: getErrorMessage(error) });
    }
};

export const getAllItems = async (req: Request, res: Response) => {
    try {
        const result = await client.execute("SELECT * FROM clothing_items ORDER BY createdAt DESC");
        return res.status(200).json(mapResultToItems(result.rows));
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch catalog.' });
    }
};

export const getLaundryItems = async (req: Request, res: Response) => {
    try {
        const sql = `
            SELECT * FROM clothing_items 
            WHERE currentStatus IN ('READY_FOR_WASH', 'OVERDUE') 
            ORDER BY lastWashed ASC
        `;
        const result = await client.execute(sql);
        return res.status(200).json(mapResultToItems(result.rows));
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch laundry list.' });
    }
};

export const getDamagedItems = async (req: Request, res: Response) => {
    try {
        const result = await client.execute("SELECT * FROM clothing_items WHERE currentStatus = 'DAMAGED' ORDER BY updatedAt DESC");
        return res.status(200).json(mapResultToItems(result.rows));
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch damaged log.' });
    }
};

export const markAsWashed = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // 1. Log the wash event
        await client.execute({
            sql: `INSERT INTO wash_events (clothingItemId, washDate, createdAt) VALUES (?, datetime('now'), datetime('now'))`,
            args: [id]
        });

        // 2. Update item status and last washed date
        const sql = `
            UPDATE clothing_items 
            SET currentStatus = 'CLEAN', lastWashed = datetime('now')
            WHERE id = ?
        `;
        await client.execute({ sql: sql, args: [id] });
        
        return res.status(200).json({ message: "Item marked as washed." });
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to process wash event.' });
    }
};

export const updateItemStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; 

    if (!status) return res.status(400).json({ error: 'Status is required.' });

    try {
        const sql = `UPDATE clothing_items SET currentStatus = ?, updatedAt = datetime('now') WHERE id = ?`;
        await client.execute({ sql: sql, args: [status, id] });
        
        return res.status(200).json({ message: "Status updated." });
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to update status.' });
    }
};