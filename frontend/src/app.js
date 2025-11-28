import React, { useState, useEffect } from 'react';
import { 
    ThemeProvider, createTheme, CssBaseline, Box, Container, Typography, Grid, Button, Fab, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, useMediaQuery, useTheme, IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService'; 
import WarningIcon from '@mui/icons-material/Warning'; 
import ArchiveIcon from '@mui/icons-material/Archive'; 
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BuildIcon from '@mui/icons-material/Build';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon (Dark Mode)
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon (Light Mode)
import EventIcon from '@mui/icons-material/Event'; // Icon for item history button 
import { WashHistoryTimeline } from './components/WashHistoryTimeline';
import { Dashboard } from './components/Dashboard';

// --- New SVG Logo Component ---
const CustomLogo = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        // Use the original viewBox dimensions from your Illustrator export
        viewBox="0 0 703.73 965.85" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="51" // Use the largest stroke width as a base
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props} // Allows inheriting props like color and sx
    >
        {/* Hanger and Folded Clothes (Your Illustrator Paths) */}
        <rect x="25.5" y="616.47" width="652.73" height="161.94" rx="80.97"/>
        <rect x="25.5" y="778.41" width="652.73" height="161.94" rx="80.97"/>
        <line x1="351.87" y1="465.33" x2="351.87" y2="556.68"/>
        <polyline points="408.56 511.01 678.23 511.01 351.87 254.4 25.5 511.01 295.17 511.01"/>
        <line x1="351.87" y1="254.4" x2="351.87" y2="179.68"/>
        <path d="M427.66,119.68s-.19-73,73-73c33.16,0,52,15.77,62.78,33,16.51,26.54,16,60.29-.35,86.93-10.91,17.74-29.93,34.22-63,34.22" transform="translate(-147.61 -21.2)"/>
        <path d="M425.14,448.06" transform="translate(-147.61 -21.2)"/>
    </svg>
);



// --- Configuration ---
// Ensure your backend is running on this port
const API_BASE_URL = 'https://laundry-tracker-backend.onrender.com'; 
const API_PROTECTED_URL = `${API_BASE_URL}/api/v1`;
const AUTH_TOKEN_KEY = 'auth_token';

// --- M3 Theme Definition ---
// --- Theme Definitions (Dark Mode Added) ---

const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                  // Light Palette (Your Existing Purple Theme)
                  primary: { main: '#6750A4', contrastText: '#FFFFFF' },
                  secondary: { main: '#625B71' },
                  error: { main: '#B3261E' },
                  surfaceVariant: { main: '#E7E0EC' },
                  background: { default: '#FFFBFE', paper: '#FFFBFE' },
              }
            : {
                  // Dark Palette (Dark Mode Tones)
                  primary: { main: '#D0BCFF', contrastText: '#381E72' },
                  secondary: { main: '#CCC2DC', contrastText: '#332D41' },
                  error: { main: '#F2B8B5', contrastText: '#601410' },
                  surfaceVariant: { main: '#49454F', contrastText: '#E7E0EC' },
                  background: { default: '#1C1B1F', paper: '#1C1B1F' },
                  text: { primary: '#E6E1E5', secondary: '#CAC4D0' },
              }),
    },
    // Keep typography and component overrides outside of the mode ternary
    typography: {
        fontFamily: ['Roboto', 'Inter', 'sans-serif'].join(','),
        displayMedium: { fontSize: '2.5rem', fontWeight: 400, letterSpacing: '-0.01em' },
        titleLarge: { fontSize: '1.25rem', fontWeight: 500 },
        body1: { fontWeight: 400 }
    },
    components: {
        MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0px 1px 3px rgba(0,0,0,0.4)', backgroundColor: mode === 'dark' ? '#2d2b2f' : undefined } } },
        MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 20, textTransform: 'none' } } },
        MuiDialog: { styleOverrides: { paper: { borderRadius: 28, padding: 16, backgroundColor: mode === 'dark' ? '#1C1B1F' : '#FFFBFE' } } }
    },
});

// --- Helper Functions ---
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});

// --- Sub-Components (EmptyState, ItemCard) ---

