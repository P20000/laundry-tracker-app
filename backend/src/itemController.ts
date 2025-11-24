import { Request, Response } from 'express';
import { PrismaClient, ItemStatus } from '@prisma/client';
// FIX: Go up 3 levels to reach the root, then into shared/types
import { INewItemPayload } from './../../shared/types'; 

const prisma = new PrismaClient();

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- CRUD Operations ---

export const createItem = async (req: Request, res: Response) => {
    const { name, itemType, category, size, color, imageUrl } = req.body as INewItemPayload;

    if (!name || !itemType) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    try {
        const newItem = await prisma.clothingItem.create({
            data: {
                userId: 'demo-user', // Hardcoded for MVP
                name,
                itemType,
                category: category || 'Casuals',
                size: size || 'M',
                color: color || '#000000',
                imageUrl: imageUrl || '',
                currentStatus: ItemStatus.CLEAN,
            },
        });
        return res.status(201).json(newItem);
    } catch (error: unknown) {
        console.error('Error creating item:', error);
        return res.status(500).json({ error: 'Failed to create new item.', details: getErrorMessage(error) });
    }
};

export const getAllItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.clothingItem.findMany({ orderBy: { createdAt: 'desc' } });
        return res.status(200).json(items);
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch catalog.' });
    }
};

export const getLaundryItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.clothingItem.findMany({
            where: { currentStatus: { in: [ItemStatus.READY_FOR_WASH, ItemStatus.OVERDUE] } },
            orderBy: { lastWashed: 'asc' }
        });
        return res.status(200).json(items);
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch laundry list.' });
    }
};

export const getDamagedItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.clothingItem.findMany({
            where: { currentStatus: ItemStatus.DAMAGED },
            orderBy: { updatedAt: 'desc' }
        });
        return res.status(200).json(items);
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to fetch damaged log.' });
    }
};

export const markAsWashed = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.washEvent.create({ data: { clothingItemId: id, notes: req.body.notes || null } });
        const updatedItem = await prisma.clothingItem.update({
            where: { id: id },
            data: { currentStatus: ItemStatus.CLEAN, lastWashed: new Date() },
        });
        return res.status(200).json(updatedItem);
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to process wash event.' });
    }
};

// New: Generic status update (e.g. reporting damage or marking ready for wash)
export const updateItemStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // Expects "DAMAGED", "READY_FOR_WASH", etc.

    try {
        // Map frontend status strings to Prisma Enums if needed, or assume direct match
        const updatedItem = await prisma.clothingItem.update({
            where: { id: id },
            data: { currentStatus: status },
        });
        return res.status(200).json(updatedItem);
    } catch (error: unknown) {
        return res.status(500).json({ error: 'Failed to update status.' });
    }
};