import React, { useState, useEffect } from 'react';
// ... (Imports same as before)
import { 
    ThemeProvider, createTheme, CssBaseline, Box, Container, Typography, Grid, Button, Fab, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService'; 
import WarningIcon from '@mui/icons-material/Warning'; 
import EventIcon from '@mui/icons-material/Event'; 
import ArchiveIcon from '@mui/icons-material/Archive'; 
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

// --- Configuration ---
const API_URL = 'http://localhost:3000/api/v1';

// --- M3 Theme Definition ---
// (Same theme as before)
const M3Theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#6750A4', contrastText: '#FFFFFF' },
        secondary: { main: '#625B71' },
        error: { main: '#B3261E' },
        surfaceVariant: { main: '#E7E0EC' },
        background: { default: '#FFFBFE', paper: '#FFFBFE' }
    },
    typography: {
        fontFamily: ['Roboto', 'Inter', 'sans-serif'].join(','),
        displayMedium: { fontSize: '2.5rem', fontWeight: 400, letterSpacing: '-0.01em' },
        titleLarge: { fontSize: '1.25rem', fontWeight: 500 },
        body1: { fontWeight: 400 }
    },
    components: {
        MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0px 1px 3px rgba(0,0,0,0.12)' } } },
        MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 20, textTransform: 'none' } } },
        MuiDialog: { styleOverrides: { paper: { borderRadius: 28, padding: 16, backgroundColor: '#FFFBFE' } } }
    },
});

// --- Helper: File to Base64 ---
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

// --- Sub-Components (EmptyState, ItemCard) ---
// (Same styling as before, just logic tweaks in App)

const EmptyState = ({ view }) => {
    let message = "Your Wardrobe is Empty";
    let description = "Click the '+' button to catalogue your first item.";
    
    if (view === 'laundry') { message = "No Clothes Ready for Wash"; description = "Mark items for washing."; }
    if (view === 'damaged') { message = "No Items Needing Repair"; description = "Log damaged items here."; }

    return (
        <Box sx={{ p: 6, mt: 5, borderRadius: 4, bgcolor: 'surfaceVariant.main', textAlign: 'center' }}>
            <ArchiveIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>{message}</Typography>
            <Typography variant="body1" color="text.secondary">{description}</Typography>
        </Box>
    );
};

const ItemCard = ({ item, onUpdateStatus }) => {
    let statusColor = 'success';
    let statusLabel = 'Clean';

    // Map Backend Enums to UI
    if (item.currentStatus === 'READY_FOR_WASH' || item.currentStatus === 'OVERDUE') {
        statusColor = 'warning';
        statusLabel = 'Needs Wash';
    } else if (item.currentStatus === 'DAMAGED') {
        statusColor = 'error';
        statusLabel = 'Damaged';
    } else if (item.currentStatus === 'WASHING') {
        statusColor = 'info';
        statusLabel = 'Washing';
    }

    return (
        <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden', transition: '0.2s', '&:hover': { boxShadow: 2 } }}>
            <Box sx={{ 
                height: 160, width: '100%', 
                bgcolor: item.color + '20', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: item.color,
                backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center'
            }}>
                {!item.imageUrl && <CheckroomIcon sx={{ fontSize: 48, opacity: 0.5 }} />}
            </Box>

            <Box sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', lineHeight: 1.2, fontWeight: 500 }}>{item.name}</Typography>
                    <Chip label={statusLabel} color={statusColor} size="small" sx={{ height: 24, fontSize: '0.7rem' }} />
                </Box>
                
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>{item.category}</Typography>
                    <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>Size: {item.size}</Typography>
                </Box>

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1, pt: 1 }}>
                    <Button size="small" variant="outlined" color="primary" fullWidth onClick={() => onUpdateStatus(item.id, 'READY_FOR_WASH')} startIcon={<LocalLaundryServiceIcon />}>Wash</Button>
                    <Button size="small" variant="text" color="error" onClick={() => onUpdateStatus(item.id, 'DAMAGED')} sx={{ minWidth: 40, px: 1 }}><WarningIcon /></Button>
                </Box>
            </Box>
        </Box>
    );
};