// Updated EmptyState to include an Action Button
const EmptyState = ({ view, onAddClick }) => {
    let message = "Your Wardrobe is Empty";
    let description = "Click the button below to catalogue your first item.";
    let showAddButton = false;
    
    if (view === 'catalog') { 
        showAddButton = true;
    } else if (view === 'laundry') { 
        message = "No Clothes Ready for Wash"; 
        description = "Mark items for washing or wait for them to become overdue."; 
    } else if (view === 'damaged') { 
        message = "No Items Needing Repair"; 
        description = "Log damaged items here to keep track of repairs."; 
    }

    return (
        <Box sx={{ 
            p: 8, 
            mt: 5, 
            borderRadius: 4, 
            bgcolor: 'surfaceVariant.main', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
        }}>
            <ArchiveIcon sx={{ fontSize: 64, color: 'secondary.main', opacity: 0.5 }} />
            <Box>
                <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>{message}</Typography>
                <Typography variant="body1" color="text.secondary">{description}</Typography>
            </Box>
            
            {showAddButton && (
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={onAddClick}
                    sx={{ mt: 2, px: 4, py: 1.5 }}
                >
                    Add First Item
                </Button>
            )}
        </Box>
    );
};

const ItemCard = ({ item, onUpdateStatus, onViewDetails }) => {
    // --- DYNAMIC STATUS LOGIC ---
    let statusColor = 'success';
    let statusLabel = 'Clean';
    
    // Button Config Defaults (for CLEAN items)
    let mainBtnText = 'Queue Wash';
    let mainBtnAction = 'READY_FOR_WASH'; // Action: Move TO laundry
    let mainBtnVariant = 'outlined';
    let mainBtnIcon = <LocalLaundryServiceIcon />;

    // 1. Laundry State
    if (item.currentStatus === 'READY_FOR_WASH' || item.currentStatus === 'OVERDUE') {
        statusColor = 'warning';
        statusLabel = 'Needs Wash';
        
        mainBtnText = 'Done Washing';
        mainBtnAction = 'WASHED'; // Action: Mark clean (finish laundry)
        mainBtnVariant = 'contained';
        mainBtnIcon = <CheckroomIcon />; // Icon changes to shirt
    } 
    // 2. Damaged State
    else if (item.currentStatus === 'DAMAGED') {
        statusColor = 'error';
        statusLabel = 'Damaged';
        
        mainBtnText = 'Mark Repaired';
        mainBtnAction = 'CLEAN'; // Action: Fix it, moves it back to Clean list
        mainBtnVariant = 'outlined';
        mainBtnIcon = <BuildIcon />;
    } 
    // 3. Washing State (Optional/future state if tracking in-machine)
    else if (item.currentStatus === 'WASHING') {
        statusColor = 'info';
        statusLabel = 'Washing';
        mainBtnText = 'Finish';
        mainBtnAction = 'WASHED';
        mainBtnVariant = 'contained';
    }

    const lastWashedDate = item.lastWashed ? new Date(item.lastWashed).toLocaleDateString() : 'Never';

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
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: '100%' }}>
                    <CustomLogo 
                        sx={{ 
                            color: 'primary.main', // Inherits M3 primary color 
                            width: 32, 
                            height: 32 
                        }} 
                    />
                </Box>
                
                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>{item.category}</Typography>
                    <Typography variant="caption" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>Size: {item.size}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', width: '100%' }}>Last Washed: {lastWashedDate}</Typography>
                </Box>

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1, pt: 1 }}>
                    {/* Main Action Button (WASHED, CLEAN, or READY_FOR_WASH) */}
                    <Button 
                        size="small" 
                        variant={mainBtnVariant} 
                        color="primary" 
                        fullWidth 
                        // Passes the dynamic action string (e.g., 'READY_FOR_WASH' or 'WASHED')
                        onClick={() => onUpdateStatus(item.id, mainBtnAction)} 
                        startIcon={mainBtnIcon}
                    >
                        {mainBtnText}
                    </Button>
                    <Button 
                        size="small" 
                        variant="text" 
                        color="secondary" 
                        onClick={() => onViewDetails(item)} // Call the new handler
                        sx={{ minWidth: 40, px: 1 }}
                        title="View Wash History"
                    >
                        <EventIcon />
                    </Button>
                    {/* Damage Toggle Button (Toggles between DAMAGED and CLEAN) */}
                    <Button 
                        size="small" 
                        variant="text" 
                        color={item.currentStatus === 'DAMAGED' ? 'success' : 'error'} 
                        // Toggles status: If currently DAMAGED -> set CLEAN. If not damaged -> set DAMAGED.
                        onClick={() => onUpdateStatus(item.id, item.currentStatus === 'DAMAGED' ? 'CLEAN' : 'DAMAGED')} 
                        sx={{ minWidth: 40, px: 1 }}
                        title={item.currentStatus === 'DAMAGED' ? "Mark Repaired" : "Report Damage"}
                    >
                        {item.currentStatus === 'DAMAGED' ? <CheckroomIcon /> : <WarningIcon />}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

