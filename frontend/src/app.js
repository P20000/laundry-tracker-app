import React, { useState, useEffect } from 'react';
import { 
    ThemeProvider, 
    createTheme, 
    CssBaseline, 
    Box, 
    Container, 
    Typography, 
    Grid,
    Button,
    Fab,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useMediaQuery,
    useTheme,
    IconButton
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import CheckroomIcon from '@mui/icons-material/Checkroom'; // Shirt
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService'; // Washing Machine
import WarningIcon from '@mui/icons-material/Warning'; // Alert
import EventIcon from '@mui/icons-material/Event'; // History
import ArchiveIcon from '@mui/icons-material/Archive'; // Empty State
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- M3 Theme Definition ---
const M3Theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6750A4', // Deep Purple
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#625B71', 
        },
        error: {
            main: '#B3261E',
        },
        surfaceVariant: {
            main: '#E7E0EC', 
        },
        background: {
            default: '#FFFBFE',
            paper: '#FFFBFE',
        }
    },
    typography: {
        fontFamily: ['Roboto', 'Inter', 'sans-serif'].join(','),
        displayMedium: {
            fontSize: '2.5rem',
            fontWeight: 400,
            letterSpacing: '-0.01em',
        },
        titleLarge: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        body1: {
            fontWeight: 400,
        }
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, 
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 20, 
                    textTransform: 'none',
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 28,
                    padding: 16,
                    backgroundColor: '#FFFBFE',
                }
            }
        }
    },
});

// --- Sub-Components ---

const EmptyState = ({ view }) => {
    let message = "";
    let description = "";

    switch (view) {
        case 'catalog':
            message = "Your Wardrobe is Empty";
            description = "Click the '+' button to catalogue your first item.";
            break;
        case 'laundry':
            message = "No Clothes Ready for Wash";
            description = "Mark items for washing or wait for them to become overdue.";
            break;
        case 'damaged':
            message = "No Items Needing Repair";
            description = "Log damaged items here to keep track of repairs.";
            break;
        default:
            message = "Nothing to show.";
            description = "Start adding items to build your history.";
    }

    return (
        <Box 
            sx={{ 
                p: 6, 
                mt: 5,
                borderRadius: 4, 
                bgcolor: 'surfaceVariant.main', 
                textAlign: 'center',
            }}
        >
            <ArchiveIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>
                {message}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {description}
            </Typography>
        </Box>
    );
};

