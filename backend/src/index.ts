import express, { Request, Response } from 'express';
import cors from 'cors';
import { client } from './db'; 

// Import controllers
import { 
    getAllItems, 
    getLaundryItems, 
    getDamagedItems, 
    createItem,
    markAsWashed,
    updateItemStatus 
} from './controllers/itemController';

// --- MISSING IMPORTS? ---
import { registerUser, loginUser } from './controllers/authController'; 
import { protect } from './middleware/authMiddleware'; 
// ------------------------

const app = express();
const PORT = process.env.PORT || 3000;

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return String(error);
};

// --- Middleware ---
app.use(cors()); 
app.use(express.json({ limit: '10mb' })); 

// --- Routes ---

// Root Route
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Smart Wardrobe API is running!');
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
    client.execute("SELECT 1").then(() => {
        res.status(200).json({ status: 'ok', database: 'connected' });
    }).catch((error: unknown) => { 
        console.error('Database connection failed:', error);
        res.status(503).json({ status: 'error', details: getErrorMessage(error) });
    });
});

// --- MISSING ROUTES? ---
// These lines MUST be here for login to work!
app.post('/signup', registerUser);
app.post('/login', loginUser);
// -----------------------

// --- PROTECTED API v1 Routes ---
const protectedRouter = express.Router();
protectedRouter.use(protect);

// Item CRUD
protectedRouter.post('/items', createItem);
protectedRouter.get('/items', getAllItems);

// Actions
protectedRouter.post('/items/:id/wash', markAsWashed); 
protectedRouter.patch('/items/:id/status', updateItemStatus); 

// Views
protectedRouter.get('/laundry', getLaundryItems);
protectedRouter.get('/damaged', getDamagedItems);

app.use('/api/v1', protectedRouter);

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`⚡️ [server]: API running at http://localhost:${PORT}`);
});