// --- Authentication Component ---

const AuthCard = ({ setLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        const endpoint = isSignup ? '/signup' : '/login';
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
                    setLoggedIn(true);
                } else if (isSignup) {
                    setMessage("Registration successful. Please log in.");
                    setIsSignup(false); 
                }
            } else {
                setMessage(data.error || "Authentication failed. Check API URL/console.");
            }
        } catch (error) {
            setMessage("Error connecting to the server. Check backend console.");
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 4, 
                    borderRadius: 5, 
                    bgcolor: 'background.paper',
                    boxShadow: 3, 
                    border: '1px solid', 
                    borderColor: 'divider'
                }}
            >
                <Box 
                    sx={{ 
                        p: 2, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        color: 'primary.contrastText', 
                        mb: 2 
                    }}
                >
                    {isSignup ? <PersonAddIcon fontSize="large" /> : <LockOpenIcon fontSize="large" />}
                </Box>

                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 500 }}>
                    {isSignup ? 'Register' : 'Sign In'}
                </Typography>
                
                {message && (
                    <Typography variant="body2" color="error" sx={{ my: 1 }}>
                        {message}
                    </Typography>
                )}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="filled"
                    size="small"
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="filled"
                    size="small"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 5 }}
                >
                    {isSignup ? 'Sign Up' : 'Log In'}
                </Button>
                
                <Grid container justifyContent="center">
                    <Grid item>
                        <Button 
                            onClick={() => setIsSignup(!isSignup)} 
                            color="primary" 
                            variant="text"
                            sx={{ textTransform: 'none' }}
                        >
                            {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

// --- Main Component ---

function App() {
    const [view, setView] = useState('catalog');
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    
    // Form State 
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Casuals');
    const [newItemType, setNewItemType] = useState('Shirt');
    const [newItemSize, setNewItemSize] = useState('M');
    const [newItemColor, setNewItemColor] = useState('#6750A4');
    const [newItemImageBlob, setNewItemImageBlob] = useState(null); 
    const [newItemImagePreview, setNewItemImagePreview] = useState(null); 
    const [selectedItem, setSelectedItem] = useState(null);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    const [mode, setMode] = useState(
        localStorage.getItem('themeMode') || (prefersDarkMode ? 'dark' : 'light')
    );

    // 2. Theme Handler
    const colorMode = React.useMemo(() => ({
        // Function to toggle the mode
        toggleColorMode: () => {
            setMode((prevMode) => {
                const newMode = prevMode === 'light' ? 'dark' : 'light';
                localStorage.setItem('themeMode', newMode);
                return newMode;
            });
        },
    }), []);

    // 3. Memoized Theme Creator
    const finalTheme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);


    // 1. Check Auth Status on Load
    useEffect(() => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // 2. Fetch data only if logged in
    useEffect(() => {
        if (isLoggedIn) {
            fetchItems();
        } else {
            setItems([]); 
        }
    }, [isLoggedIn, view]);

    // --- API Interaction ---

    const fetchItems = async () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) return;

        try {
            let endpoint = '/items';
            if (view === 'laundry') endpoint = '/laundry';
            if (view === 'damaged') endpoint = '/damaged';
            
            const res = await fetch(`${API_PROTECTED_URL}${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.status === 401) {
                handleLogout();
                return;
            }

            const data = await res.json();
            setItems(data.map(item => ({
                ...item,
                lastWashed: item.lastWashed ? new Date(item.lastWashed) : null,
                createdAt: new Date(item.createdAt),
            })));
        } catch (err) {
            console.error("Failed to fetch items:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setIsLoggedIn(false);
        setItems([]);
        setView('catalog'); 
    };


    // --- Handlers (AddItem, StatusChange) ---
    
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewItemImageBlob(file);
            setNewItemImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddItem = async () => {
        if (!newItemName) return;
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) return handleLogout();
        let base64Image = "";
        if (newItemImageBlob) {
            try { base64Image = await fileToBase64(newItemImageBlob); } 
            catch (e) { console.error("Error converting image", e); }
        }

        const payload = { 
            name: newItemName, 
            itemType: newItemType, 
            category: newItemCategory, 
            size: newItemSize, 
            color: newItemColor, 
            imageUrl: base64Image 
        };
        try {
            const res = await fetch(`${API_PROTECTED_URL}/items`, {
                method: 'POST',
                headers: getAuthHeaders(token),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                fetchItems(); 
                // Reset and Close
                setNewItemName(''); setNewItemImagePreview(null); setNewItemImageBlob(null); setIsModalOpen(false);
            }
        } catch (err) { console.error("Network error adding item:", err); }
    };

    // Inside the App function, replacing the old function:
    const handleStatusChange = async (id, newStatus) => {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (!token) return handleLogout();

            let endpoint = `/items/${id}/status`;
            let method = 'PATCH';
            let statusPayload = { status: newStatus };

            // CASE 1: COMPLETING A WASH (WASHED -> CLEAN)
            // This hits the POST /wash endpoint to record history
            if (newStatus === 'WASHED') { 
                endpoint = `/items/${id}/wash`; 
                method = 'POST';
                statusPayload = { notes: 'Washed via app' };
            } 
            
            // CASE 2: TOGGLING DAMAGE (DAMAGED -> CLEAN or vice-versa)
            // Handled by standard PATCH /status with the new status passed by the button
            
            try {
                const res = await fetch(`${API_PROTECTED_URL}${endpoint}`, {
                    method: method,
                    headers: getAuthHeaders(token),
                    body: JSON.stringify(statusPayload)
                });
                if (res.status === 401) { handleLogout(); return; }
                if (res.ok) fetchItems();
            } catch (err) { console.error("Failed to update status:", err); }
        };

    // NEW HANDLER: Opens the History Modal
    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // --- Render Logic ---
    
    if (!isLoggedIn) {
        return (
            <ThemeProvider theme={finalTheme}>
                <CssBaseline enableColorScheme />
                <AuthCard setLoggedIn={setIsLoggedIn} />
            </ThemeProvider>
        );
    }
    
    // --- Main App Dashboard UI ---

    if (view === 'admin') {
    return (
        <ThemeProvider theme={finalTheme}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                {/* Reuse Navigation Rail Logic Here if you want sidebar on admin page too */}
                <Box sx={{ p: 2 }}>
                    <Button onClick={() => setView('catalog')} startIcon={<CheckroomIcon />}>Back to App</Button>
                    <Dashboard apiUrl={API_BASE_URL + '/api/v1'} token={localStorage.getItem(AUTH_TOKEN_KEY)} />
                </Box>
            </Box>
        </ThemeProvider>
    )
    }
    const navItems = [
        { name: 'Catalog', icon: <CheckroomIcon />, view: 'catalog' },
        { name: 'Laundry', icon: <LocalLaundryServiceIcon />, view: 'laundry' },
        { name: 'Damaged', icon: <WarningIcon />, view: 'damaged' },
    ];

    const currentPageTitle = navItems.find(n => n.view === view)?.name || 'Wardrobe';

    return (
        <ThemeProvider theme={finalTheme}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                
                {/* Desktop Navigation Rail */}
                {!isMobile && (
                    <Box sx={{ width: 80, height: '100%', bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: '100%' }}>
                            <CustomLogo 
                                sx={{ 
                                    color: 'primary.main', // Inherits M3 primary color 
                                    width: 32, 
                                    height: 32 
                                }} 
                            />
                        </Box>
                        
                        <Fab color="secondary" size="medium" sx={{ mb: 4, boxShadow: 0 }} onClick={() => setIsModalOpen(true)}>
                            <AddIcon />
                        </Fab>
                        <Box sx={{ my: 2, textAlign: 'center' }}>
                            <IconButton onClick={colorMode.toggleColorMode} color="primary" sx={{ p: 1, border: '1px solid', borderColor: 'divider' }}>
                                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </IconButton>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {theme.palette.mode === 'dark' ? 'Dark' : 'Light'}
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={2} sx={{ mb: 4 }}>
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
                        
                        {/* Logout Button on Desktop */}
                         <Button 
                            onClick={handleLogout} 
                            color="error" 
                            variant="text"
                            sx={{ mt: 'auto', minWidth: 56, color: 'error.main' }}
                            title="Logout"
                        >
                            <CloseIcon />
                        </Button>

                    </Box>
                )}

                {/* Main Content */}
                <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    
                    {/* Content Header (Mobile/Desktop) */}
                    <Box sx={{ p: { xs: 2, md: 4 }, pb: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="displayMedium" color="text.primary">
                            {currentPageTitle}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                             {/* Mobile Logout Button */}
                             {isMobile && (
                                <IconButton onClick={handleLogout} color="error" title="Logout">
                                    <CloseIcon />
                                </IconButton>
                            )}
                            {/* Mobile Add Button */}
                            {isMobile && (
                                <IconButton onClick={() => setIsModalOpen(true)} sx={{ bgcolor: 'secondary.main', color: 'primary.contrastText' }}>
                                    <AddIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Box>

                    {/* Scrollable Grid Area */}
                    <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1, overflowY: 'auto' }}>
                        {items.length === 0 ? (
                            // Pass setIsModalOpen to EmptyState to trigger modal
                            <EmptyState view={view} onAddClick={() => setIsModalOpen(true)} />
                        ) : (
                            <Grid container spacing={2}>
                                {items.map(item => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={item.id}>
                                        <ItemCard 
                                            item={item} 
                                            onUpdateStatus={handleStatusChange} 
                                            onViewDetails={handleViewDetails} // Pass the new handler here
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>

                    {/* Mobile Bottom Nav */}
                    {isMobile && (
                         <Box sx={{ 
                            position: 'fixed', bottom: 0, left: 0, right: 0, 
                            bgcolor: 'background.paper', 
                            height: 80, 
                            display: 'flex', 
                            justifyContent: 'space-around', 
                            alignItems: 'center',
                            borderTop: 1,
                            borderColor: 'divider',
                            pb: 2
                        }}>
                            {navItems.map((item) => {
                                const isActive = view === item.view;
                                return (
                                    <Box key={item.name} onClick={() => setView(item.view)} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: isActive ? 1 : 0.7, cursor: 'pointer' }}>
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
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    New Item
                    <IconButton onClick={() => setIsModalOpen(false)} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 0 }}>
                    <Box display="flex" flexDirection="column" gap={3} mt={1}>
                        <Box sx={{ height: 160, width: '100%', borderRadius: 3, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed', borderColor: 'text.secondary', position: 'relative', overflow: 'hidden', backgroundImage: newItemImagePreview ? `url(${newItemImagePreview})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" type="file" onChange={handleImageUpload} />
                            <label htmlFor="raised-button-file" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                {!newItemImagePreview && ( <Box textAlign="center" color="text.secondary"> <PhotoCamera sx={{ fontSize: 40, mb: 1 }} /> <Typography variant="caption" display="block">Upload Photo</Typography> </Box> )}
                            </label>
                        </Box>

                        <TextField label="Item Name" variant="filled" fullWidth value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. Navy Blazer" size="small" />

                        <Box display="flex" gap={2}>
                            <FormControl fullWidth variant="filled" size="small"><InputLabel>Category</InputLabel><Select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)} label="Category"><MenuItem value="Formals">Formals</MenuItem><MenuItem value="Casuals">Casuals</MenuItem><MenuItem value="Activewear">Activewear</MenuItem></Select></FormControl>
                            <FormControl fullWidth variant="filled" size="small"><InputLabel>Size</InputLabel><Select value={newItemSize} onChange={(e) => setNewItemSize(e.target.value)} label="Size"><MenuItem value="XS">XS</MenuItem><MenuItem value="S">S</MenuItem><MenuItem value="M">M</MenuItem><MenuItem value="L">L</MenuItem><MenuItem value="XL">XL</MenuItem><MenuItem value="XXL">XXL</MenuItem></Select></FormControl>
                        </Box>
                        <Box display="flex" gap={2}>
                            <FormControl fullWidth variant="filled" size="small"><InputLabel>Type</InputLabel><Select value={newItemType} onChange={(e) => setNewItemType(e.target.value)} label="Type"><MenuItem value="Shirt">Shirt</MenuItem><MenuItem value="Pants">Pants</MenuItem><MenuItem value="Dress">Dress</MenuItem><MenuItem value="Outerwear">Outerwear</MenuItem></Select></FormControl>
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