const ItemCard = ({ item, onUpdateStatus }) => {
    let statusColor = 'success';
    let statusLabel = 'Clean';

    if (item.status === 'Dirty') {
        statusColor = 'warning';
        statusLabel = 'Needs Wash';
    } else if (item.status === 'Damaged') {
        statusColor = 'error';
        statusLabel = 'Damaged';
    }

    return (
        <Box 
            sx={{ 
                bgcolor: 'background.paper', 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3, 
                overflow: 'hidden', 
                transition: '0.2s',
                '&:hover': { boxShadow: 2 }
            }}
        >
            {/* Color/Image Placeholder */}
            <Box 
                sx={{ 
                    height: 128, 
                    width: '100%', 
                    bgcolor: item.color + '20', // 20% opacity of the hex color
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color
                }}
            >
                <CheckroomIcon sx={{ fontSize: 48, opacity: 0.5 }} />
            </Box>

            <Box sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" noWrap sx={{ fontSize: '1.1rem' }}>
                        {item.name}
                    </Typography>
                    <Chip label={statusLabel} color={statusColor} size="small" />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                    Type: {item.type}
                </Typography>

                <Box display="flex" gap={1} mt={1}>
                    <Button 
                        size="small" 
                        variant="text" 
                        color="primary"
                        onClick={() => onUpdateStatus(item.id, 'Dirty')}
                    >
                        Wash
                    </Button>
                    <Button 
                        size="small" 
                        variant="text" 
                        color="error"
                        onClick={() => onUpdateStatus(item.id, 'Damaged')}
                    >
                        Report
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

// --- Main Component ---

function App() {
    const [view, setView] = useState('catalog');
    const [items, setItems] = useState([]); // Starts empty
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [newItemName, setNewItemName] = useState('');
    const [newItemType, setNewItemType] = useState('Shirt');
    const [newItemColor, setNewItemColor] = useState('#6750A4');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // --- Handlers ---

    const handleAddItem = () => {
        if (!newItemName) return;

        const newItem = {
            id: Date.now(),
            name: newItemName,
            type: newItemType,
            color: newItemColor,
            status: 'Clean'
        };

        setItems([newItem, ...items]); // Add to top
        
        // Reset and Close
        setNewItemName('');
        setIsModalOpen(false);
    };

    const handleStatusChange = (id, newStatus) => {
        setItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                // Toggle logic: if clicking Wash on a Dirty item, clean it? 
                // For MVP simplicity: If status matches newStatus, toggle back to Clean.
                return { ...item, status: item.status === newStatus ? 'Clean' : newStatus };
            }
            return item;
        }));
    };

    // --- Render Logic ---

    const getFilteredItems = () => {
        if (view === 'laundry') return items.filter(i => i.status === 'Dirty');
        if (view === 'damaged') return items.filter(i => i.status === 'Damaged');
        return items; // catalog shows all
    };

    const filteredItems = getFilteredItems();

    const navItems = [
        { name: 'Catalog', icon: <CheckroomIcon />, view: 'catalog' },
        { name: 'Laundry', icon: <LocalLaundryServiceIcon />, view: 'laundry' },
        { name: 'Damaged', icon: <WarningIcon />, view: 'damaged' },
        { name: 'History', icon: <EventIcon />, view: 'history' },
    ];

    const currentPageTitle = navItems.find(n => n.view === view)?.name || 'Wardrobe';

    return (
        <ThemeProvider theme={M3Theme}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                
                {/* Desktop Navigation Rail */}
                {!isMobile && (
                    <Box 
                        sx={{ 
                            width: 80, 
                            height: '100%', 
                            bgcolor: 'background.paper', 
                            borderRight: 1, 
                            borderColor: 'divider',
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            py: 2
                        }}
                    >
                        <Typography variant="h6" color="primary" sx={{ mb: 4, fontWeight: 'bold' }}>SW</Typography>
                        
                        <Fab color="secondary" size="medium" sx={{ mb: 4, boxShadow: 0 }} onClick={() => setIsModalOpen(true)}>
                            <AddIcon />
                        </Fab>

                        <Box display="flex" flexDirection="column" gap={2}>
                            {navItems.map((item) => {
                                const isActive = view === item.view;
                                return (
                                    <Button
                                        key={item.name}
                                        onClick={() => setView(item.view)}
                                        variant={isActive ? 'contained' : 'text'}
                                        color={isActive ? 'secondary' : 'inherit'}
                                        sx={{ 
                                            minWidth: 56,
                                            width: 56,
                                            height: 56,
                                            borderRadius: 4,
                                            flexDirection: 'column',
                                            p: 1,
                                            // FIX: Explicitly coloring the icon based on state
                                            color: isActive ? 'secondary.contrastText' : 'text.secondary',
                                            bgcolor: isActive ? 'secondary.main' : 'transparent',
                                            '&:hover': {
                                                bgcolor: isActive ? 'secondary.dark' : 'action.hover',
                                            }
                                        }}
                                    >
                                        {/* Clone element to pass color prop if needed, or rely on parent color */}
                                        {item.icon}
                                        <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.5, fontWeight: isActive ? 700 : 400 }}>
                                            {item.name}
                                        </Typography>
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                )}

                {/* Main Content */}
                <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    
                    {/* Content Header */}
                    <Box sx={{ p: { xs: 2, md: 4 }, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="displayMedium" color="text.primary">
                            {currentPageTitle}
                        </Typography>
                        {isMobile && (
                            <IconButton onClick={() => setIsModalOpen(true)} sx={{ bgcolor: 'secondary.container', color: 'secondary.contrastText' }}>
                                <AddIcon />
                            </IconButton>
                        )}
                    </Box>

                    {/* Scrollable Grid Area */}
                    <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1, overflowY: 'auto' }}>
                        {filteredItems.length === 0 ? (
                            <EmptyState view={view} />
                        ) : (
                            <Grid container spacing={2}>
                                {filteredItems.map(item => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                                        <ItemCard item={item} onUpdateStatus={handleStatusChange} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>

                    {/* Mobile Bottom Nav */}
                    {isMobile && (
                        <Box sx={{ 
                            position: 'fixed', bottom: 0, left: 0, right: 0, 
                            bgcolor: 'surfaceVariant.main', 
                            height: 80, 
                            display: 'flex', 
                            justifyContent: 'space-around', 
                            alignItems: 'center',
                            pb: 2 // account for safe area
                        }}>
                            {navItems.slice(0, 3).map((item) => {
                                const isActive = view === item.view;
                                return (
                                    <Box 
                                        key={item.name} 
                                        onClick={() => setView(item.view)}
                                        sx={{ 
                                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            opacity: isActive ? 1 : 0.7,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Box sx={{ 
                                            bgcolor: isActive ? 'secondary.container' : 'transparent', 
                                            color: isActive ? 'secondary.onContainer' : 'text.primary',
                                            px: 2.5, py: 0.5, borderRadius: 4, mb: 0.5 
                                        }}>
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
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    New Item
                    <IconButton onClick={() => setIsModalOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={3} mt={1}>
                        <TextField 
                            label="Item Name" 
                            variant="filled" 
                            fullWidth 
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder="e.g. Blue Denim Shirt"
                        />
                        <Box display="flex" gap={2}>
                            <FormControl fullWidth variant="filled">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={newItemType}
                                    onChange={(e) => setNewItemType(e.target.value)}
                                >
                                    <MenuItem value="Shirt">Shirt</MenuItem>
                                    <MenuItem value="Pants">Pants</MenuItem>
                                    <MenuItem value="Dress">Dress</MenuItem>
                                    <MenuItem value="Outerwear">Outerwear</MenuItem>
                                </Select>
                            </FormControl>
                            <input 
                                type="color" 
                                value={newItemColor} 
                                onChange={(e) => setNewItemColor(e.target.value)}
                                style={{ height: 56, width: 56, border: 'none', background: 'transparent', cursor: 'pointer' }} 
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setIsModalOpen(false)} color="primary">Cancel</Button>
                    <Button onClick={handleAddItem} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>

        </ThemeProvider>
    );
}

export default App;