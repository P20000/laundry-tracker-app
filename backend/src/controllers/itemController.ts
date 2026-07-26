import { Request, Response } from 'express';
import { client } from '../db'; // Import the raw LibSQL client
import { IClothingItem, INewItemPayload } from '../../../shared/types'; 
// import { logEvent } from './adminController'; // Optional: Uncomment if admin controller exists
import { randomUUID } from 'crypto';
import { sendWashReminderEmail } from '../services/emailService';

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
            jobId: row.jobId, // ADDED
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
        
        // fixed sql
        const sql = `
            INSERT INTO clothing_items 
            (id, name, itemType, category, size, color, imageUrl, currentStatus, damageLevel, userId)
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
        // Execute both queries in a single network batch
        await client.batch([
            {
                sql: `INSERT INTO wash_events (clothingItemId, washDate, createdAt) 
                      SELECT ?, datetime('now'), datetime('now') 
                      WHERE EXISTS (SELECT 1 FROM clothing_items WHERE id = ? AND userId = ?)`,
                args: [id, id, userId]
            },
            {
                sql: `UPDATE clothing_items SET currentStatus = 'CLEAN', lastWashed = datetime('now') WHERE id = ? AND userId = ?`,
                args: [id, userId]
            }
        ], "write");
        
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

        // ── SELF-HEAL: if no wash_events exist but lastWashed is set, the item
        // was washed via a batch job before history recording was implemented.
        // Auto-insert a synthetic record so the calendar is never empty.
        if (result.rows.length === 0) {
            const itemResult = await client.execute({
                sql: `SELECT lastWashed FROM clothing_items WHERE id = ? AND userId = ? AND lastWashed IS NOT NULL`,
                args: [id, userId]
            });

            if (itemResult.rows.length > 0) {
                const lastWashed = itemResult.rows[0].lastWashed;
                // Insert a synthetic wash_event using the stored lastWashed timestamp
                await client.execute({
                    sql: `INSERT INTO wash_events (clothingItemId, washDate, createdAt) VALUES (?, ?, ?)`,
                    args: [id, lastWashed, lastWashed]
                });
                // Return the newly created record
                return res.status(200).json([{ washDate: lastWashed, notes: null }]);
            }
        }

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
        
        // Use client.batch for atomicity and network latency reduction
        const itemUpdateSql = `
            UPDATE clothing_items 
            SET currentStatus = 'WASHING', jobId = ? 
            WHERE id IN (${itemIds.map(() => '?').join(', ')}) AND userId = ?
        `;

        await client.batch([
            {
                sql: "INSERT INTO wash_jobs (id, userId, durationHours, startTime, completionTime) VALUES (?, ?, ?, ?, ?)",
                args: [jobId, userId, durationHours, startTime.toISOString(), completionTime.toISOString()]
            },
            { 
                sql: itemUpdateSql, 
                args: [jobId, ...itemIds, userId] // Job ID + Item IDs + User ID
            }
        ], "write");

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

        // 2. Find all items belonging to completed jobs so we can record wash history
        const placeholders = completedJobIds.map(() => '?').join(', ');
        const affectedItemsQuery = await client.execute({
            sql: `SELECT id FROM clothing_items WHERE userId = ? AND jobId IN (${placeholders})`,
            args: [userId, ...completedJobIds]
        });
        const affectedItemIds = affectedItemsQuery.rows.map(row => row.id as string);

        // 3. Build batch: insert wash_events for each item + update statuses
        const washEventInserts = affectedItemIds.map(itemId => ({
            sql: `INSERT INTO wash_events (clothingItemId, washDate, createdAt)
                  VALUES (?, datetime('now'), datetime('now'))`,
            args: [itemId]
        }));

        await client.batch([
            // Insert wash_events for every affected item
            ...washEventInserts,
            // Mark items CLEAN
            {
                sql: `UPDATE clothing_items SET currentStatus = 'CLEAN', lastWashed = datetime('now'), jobId = NULL WHERE userId = ? AND jobId IN (${placeholders})`,
                args: [userId, ...completedJobIds]
            },
            // Mark jobs COMPLETED
            {
                sql: `UPDATE wash_jobs SET status = 'COMPLETED' WHERE id IN (${placeholders})`,
                args: completedJobIds
            }
        ], "write");

        return res.status(200).json({ message: `${completedJobIds.length} wash jobs finished and items marked CLEAN.` });

    } catch (error: unknown) {
        console.error('Check Wash Jobs Error:', error);
        return res.status(500).json({ error: 'Failed to check job status.' });
    }
};

export const collectWashJob = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // Mark the job as COLLECTED
        const result = await client.execute({
            sql: "UPDATE wash_jobs SET status = 'COLLECTED' WHERE id = ? AND userId = ? AND status = 'COMPLETED'",
            args: [id, userId]
        });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Job not found, not completed, or doesn't belong to user." });
        }

        return res.status(200).json({ message: "Job marked as collected and archived." });
    } catch (error: unknown) {
        console.error('Collect Wash Job Error:', error);
        return res.status(500).json({ error: 'Failed to collect wash job.' });
    }
};

export const getActiveWashJobs = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // Fetch only IN_PROGRESS and COMPLETED jobs (hide COLLECTED)
        const jobsResult = await client.execute({
            sql: "SELECT * FROM wash_jobs WHERE userId = ? AND status != 'COLLECTED' ORDER BY completionTime DESC",
            args: [userId]
        });

        const jobDetails = jobsResult.rows;

        // Fetch all items currently belonging to a job (either WASHING or finished but uncollected)
        const washingItemsResult = await client.execute({
             sql: "SELECT id, category, name, imageUrl, jobId FROM clothing_items WHERE userId = ? AND jobId IS NOT NULL",
             args: [userId]
        });
        
        const washingItems = washingItemsResult.rows;

        // Group items correctly by their linked jobId
        // NOTE: libsql returns integer columns as BigInt — must cast to Number before
        // passing through JSON.stringify, otherwise BigInt fields are silently dropped.
        const jobGroups = jobDetails.map(job => {
            const itemsInThisJob = washingItems.filter(item => item.jobId === job.id);
            return {
                id: String(job.id),
                userId: String(job.userId),
                status: String(job.status ?? 'IN_PROGRESS'),
                durationHours: Number(job.durationHours),   // BigInt → Number
                startTime: job.startTime ? String(job.startTime) : null,
                completionTime: job.completionTime ? String(job.completionTime) : null,
                itemsInJob: itemsInThisJob.map(item => ({
                    id: String(item.id),
                    name: item.name ? String(item.name) : null,
                    category: item.category ? String(item.category) : null,
                    imageUrl: item.imageUrl ? String(item.imageUrl) : null
                }))
            };
        });
        
        return res.status(200).json(jobGroups);

    } catch (error: unknown) {
        console.error('Error fetching active wash jobs:', error);
        return res.status(500).json({ error: 'Failed to fetch active wash jobs.' });
    }
};

/**
 * ONE-TIME BACKFILL: Creates wash_events for items that have lastWashed
 * set (e.g. via batch jobs) but have no corresponding wash_events record.
 * Safe to run multiple times — the NOT EXISTS check prevents duplicates.
 * Route will be removed after running once.
 */
export const backfillWashEvents = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // Find all items that have lastWashed but zero wash_events records
        const orphanedItems = await client.execute({
            sql: `SELECT id, lastWashed FROM clothing_items
                  WHERE userId = ?
                    AND lastWashed IS NOT NULL
                    AND NOT EXISTS (
                        SELECT 1 FROM wash_events
                        WHERE wash_events.clothingItemId = clothing_items.id
                    )`,
            args: [userId]
        });

        if (orphanedItems.rows.length === 0) {
            return res.status(200).json({
                message: 'Nothing to backfill — all items already have history.',
                backfilled: 0
            });
        }

        // Insert one wash_event per orphaned item using its lastWashed timestamp
        const inserts = orphanedItems.rows.map(row => ({
            sql: `INSERT INTO wash_events (clothingItemId, washDate, createdAt)
                  VALUES (?, ?, ?)`,
            args: [row.id, row.lastWashed, row.lastWashed]
        }));

        await client.batch(inserts, 'write');

        return res.status(200).json({
            message: `Backfilled wash_events for ${orphanedItems.rows.length} item(s).`,
            backfilled: orphanedItems.rows.length,
            items: orphanedItems.rows.map(r => r.id)
        });
    } catch (error: unknown) {
        console.error('Backfill error:', error);
        return res.status(500).json({ error: 'Backfill failed.', details: getErrorMessage(error) });
    }
};

/**
 * Send an email reminder to the user for a specific clothing item's wash day
 */
export const sendWashReminder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.userId;
    const { scheduledDate, reason } = req.body || {};

    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    try {
        // Fetch item details & user email
        const itemResult = await client.execute({
            sql: `SELECT name FROM clothing_items WHERE id = ? AND userId = ?`,
            args: [id, userId]
        });

        if (itemResult.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found.' });
        }

        const userResult = await client.execute({
            sql: `SELECT email FROM users WHERE id = ?`,
            args: [userId]
        });

        if (userResult.rows.length === 0 || !userResult.rows[0].email) {
            return res.status(404).json({ error: 'User email not found.' });
        }

        const itemName = String(itemResult.rows[0].name);
        const recipientEmail = String(userResult.rows[0].email);
        const dueDateStr = scheduledDate || new Date().toLocaleDateString();

        const success = await sendWashReminderEmail(recipientEmail, itemName, dueDateStr, reason || 'Scheduled Wash Day');

        if (success) {
            return res.status(200).json({
                message: `Wash reminder email sent to ${recipientEmail} for ${itemName}.`,
                email: recipientEmail
            });
        } else {
            return res.status(500).json({ error: 'Failed to send reminder email.' });
        }
    } catch (error: unknown) {
        console.error('Error sending wash reminder:', error);
        return res.status(500).json({ error: 'Failed to send wash reminder email.', details: getErrorMessage(error) });
    }
};