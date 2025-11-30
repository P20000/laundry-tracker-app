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
    updateItemStatus,
    updateItemDetails,
    getItemHistory,
    deleteItem,
    createWashJob,
    checkWashJobs,
    getActiveWashJobs 
} from './controllers/itemController';

import { registerUser, loginUser } from './controllers/authController'; 
import { protect } from './middleware/authMiddleware'; 

// --- NEW IMPORT FOR ADMIN DASHBOARD ---
import { getSystemStats } from './controllers/adminController'; 

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

// --- PUBLIC Routes (Authentication) ---
app.post('/signup', registerUser);
app.post('/login', loginUser);


// --- PROTECTED API v1 Routes ---
const protectedRouter = express.Router();

// Apply Auth Middleware (Everything below this line requires a valid JWT)
protectedRouter.use(protect);

// --- ADMIN ROUTES ---
// This endpoint returns the stats/logs for the dashboard
protectedRouter.get('/admin/dashboard', getSystemStats); 

// --- ITEM ROUTES ---
protectedRouter.post('/items', createItem);
protectedRouter.get('/items', getAllItems);
protectedRouter.delete('/items/:id', deleteItem);

// Item History Route
protectedRouter.get('/items/:id/history', getItemHistory);
// Actions
protectedRouter.post('/items/:id/wash', markAsWashed); 
protectedRouter.patch('/items/:id/status', updateItemStatus); 
protectedRouter.patch('/items/:id/details', updateItemDetails);

// Views
protectedRouter.get('/laundry', getLaundryItems);
protectedRouter.get('/damaged', getDamagedItems);
// New Route: Batch Wash Job Creation
protectedRouter.post('/wash-jobs', createWashJob);
protectedRouter.post('/wash-jobs/check', checkWashJobs);
// Mount all protected routes under /api/v1
app.use('/api/v1', protectedRouter);

// New Route: Fetch Active Wash Jobs
protectedRouter.get('/wash-jobs', getActiveWashJobs);

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`⚡️ [server]: API running at http://localhost:${PORT}`);
});