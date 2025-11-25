import express, { Request, Response } from 'express';
import cors from 'cors';
import { client } from './db'; // Importing the raw LibSQL client singleton

// Import controllers
import { 
    getAllItems, 
    getLaundryItems, 
    getDamagedItems, 
    createItem,
    markAsWashed,
    updateItemStatus 
} from './controllers/itemController';

const app = express();
const PORT = process.env.PORT || 3000;

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- Middleware ---
app.use(cors()); 
// Limit increased to 10mb to handle Base64 image uploads from frontend
app.use(express.json({ limit: '10mb' })); 

// --- Routes ---

/**
 * @route GET /health
 * @description Simple check to see if API and Turso DB are responsive
 */
app.get('/health', (req: Request, res: Response) => {
    // Attempt a simple query to verify the connection without crashing on errors
    client.execute("SELECT 1").then(() => {
        res.status(200).json({ status: 'ok', database: 'connected' });
    }).catch((error: unknown) => { 
        console.error('Database connection failed:', error);
        res.status(503).json({ status: 'error', details: getErrorMessage(error) });
    });
});

// --- API v1 Routes ---
const router = express.Router();

// Item CRUD
router.post('/items', createItem);
router.get('/items', getAllItems);

// Specific Actions
router.post('/items/:id/wash', markAsWashed); 
router.patch('/items/:id/status', updateItemStatus); 

// Filtered Views
router.get('/laundry', getLaundryItems);
router.get('/damaged', getDamagedItems);

// Mount routes under /api/v1
app.use('/api/v1', router);

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`⚡️ [server]: API running at http://localhost:${PORT}`);
});