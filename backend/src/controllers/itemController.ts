import { Request, Response } from 'express';
import { client } from '../db'; // Import the raw LibSQL client
import { IClothingItem, INewItemPayload } from '../../../shared/types'; 
// import { logEvent } from './adminController'; // Optional: Uncomment if admin controller exists
import { randomUUID } from 'crypto';

// --- Constants ---
const MAX_CLEAN_DAYS = 15; // Days before an item is considered overdue for washing

// --- Helper: Error Message Formatter ---
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- Helper: Convert SQL result into typed array ---
// LibSQL results are generic, so we map them back to the IClothingItem type.
// const mapResultToItems = (rows: any[]): IClothingItem[] => {
    
//     return rows.map(row => ({
//         id: row.id,
//         userId: row.userId,
//         name: row.name,
//         itemType: row.itemType,
//         category: row.category,
//         size: row.size,
//         color: row.color,
//         imageUrl: row.imageUrl,
//         currentStatus: row.currentStatus,
//         damageLog: row.damageLog,
//         damageLevel: row.damageLevel,
//         lastWashed: row.lastWashed ? new Date(row.lastWashed) : null,
//         createdAt: new Date(row.createdAt),
//         updatedAt: new Date(row.updatedAt)
//     }));
// };

const mapResultToItems = (rows: any[]): IClothingItem[] => {
    // We update this mapping function to include the OVERDUE logic

    const now = new Date();
    // Calculate the timestamp 30 days ago
    const thirtyDaysAgo = now.setDate(now.getDate() - MAX_CLEAN_DAYS); 

    return rows.map(row => {
        let currentStatus = row.currentStatus;
        const lastWashedTimestamp = row.lastWashed ? new Date(row.lastWashed).getTime() : 0;

        // Condition for OVERDUE: Must be CLEAN, and lastWashed was more than 30 days ago
        // This is a calculated, non-persistent status update for the frontend
        if (currentStatus === 'CLEAN' && lastWashedTimestamp > 0 && lastWashedTimestamp < thirtyDaysAgo) {
            currentStatus = 'OVERDUE';
        }
        
        return {
            ...row,
            currentStatus: currentStatus, // This can now be 'OVERDUE'
            damageLevel: row.damageLevel,
            lastWashed: row.lastWashed ? new Date(row.lastWashed) : null,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt)
        };
    });
};

// --- Database Operations ---

export const createItem = async (req: Request, res: Response) => {
    // 1. Get the authenticated User ID from the request (set by authMiddleware)
    const userId = req.userId;
    const { name, itemType, category, size, color, imageUrl, damageLevel } = req.body as INewItemPayload;
    const safeDamageLevel = parseInt(damageLevel as any) || 1;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });
    if (!name || !itemType) return res.status(400).json({ error: 'Missing required fields.' });

    try {
        const newItemId = randomUUID();
        
        
        const sql = `
            INSERT INTO clothing_items 
            (id, name, itemType, category, size, color, imageUrl, currentStatus, damageLevel, userId)
            // FIX 1: Change 'CLEAN' to a placeholder (?)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
        `;

        // FIX 2: The args array MUST now contain 10 values
        const args = [
            newItemId,               // 1. id
            name,                    // 2. name
            itemType,                // 3. itemType
            category || 'Casuals',   // 4. category
            size || 'M',             // 5. size
            color || '#000000',      // 6. color
            imageUrl || '',          // 7. imageUrl
            'CLEAN',                 // 8. currentStatus (Passed as the 8th argument now)
            safeDamageLevel,        // 9. damageLevel
            userId                   // 10. userId
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
        const itemsWithStatus = mapResultToItems(result.rows); // Map to include OVERDUE logic
        return res.status(200).json(itemsWithStatus);
    } catch (error: unknown) {
        const msg = getErrorMessage(error);
        console.error('Error fetching all items:', error);
        return res.status(500).json({ error: 'Failed to fetch items.', details: msg });
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
        const allItems = mapResultToItems(result.rows);
        const laundryItems = allItems.filter(item => 
            item.currentStatus === 'READY_FOR_WASH' || item.currentStatus === 'OVERDUE'
        );
        return res.status(200).json(laundryItems);
    } catch (error: unknown) {
        const msg = getErrorMessage(error);
        console.error('Failed to fetch laundry items, error : ', error);
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

export const updateItemDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    const updates = req.body; // e.g., { damageLevel: 5, damageLog: "Large tear" }

    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });
    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No update data provided.' });

    // 1. Build the SQL SET clause dynamically
    const setClauses: string[] = [];
    const args: any[] = [];
    
    // Add updatedAt timestamp
    setClauses.push('updatedAt = datetime(\'now\')');

    // Iterate over updates payload to build SQL
    for (const key in updates) {
        // Simple sanitization: only allow known fields to prevent injection
        if (['damageLevel', 'damageLog', 'name', 'size', 'color', 'category', 'itemType'].includes(key)) {
            setClauses.push(`${key} = ?`);
            args.push(updates[key]);
        }
    }

    if (setClauses.length === 0) {
         return res.status(400).json({ error: 'Invalid fields provided for update.' });
    }

    // 2. Construct the final SQL query
    const sql = `UPDATE clothing_items SET ${setClauses.join(', ')} WHERE id = ? AND userId = ?`;
    
    // 3. Add item ID and user ID to arguments
    args.push(id, userId);

    try {
        const result = await client.execute({ sql, args });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Item not found or does not belong to user." });
        }

        return res.status(200).json({ message: "Item details updated successfully." });
    } catch (error: unknown) {
        console.error('Error updating item details:', error);
        // Log event if needed
        return res.status(500).json({ error: 'Failed to update item details.' });
    }
};

