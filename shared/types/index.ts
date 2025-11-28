// Interfaces shared between the React Frontend and the Node.js Backend

// --- Auth Types ---
export interface IUserCredentials {
    email: string;
    password: string;
}

// --- Item Types (Unchanged) ---
export interface IClothingItem {
    id: string;
    userId: string;
    name: string;
    itemType: string;
    category: string;
    size: string;
    color: string;
    imageUrl: string; 
    currentStatus: 'CLEAN' | 'READY_FOR_WASH' | 'WASHING' | 'DAMAGED' | 'OVERDUE';
    damageLog: string | null;
    lastWashed: Date | null;
    damageLevel: number;
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
    damageLevel: number;
}