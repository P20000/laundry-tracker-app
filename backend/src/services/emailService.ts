import nodemailer from 'nodemailer';

// Configure Transporter from Environment Variables (Fallback to test/ethereal if missing)
const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
    }

    // Fallback: Console/Simulated transporter for development & testing
    return {
        sendMail: async (options: any) => {
            console.log('📧 [Email Service - Simulated Send]:', {
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html
            });
            return { messageId: `simulated-${Date.now()}` };
        }
    };
};

export const sendWashReminderEmail = async (
    recipientEmail: string,
    itemName: string,
    dueDateStr: string,
    reason: string = 'Scheduled Wash Reminder'
): Promise<boolean> => {
    try {
        const transporter = getTransporter();
        const fromEmail = process.env.FROM_EMAIL || '"Laundry Tracker" <no-reply@laundrytracker.app>';

        const subject = `🧺 Wash Reminder: ${itemName} is due for a wash!`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa;">
                <h2 style="color: #6750A4; margin-top: 0;">🧺 Smart Laundry Tracker</h2>
                <p>Hello,</p>
                <p>This is a reminder that your item <strong>${itemName}</strong> is due to be washed on <strong>${dueDateStr}</strong> (${reason}).</p>
                <div style="background-color: #e8def8; padding: 15px; border-radius: 6px; margin: 20px 0; color: #1d192b;">
                    <p style="margin: 0; font-weight: bold;">Item Details:</p>
                    <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                        <li><strong>Item:</strong> ${itemName}</li>
                        <li><strong>Scheduled/Due Date:</strong> ${dueDateStr}</li>
                    </ul>
                </div>
                <p>Keep your wardrobe fresh and maintain your wash streak! 🔥</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">Sent automatically by Smart Laundry Tracker App.</p>
            </div>
        `;

        await transporter.sendMail({
            from: fromEmail,
            to: recipientEmail,
            subject,
            text: `Wash Reminder for ${itemName}: Due on ${dueDateStr}.`,
            html
        });

        console.log(`✅ Wash reminder email sent to ${recipientEmail} for item ${itemName}`);
        return true;
    } catch (error) {
        console.error('❌ Failed to send wash reminder email:', error);
        return false;
    }
};