export const createWashJob = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { itemIds, durationHours } = req.body as { itemIds: string[], durationHours: number };

    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });
    if (!itemIds || itemIds.length === 0 || !durationHours) {
        return res.status(400).json({ error: 'Missing item IDs or duration.' });
    }

    try {
        const jobId = randomUUID();
        const startTime = new Date();
        const completionTime = new Date(startTime.getTime() + durationHours * 3600000); // 3600000ms per hour
        
        // 1. Create the Wash Job entry
        await client.execute({
            sql: "INSERT INTO wash_jobs (id, userId, durationHours, completionTime) VALUES (?, ?, ?, ?)",
            args: [jobId, userId, durationHours, completionTime.toISOString()]
        });

        // 2. Update status of all selected items to WASHING
        const itemUpdateSql = `
            UPDATE clothing_items 
            SET currentStatus = 'WASHING' 
            WHERE id IN (${itemIds.map(() => '?').join(', ')}) AND userId = ?
        `;
        
        await client.execute({ 
            sql: itemUpdateSql, 
            args: [...itemIds, userId] // Item IDs + User ID
        });

        // 3. Optional: Store item list in a separate table if required later. (Skipped for MVP simplicity)

        return res.status(201).json({ jobId, message: `Wash job created, status set to WASHING for ${itemIds.length} items.` });

    } catch (error: unknown) {
        console.error('Create Wash Job Error:', error);
        return res.status(500).json({ error: 'Failed to create wash job.' });
    }
};

export const checkWashJobs = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        const now = new Date().toISOString();
        
        // 1. Identify completed jobs (where completionTime has passed AND status is IN_PROGRESS)
        const completedJobsQuery = await client.execute({
            sql: "SELECT id, completionTime FROM wash_jobs WHERE userId = ? AND status = 'IN_PROGRESS' AND completionTime <= ?",
            args: [userId, now]
        });

        const completedJobIds = completedJobsQuery.rows.map(row => row.id);

        if (completedJobIds.length === 0) {
            return res.status(200).json({ message: "No jobs completed yet." });
        }

        // 2. For each completed job, update the status of the associated items to CLEAN/READY
        
        // --- BATCH UPDATE FOR ITEMS ---
        // This is complex in raw SQL because we need a transaction to ensure all items are clean.
        // For MVP, we run a query to find the items associated with these jobs and clean them.
        
        // NOTE: Since we didn't save the item IDs inside the wash_jobs table, 
        // we assume any item marked 'WASHING' belongs to one of these jobs (simplified MVP logic).
        // A more robust solution would require a lookup table (jobs_items).
        
        // For now, we will simply update ALL items that are currently WASHING for this user.
        await client.execute({
            sql: "UPDATE clothing_items SET currentStatus = 'CLEAN', lastWashed = datetime('now') WHERE userId = ? AND currentStatus = 'WASHING'",
            args: [userId]
        });

        // 3. Mark the jobs as COMPLETED
        const jobUpdateSql = `UPDATE wash_jobs SET status = 'COMPLETED' WHERE id IN (${completedJobIds.map(() => '?').join(', ')})`;
        await client.execute({
            sql: jobUpdateSql,
            args: completedJobIds
        });


        return res.status(200).json({ message: `${completedJobIds.length} wash jobs finished and items marked CLEAN.` });

    } catch (error: unknown) {
        console.error('Check Wash Jobs Error:', error);
        return res.status(500).json({ error: 'Failed to check job status.' });
    }
};

export const getActiveWashJobs = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // Fetch all jobs for the user, regardless of status
        const jobsResult = await client.execute({
            sql: "SELECT * FROM wash_jobs WHERE userId = ? ORDER BY completionTime DESC",
            args: [userId]
        });

        const jobDetails = jobsResult.rows;

        // Fetch all items currently marked as WASHING
        const washingItemsResult = await client.execute({
             sql: "SELECT id, category, name FROM clothing_items WHERE userId = ? AND currentStatus = 'WASHING'",
             args: [userId]
        });
        
        const washingItems = washingItemsResult.rows;

        // For MVP, we simplify: we assume all WASHING items belong to the active jobs.
        // A robust system would link item IDs to job IDs, but we group them here:
        
        // Group items conceptually under the oldest IN_PROGRESS job
        const jobGroups = jobDetails.map(job => ({
            ...job,
            itemsInJob: washingItems.map(item => ({ id: item.id, name: item.name, category: item.category })) 
            // This is a simplified list of all items currently WASHING for this user
        }));
        
        return res.status(200).json(jobGroups);

    } catch (error: unknown) {
        console.error('Error fetching active wash jobs:', error);
        return res.status(500).json({ error: 'Failed to fetch active wash jobs.' });
    }
};