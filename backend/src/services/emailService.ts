import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

interface IMailSendOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
    category?: string;
    fromName?: string;
    replyTo?: string;
}

export interface IEmailResult {
    success: boolean;
    message: string;
    messageIds?: string[];
}

/**
 * 100% REST API Email Service (Port 443 HTTPS).
 * Legacy TCP SMTP protocol code has been entirely pruned.
 * 
 * HTTP Providers Supported:
 * 1. Resend SDK (`resend`) - Primary REST API Client (Port 443)
 * 2. SendGrid REST API (`SENDGRID_API_KEY`) - Port 443
 * 3. Mailtrap REST API (`MAILTRAP_TOKEN`) - Port 443
 */
const sendEmail = async (options: IMailSendOptions): Promise<IEmailResult> => {
    const senderName = options.fromName || process.env.FROM_NAME || 'Smart Laundry Tracker';
    const fromEmail = process.env.FROM_EMAIL || 'pranavdwivedi45645@gmail.com';

    // 1. Primary: Resend SDK (REST API over Port 443)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
        try {
            const resend = new Resend(resendApiKey);
            const response = await resend.emails.send({
                from: `"${senderName}" <${fromEmail}>`,
                to: [options.to],
                subject: options.subject,
                text: options.text,
                html: options.html || options.text,
                replyTo: options.replyTo || options.to
            });

            if (response.error) {
                console.error(`❌ Resend SDK Error:`, response.error.message);
                return {
                    success: false,
                    message: `Resend API Error: ${response.error.message}`
                };
            }

            if (response.data && response.data.id) {
                console.log(`✅ [Resend REST API] Email delivered to ${options.to}! Message ID:`, response.data.id);
                return {
                    success: true,
                    message: `Email successfully delivered to ${options.to}!`,
                    messageIds: [response.data.id]
                };
            }
        } catch (resendErr: any) {
            console.error(`❌ Resend SDK dispatch exception:`, resendErr?.message || resendErr);
            return {
                success: false,
                message: `Resend SDK Error: ${resendErr?.message || resendErr}`
            };
        }
    }

    // 2. SendGrid REST API (Port 443 HTTPS)
    if (process.env.SENDGRID_API_KEY) {
        try {
            const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    personalizations: [{ to: [{ email: options.to }] }],
                    from: { email: fromEmail, name: senderName },
                    subject: options.subject,
                    content: [
                        { type: 'text/plain', value: options.text },
                        { type: 'text/html', value: options.html || options.text }
                    ]
                })
            });
            if (res.ok || res.status === 202) {
                console.log(`✅ [SendGrid REST API] Email delivered to ${options.to}!`);
                return { success: true, message: `Email delivered to ${options.to}!` };
            } else {
                const data: any = await res.json();
                const errMsg = data?.errors?.[0]?.message || 'SendGrid REST delivery failed';
                console.error(`❌ SendGrid API error:`, errMsg);
                return { success: false, message: `SendGrid REST Error: ${errMsg}` };
            }
        } catch (err: any) {
            console.error(`❌ SendGrid REST API fetch error:`, err?.message || err);
        }
    }

    // 3. Mailtrap REST API (Port 443 HTTPS)
    if (process.env.MAILTRAP_TOKEN) {
        try {
            const res = await fetch('https://send.api.mailtrap.io/api/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.MAILTRAP_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: { email: fromEmail, name: senderName },
                    to: [{ email: options.to }],
                    subject: options.subject,
                    text: options.text,
                    html: options.html || options.text,
                    category: options.category || 'Laundry Tracker Notification'
                })
            });
            const data: any = await res.json();
            if (res.ok && data.success) {
                console.log(`✅ [Mailtrap REST API] Email delivered to ${options.to}! Message IDs:`, data.message_ids);
                return { success: true, message: `Email delivered to ${options.to}!`, messageIds: data.message_ids };
            } else {
                const errDetail = data?.errors ? data.errors.join(', ') : 'Mailtrap REST API rejected delivery';
                console.log(`ℹ️ Mailtrap REST API error for ${options.to}:`, errDetail);
                return { success: false, message: `Mailtrap REST Error: ${errDetail}` };
            }
        } catch (err: any) {
            console.error(`❌ Mailtrap REST API fetch error:`, err?.message || err);
        }
    }

    return {
        success: false,
        message: 'No REST API key configured. Please set RESEND_API_KEY in your Render Environment Variables.'
    };
};

export const sendOtpEmail = async (
    recipientEmail: string,
    otpCode: string
): Promise<IEmailResult> => {
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

    return await sendEmail({
        to: recipientEmail,
        subject,
        text: `Your Laundry Tracker OTP verification code is ${otpCode}. It expires in 10 minutes.`,
        html,
        category: 'OTP Verification'
    });
};

export const sendWashReminderEmail = async (
    recipientEmail: string,
    itemName: string,
    dueDateStr: string,
    reason: string = 'Scheduled Wash Reminder'
): Promise<IEmailResult> => {
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

    return await sendEmail({
        to: recipientEmail,
        subject,
        text: `Wash Reminder for ${itemName}: Due on ${dueDateStr}.`,
        html,
        category: 'Wash Reminder'
    });
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
): Promise<IEmailResult> => {
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

    return await sendEmail({
        to: recipientEmail,
        subject,
        text: `Smart Wash Digest: ${items.length} items ready for wash. Start batch wash: ${deepLinkUrl}`,
        html,
        category: 'Smart Wash Digest'
    });
};
