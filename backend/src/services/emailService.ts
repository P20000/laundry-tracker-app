import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const GMAIL_USER = process.env.SMTP_USER || 'pranavdwivedi45645@gmail.com';
const GMAIL_PASS = process.env.SMTP_PASS || 'kbutomcczpehiohl';

const getTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = GMAIL_USER;
    const pass = GMAIL_PASS;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        connectionTimeout: 5000, // 5-second fast connection timeout
        greetingTimeout: 5000,   // 5-second greeting timeout
        socketTimeout: 7000,     // 7-second socket timeout
        auth: { user, pass }
    });
};

/**
 * Helper to race a Promise against a maximum timeout (7 seconds max)
 */
const sendMailWithTimeout = async (transporter: nodemailer.Transporter, mailOptions: nodemailer.SendMailOptions): Promise<any> => {
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP Email send request timed out after 7 seconds.')), 7000)
    );
    return Promise.race([transporter.sendMail(mailOptions), timeoutPromise]);
};

export const sendOtpEmail = async (
    recipientEmail: string,
    otpCode: string
): Promise<boolean> => {
    try {
        const transporter = getTransporter();
        const fromEmail = process.env.FROM_EMAIL || `"Smart Laundry Tracker" <${GMAIL_USER}>`;

        const subject = `🔒 ${otpCode} is your Laundry Tracker Verification Code`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #6750A4; margin: 0;">🧺 Smart Laundry Tracker</h2>
                    <p style="color: #666; font-size: 14px; margin-top: 4px;">Email Account Verification</p>
                </div>
                <div style="background-color: #f3edf7; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #49454f;">Your 6-Digit Verification Code is:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6750A4; margin: 8px 0;">
                        ${otpCode}
                    </div>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #777;">Code expires in 10 minutes</p>
                </div>
                <p style="font-size: 13px; color: #555;">Please enter this code in your Laundry Tracker settings page to verify your email address.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 11px; color: #999; text-align: center;">If you did not request this code, please ignore this email.</p>
            </div>
        `;

        const info: any = await sendMailWithTimeout(transporter, {
            from: fromEmail,
            to: recipientEmail,
            subject,
            text: `Your Laundry Tracker OTP verification code is ${otpCode}. It expires in 10 minutes.`,
            html
        });

        console.log(`✅ Real OTP email delivered to ${recipientEmail}! Message ID: ${info.messageId}`);
        return true;
    } catch (error: any) {
        console.error('❌ Failed to send OTP email via Gmail SMTP:', error?.message || error);
        return false;
    }
};

export const sendWashReminderEmail = async (
    recipientEmail: string,
    itemName: string,
    dueDateStr: string,
    reason: string = 'Scheduled Wash Reminder'
): Promise<boolean> => {
    try {
        const transporter = getTransporter();
        const fromEmail = process.env.FROM_EMAIL || `"Smart Laundry Tracker" <${GMAIL_USER}>`;

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

        const info: any = await sendMailWithTimeout(transporter, {
            from: fromEmail,
            to: recipientEmail,
            subject,
            text: `Wash Reminder for ${itemName}: Due on ${dueDateStr}.`,
            html
        });

        console.log(`✅ Wash reminder email sent to ${recipientEmail} for item ${itemName}! Message ID: ${info.messageId}`);
        return true;
    } catch (error: any) {
        console.error('❌ Failed to send wash reminder email:', error?.message || error);
        return false;
    }
};

export interface IDigestItem {
    id: string;
    name: string;
    category: string;
    size: string;
    color: string;
    imageUrl?: string;
    currentStatus: string;
}

export const sendSmartWashDigestEmail = async (
    recipientEmail: string,
    items: IDigestItem[],
    appBaseUrl: string = 'https://laundry-tracker-frontend.onrender.com'
): Promise<boolean> => {
    try {
        const transporter = getTransporter();
        const fromEmail = process.env.FROM_EMAIL || `"Smart Laundry Tracker" <${GMAIL_USER}>`;

        const itemIdsParam = items.map(i => i.id).join(',');
        const deepLinkUrl = `${appBaseUrl}/?action=batch-wash&items=${encodeURIComponent(itemIdsParam)}`;

        const subject = `🧺 Smart Wash Alert: ${items.length} item${items.length > 1 ? 's' : ''} ready for batch wash!`;

        const itemsHtml = items.map(item => `
            <div style="display: inline-block; width: 45%; min-width: 200px; margin: 10px 2.5%; vertical-align: top; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                ${item.imageUrl 
                    ? `<img src="${item.imageUrl}" alt="${item.name}" style="width: 100%; height: 140px; object-fit: cover;" />`
                    : `<div style="width: 100%; height: 140px; background-color: ${item.color || '#6750A4'}20; display: flex; align-items: center; justify-content: center; font-size: 32px; color: ${item.color || '#6750A4'}; text-align: center; line-height: 140px;">👕</div>`
                }
                <div style="padding: 12px;">
                    <h3 style="margin: 0 0 6px 0; font-size: 15px; color: #1c1b1f;">${item.name}</h3>
                    <span style="display: inline-block; background-color: #e7e0ec; color: #49454f; font-size: 11px; padding: 2px 8px; border-radius: 12px; margin-right: 4px;">${item.category}</span>
                    <span style="display: inline-block; background-color: #e7e0ec; color: #49454f; font-size: 11px; padding: 2px 8px; border-radius: 12px;">Size ${item.size}</span>
                </div>
            </div>
        `).join('');

        const html = `
            <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #6750A4; margin: 0; font-size: 24px;">🧺 Smart Laundry Digest</h1>
                    <p style="color: #625b71; margin: 6px 0 0 0; font-size: 14px;">Your wardrobe scanner identified ${items.length} item${items.length > 1 ? 's' : ''} ready for washing</p>
                </div>

                <div style="margin: 20px 0; text-align: center;">
                    ${itemsHtml}
                </div>

                <div style="text-align: center; margin: 32px 0 20px 0;">
                    <a href="${deepLinkUrl}" target="_blank" style="background-color: #6750A4; color: #ffffff; padding: 14px 28px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(103,80,164,0.3);">
                        ⚡️ Start Recommended Batch Wash (${items.length} Items)
                    </a>
                </div>
                <p style="text-align: center; font-size: 12px; color: #777;">Clicking the button will open Smart Laundry Tracker and pre-select these items for immediate wash job creation.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                <p style="font-size: 11px; color: #999; text-align: center;">You received this because email notifications are enabled for your account. Manage your preferences in Settings.</p>
            </div>
        `;

        const info: any = await sendMailWithTimeout(transporter, {
            from: fromEmail,
            to: recipientEmail,
            subject,
            text: `Smart Wash Digest: ${items.length} items ready for wash. Start batch wash: ${deepLinkUrl}`,
            html
        });

        console.log(`✅ Smart Wash Digest email sent to ${recipientEmail} with ${items.length} items. Message ID: ${info.messageId}`);
        return true;
    } catch (error: any) {
        console.error('❌ Failed to send Smart Wash Digest email:', error?.message || error);
        return false;
    }
};
