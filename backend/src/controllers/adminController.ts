import { Request, Response } from 'express';
import { client } from '../db';

// Helper to format error messages
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};


// Simple logger function to call from other controllers (Needed if not imported)
// const logEvent = async (level: 'INFO' | 'ERROR', message: string, details: string = '') => { /* ... implementation ... */ };

export const getSystemStats = async (req: Request, res: Response) => {
    try {
        // --- NEW SQL QUERY: Wash Volume by Category ---
        // Join items with wash events and count washes per category
        const washVolumeQuery = `
            SELECT 
                ci.category AS name, 
                COUNT(we.id) AS count
            FROM wash_events we
            JOIN clothing_items ci ON we.clothingItemId = ci.id
            GROUP BY ci.category
        `;
        
        // Run main stats and the new wash volume query in parallel
        const [userCount, itemCount, washCount, recentLogs] = await Promise.all([
            client.execute("SELECT COUNT(*) as count FROM users"),
            client.execute("SELECT COUNT(*) as count FROM clothing_items"),
            client.execute("SELECT COUNT(*) as count FROM wash_events"),
            client.execute("SELECT * FROM system_logs ORDER BY createdAt DESC LIMIT 10")
        ]);

        const stats = {
            users: userCount.rows[0].count,
            items: itemCount.rows[0].count,
            washes: washCount.rows[0].count,
            logs: recentLogs.rows,
            uptime: process.uptime(), // Server uptime in seconds
            timestamp: new Date()
        };

        return res.status(200).json(stats);
    } catch (error) {
        console.error("Admin Stats Error:", error);
        // await logEvent('ERROR', 'Failed to fetch admin stats', getErrorMessage(error));
        return res.status(500).json({ error: "Failed to fetch admin stats", details: getErrorMessage(error) });
    }
};

// Simple logger function to call from other controllers
export const logEvent = async (level: 'INFO' | 'ERROR', message: string, details: string = '') => {
    try {
        await client.execute({
            sql: "INSERT INTO system_logs (id, level, message, details, createdAt) VALUES (lower(hex(randomblob(16))), ?, ?, ?, datetime('now'))",
            args: [level, message, details]
        });
    } catch (e) {
        console.error("Failed to write to system log:", e);
    }
};