// --- Main Component ---

function App() {
    const [view, setView] = useState('catalog');
    const [items, setItems] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Casuals');
    const [newItemType, setNewItemType] = useState('Shirt');
    const [newItemSize, setNewItemSize] = useState('M');
    const [newItemColor, setNewItemColor] = useState('#6750A4');
    const [newItemImageBlob, setNewItemImageBlob] = useState(null); // Raw file
    const [newItemImagePreview, setNewItemImagePreview] = useState(null); // Preview URL

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // --- API Interaction ---

    const fetchItems = async () => {
        try {
            let endpoint = '/items';
            if (view === 'laundry') endpoint = '/laundry';
            if (view === 'damaged') endpoint = '/damaged';
            
            const res = await fetch(`${API_URL}${endpoint}`);
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error("Failed to fetch items:", err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [view]); // Refetch when view changes

    // --- Handlers ---

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewItemImageBlob(file);
            setNewItemImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddItem = async () => {
        if (!newItemName) return;

        let base64Image = "";
        if (newItemImageBlob) {
            try {
                base64Image = await fileToBase64(newItemImageBlob);
            } catch (e) {
                console.error("Error converting image", e);
            }
        }

        const payload = {
            name: newItemName,
            type: newItemType, // 'itemType' in backend
            itemType: newItemType, // mapping for backend
            category: newItemCategory,
            size: newItemSize,
            color: newItemColor,
            imageUrl: base64Image,
            userId: 'demo-user'
        };

        try {
            const res = await fetch(`${API_URL}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                fetchItems(); // Refresh list
                // Reset and Close
                setNewItemName('');
                setNewItemImagePreview(null);
                setNewItemImageBlob(null);
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error("Failed to add item:", err);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        // If 'Wash' button clicked, we mark as READY_FOR_WASH. 
        // If in 'Laundry' view, we might want to mark as CLEAN (Done Washing).
        // For MVP: 'Wash' button -> READY_FOR_WASH. 'Report' -> DAMAGED.
        
        // Special case: If marking as washed (Action performed)
        if (view === 'laundry') {
             // In laundry view, clicking "Wash" (or a "Done" button) should mark it Clean
             await fetch(`${API_URL}/items/${id}/wash`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ notes: 'Washed via app' }) });
        } else {
             // Just changing status
             await fetch(`${API_URL}/items/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        }
        fetchItems();
    };

    // --- Render Logic ---
    // (Same Navigation/Layout logic as previous version, just calling fetchItems/handleAddItem)
    
    const navItems = [
        { name: 'Catalog', icon: <CheckroomIcon />, view: 'catalog' },
        { name: 'Laundry', icon: <LocalLaundryServiceIcon />, view: 'laundry' },
        { name: 'Damaged', icon: <WarningIcon />, view: 'damaged' },
        { name: 'History', icon: <EventIcon />, view: 'history' },
    ];

    return (
        <ThemeProvider theme={M3Theme}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                
                {/* Desktop Navigation Rail */}
                {!isMobile && (
                    <Box sx={{ width: 80, height: '100%', bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                        <Typography variant="h6" color="primary" sx={{ mb: 4, fontWeight: 'bold' }}>SW</Typography>
                        <Fab color="secondary" size="medium" sx={{ mb: 4, boxShadow: 0 }} onClick={() => setIsModalOpen(true)}>
                            <AddIcon />
                        </Fab>
                        <Box display="flex" flexDirection="column" gap={2}>
                            {navItems.map((item) => {
                                const isActive = view === item.view;
                                return (
                                    <Button key={item.name} onClick={() => setView(item.view)} variant={isActive ? 'contained' : 'text'} color={isActive ? 'secondary' : 'inherit'} sx={{ minWidth: 56, width: 56, height: 56, borderRadius: 4, flexDirection: 'column', p: 1, color: isActive ? 'secondary.contrastText' : 'text.secondary', bgcolor: isActive ? 'secondary.main' : 'transparent', '&:hover': { bgcolor: isActive ? 'secondary.dark' : 'action.hover' } }}>
                                        {item.icon}
                                        <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.5, fontWeight: isActive ? 700 : 400 }}>{item.name}</Typography>
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                )}

                {/* Main Content */}
                <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <Box sx={{ p: { xs: 2, md: 4 }, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="displayMedium" color="text.primary">
                            {navItems.find(n => n.view === view)?.name || 'Wardrobe'}
                        </Typography>
                        {isMobile && ( <IconButton onClick={() => setIsModalOpen(true)} sx={{ bgcolor: 'secondary.container', color: 'secondary.contrastText' }}> <AddIcon /> </IconButton> )}
                    </Box>

                    <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1, overflowY: 'auto' }}>
                        {items.length === 0 ? (
                            <EmptyState view={view} />
                        ) : (
                            <Grid container spacing={2}>
                                {items.map(item => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                        <ItemCard item={item} onUpdateStatus={handleStatusChange} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>

                    {/* Mobile Bottom Nav */}
                    {isMobile && (
                        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'surfaceVariant.main', height: 80, display: 'flex', justifyContent: 'space-around', alignItems: 'center', pb: 2 }}>
                            {navItems.slice(0, 3).map((item) => {
                                const isActive = view === item.view;
                                return (
                                    <Box key={item.name} onClick={() => setView(item.view)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: isActive ? 1 : 0.7, cursor: 'pointer' }}>
                                        <Box sx={{ bgcolor: isActive ? 'secondary.container' : 'transparent', color: isActive ? 'secondary.onContainer' : 'text.primary', px: 2.5, py: 0.5, borderRadius: 4, mb: 0.5 }}>
                                            {item.icon}
                                        </Box>
                                        <Typography variant="caption" fontWeight={isActive ? 700 : 400}>{item.name}</Typography>
                                    </Box>
                                )
                            })}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Add Item Dialog */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    New Item
                    <IconButton onClick={() => setIsModalOpen(false)} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 0 }}>
                    <Box display="flex" flexDirection="column" gap={3} mt={1}>
                        {/* Image Upload */}
                        <Box sx={{ height: 160, width: '100%', borderRadius: 3, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed', borderColor: 'text.secondary', position: 'relative', overflow: 'hidden', backgroundImage: newItemImagePreview ? `url(${newItemImagePreview})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" type="file" onChange={handleImageUpload} />
                            <label htmlFor="raised-button-file" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                {!newItemImagePreview && ( <Box textAlign="center" color="text.secondary"> <PhotoCamera sx={{ fontSize: 40, mb: 1 }} /> <Typography variant="caption" display="block">Upload Photo</Typography> </Box> )}
                            </label>
                        </Box>

                        <TextField label="Item Name" variant="filled" fullWidth value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. Navy Blazer" />

                        <Box display="flex" gap={2}>
                            <FormControl fullWidth variant="filled"><InputLabel>Category</InputLabel><Select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)}><MenuItem value="Formals">Formals</MenuItem><MenuItem value="Casuals">Casuals</MenuItem><MenuItem value="Activewear">Activewear</MenuItem></Select></FormControl>
                            <FormControl fullWidth variant="filled"><InputLabel>Size</InputLabel><Select value={newItemSize} onChange={(e) => setNewItemSize(e.target.value)}><MenuItem value="S">S</MenuItem><MenuItem value="M">M</MenuItem><MenuItem value="L">L</MenuItem></Select></FormControl>
                        </Box>
                        <Box display="flex" gap={2}>
                            <FormControl fullWidth variant="filled"><InputLabel>Type</InputLabel><Select value={newItemType} onChange={(e) => setNewItemType(e.target.value)}><MenuItem value="Shirt">Shirt</MenuItem><MenuItem value="Pants">Pants</MenuItem></Select></FormControl>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '30%' }}><Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>Color</Typography><input type="color" value={newItemColor} onChange={(e) => setNewItemColor(e.target.value)} style={{ height: 40, width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }} /></Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsModalOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleAddItem} variant="contained" color="primary" disableElevation>Save Item</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default App;