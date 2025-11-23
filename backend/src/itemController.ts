import { Request, Response } from 'express';
// Note: ItemStatus is exported directly from the Prisma client package
import { PrismaClient, ItemStatus } from '@prisma/client'; 
// Path fix: Use simplified path from the new rootDir (backend/)
import { INewItemPayload } from './../../shared/types'; 

const prisma = new PrismaClient();

// Helper function to safely extract error messages
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- CRUD Operations ---

/**
 * @route POST /api/v1/items
 * @description Creates a new clothing item in the catalog.
 */
export const createItem = async (req: Request, res: Response) => {
    // We assume the user ID would be pulled from an authentication token (req.user.id)
    // For MVP, we extract all fields directly from the body.
    const { name, itemType, imageUrl, userId } = req.body as INewItemPayload;

    if (!name || !itemType || !imageUrl || !userId) {
        return res.status(400).json({ error: 'Missing required fields: name, itemType, imageUrl, userId.' });
    }

    try {
        const newItem = await prisma.clothingItem.create({
            data: {
                userId: userId,
                name: name,
                itemType: itemType,
                imageUrl: imageUrl,
                currentStatus: ItemStatus.CLEAN, // New items are always clean
            },
        });
        return res.status(201).json(newItem);
    } catch (error: unknown) {
        console.error('Error creating item:', error);
        return res.status(500).json({ error: 'Failed to create new item.', details: getErrorMessage(error) });
    }
};

// --- Query Operations ---

/**
 * @route GET /api/v1/items
 * @description Retrieves all clothing items in the catalog.
 */
export const getAllItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.clothingItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(items);
    } catch (error: unknown) {
        console.error('Error fetching all items:', error);
        return res.status(500).json({ error: 'Failed to fetch catalog.', details: getErrorMessage(error) });
    }
};

/**
 * @route GET /api/v1/laundry
 * @description Retrieves items marked as READY_FOR_WASH or OVERDUE.
 */
export const getLaundryItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.clothingItem.findMany({
            where: {
                currentStatus: {
                    in: [ItemStatus.READY_FOR_WASH, ItemStatus.OVERDUE],
                }
            },
            orderBy: { lastWashed: 'asc' } // Show items needing wash most urgently
        });
        return res.status(200).json(items);
    } catch (error: unknown) {
        console.error('Error fetching laundry items:', error);
        return res.status(500).json({ error: 'Failed to fetch laundry list.', details: getErrorMessage(error) });
    }
};

/**
 * @route GET /api/v1/damaged
 * @description Retrieves items marked as DAMAGED.
 */
export const getDamagedItems = async (req: Request, res: Response) => {
    try {
        const items = await prisma.clothingItem.findMany({
            where: {
                currentStatus: ItemStatus.DAMAGED,
            },
            orderBy: { updatedAt: 'desc' }
        });
        return res.status(200).json(items);
    } catch (error: unknown) {
        console.error('Error fetching damaged items:', error);
        return res.status(500).json({ error: 'Failed to fetch damaged log.', details: getErrorMessage(error) });
    }
};


// --- Action/Update Operations ---

/**
 * @route POST /api/v1/items/:id/wash
 * @description Marks an item as washed and records a new wash event.
 */
export const markAsWashed = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // 1. Create a new wash history event
        await prisma.washEvent.create({
            data: {
                clothingItemId: id,
                notes: req.body.notes || null,
            },
        });

        // 2. Update the ClothingItem status and lastWashed timestamp
        const updatedItem = await prisma.clothingItem.update({
            where: { id: id },
            data: {
                currentStatus: ItemStatus.CLEAN,
                lastWashed: new Date(),
            },
        });

        return res.status(200).json({ message: 'Item marked as washed and timeline updated.', item: updatedItem });
    } catch (error: unknown) {
        console.error(`Error marking item ${id} as washed:`, error);
        return res.status(500).json({ error: 'Failed to process wash event.', details: getErrorMessage(error) });
    }
};