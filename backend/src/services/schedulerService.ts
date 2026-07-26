import { client } from '../db';
import { sendSmartWashDigestEmail, IDigestItem } from './emailService';

/**
 * Periodically scans all users with email notifications enabled and dispatches
 * Smart Wash Digest emails for clothes that are READY_FOR_WASH or OVERDUE.
 */
export const checkAndSendAutomatedDigests = async () => {
    try {
        console.log('⏰ [Scheduler] Running automated wash reminder check...');

        // Fetch users with email notifications enabled
        const usersResult = await client.execute({
            sql: `SELECT id, email, last_digest_sent_at FROM users WHERE email_notifications_enabled = 1 AND email IS NOT NULL`,
            args: []
        });

        const now = new Date();
        const appBaseUrl = process.env.APP_BASE_URL || 'https://laundry-tracker-frontend.onrender.com';

        for (const row of usersResult.rows) {
            const userId = String(row.id);
            const userEmail = String(row.email);
            const lastSentStr = row.last_digest_sent_at ? String(row.last_digest_sent_at) : null;

            // Prevent spamming: only send 1 digest per 24 hours per user
            if (lastSentStr) {
                const lastSent = new Date(lastSentStr);
                const hoursSinceLastSent = (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60);
                if (hoursSinceLastSent < 24) {
                    continue; // Skip user, already notified today
                }
            }

            // Query items that require washing
            const itemsResult = await client.execute({
                sql: `SELECT id, name, category, size, color, imageUrl, currentStatus 
                      FROM clothing_items 
                      WHERE userId = ? AND currentStatus IN ('READY_FOR_WASH', 'OVERDUE')
                      ORDER BY createdAt DESC`,
                args: [userId]
            });

            if (itemsResult.rows.length === 0) {
                continue; // User has no items currently needing a wash
            }

            const items: IDigestItem[] = itemsResult.rows.map((item: any) => ({
                id: String(item.id),
                name: String(item.name),
                category: String(item.category || 'Casuals'),
                size: String(item.size || 'M'),
                color: String(item.color || '#6750A4'),
                imageUrl: item.imageUrl ? String(item.imageUrl) : undefined,
                currentStatus: String(item.currentStatus)
            }));

            console.log(`📧 [Scheduler] Sending automated Smart Wash Digest to ${userEmail} (${items.length} items)...`);

            const sent = await sendSmartWashDigestEmail(userEmail, items, appBaseUrl);

            if (sent) {
                // Update last_digest_sent_at timestamp in DB
                await client.execute({
                    sql: `UPDATE users SET last_digest_sent_at = ? WHERE id = ?`,
                    args: [now.toISOString(), userId]
                });
                console.log(`✅ [Scheduler] Automated digest delivered to ${userEmail}`);
            }
        }
    } catch (error: any) {
        console.error('❌ [Scheduler] Error running automated email digest check:', error?.message || error);
    }
};

/**
 * Initializes the background timer scheduler.
 * Runs check 30s after boot, then every 4 hours.
 */
export const initEmailScheduler = () => {
    console.log('🚀 [Scheduler] Email Reminder Scheduler initialized.');
    
    // Run initial check 30 seconds after server startup
    setTimeout(() => {
        checkAndSendAutomatedDigests();
    }, 30000);

    // Then run every 4 hours (4 * 60 * 60 * 1000 ms)
    setInterval(() => {
        checkAndSendAutomatedDigests();
    }, 4 * 60 * 60 * 1000);
};
