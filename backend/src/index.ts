import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

// Import our controller functions
import { 
    getAllItems, 
    getLaundryItems, 
    getDamagedItems, 
    createItem,
    markAsWashed,
    updateItemStatus // New function to handle generic status updates
} from './controllers/itemController';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- Middleware ---
app.use(cors()); 
// INCREASE LIMIT to 10mb to handle Base64 images
app.use(express.json({ limit: '10mb' })); 

// --- Routes ---
app.get('/health', (req: Request, res: Response) => {
    prisma.$queryRaw`SELECT 1`.then(() => {
        res.status(200).json({ status: 'ok', database: 'connected' });
    }).catch((error: unknown) => { 
        console.error('Database connection failed:', error);
        res.status(503).json({ status: 'error', details: getErrorMessage(error) });
    });
});

// --- API v1 Routes ---
const router = express.Router();

router.post('/items', createItem);
router.get('/items', getAllItems);
router.post('/items/:id/wash', markAsWashed); 
router.patch('/items/:id/status', updateItemStatus); // New generic status update

router.get('/laundry', getLaundryItems);
router.get('/damaged', getDamagedItems);

app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`⚡️ [server]: API running at http://localhost:${PORT}`);
});