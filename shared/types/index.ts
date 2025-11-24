// Interfaces shared between the React Frontend and the Node.js Backend

export interface IClothingItem {
    id: string;
    userId: string;
    name: string;
    itemType: string;
    category: string;
    size: string;
    color: string;
    imageUrl: string; // Now holds Base64 string
    currentStatus: 'CLEAN' | 'READY_FOR_WASH' | 'WASHING' | 'DAMAGED' | 'OVERDUE';
    damageLog: string | null;
    lastWashed: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface INewItemPayload {
    name: string;
    itemType: string;
    category: string;
    size: string;
    color: string;
    imageUrl: string;
    userId?: string; 
}