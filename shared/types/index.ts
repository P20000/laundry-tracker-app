// Interfaces shared between the React Frontend and the Node.js Backend

/**
 * Defines the structure of a single clothing item.
 */
export interface IClothingItem {
    id: string;
    userId: string;
    name: string;
    itemType: string;
    imageUrl: string;
    currentStatus: 'CLEAN' | 'READY_FOR_WASH' | 'WASHING' | 'DAMAGED' | 'OVERDUE';
    damageLog: string | null;
    lastWashed: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Defines the structure of a wash event history.
 */
export interface IWashEvent {
    id: string;
    clothingItemId: string;
    washDate: Date;
    notes: string | null;
    createdAt: Date;
}

/**
 * Defines the structure of a new item payload from the frontend.
 */
export interface INewItemPayload {
    name: string;
    itemType: string;
    imageUrl: string;
    userId: string; // Typically derived from authentication, but included for simplicity
}