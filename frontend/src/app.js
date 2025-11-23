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
    useMediaQuery,
    useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import WarningIcon from '@mui/icons-material/Warning';
import EventIcon from '@mui/icons-material/Event';
import ArchiveIcon from '@mui/icons-material/Archive'; 

// NOTE: For optimal performance and sleek styling, ensure you link the Roboto font 
// from Google Fonts (weights 300, 400, 500, 700) in your public/index.html file.

// --- M3 Theme Definition (Matching previous color palette) ---
const M3Theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6750A4', // Primary M3 color (Deep Purple)
        },
        secondary: {
            main: '#625B71', // Secondary M3 color for emphasis
        },
        surfaceVariant: {
            main: '#E7E0EC', // Light grey surface container color
        },
        background: {
            default: '#FFFBFE', // M3 Surface background
        }
    },
    typography: {
        // Use Roboto as the primary font, ensuring the sleek look
        fontFamily: ['Roboto', 'Inter', 'sans-serif'].join(','),
        // Large, clean headline style for the main page title
        displayMedium: {
            fontSize: '2.5rem', // Slightly larger font size
            fontWeight: 400,    // Sleek, lighter weight
            letterSpacing: '-0.01em', // Subtle negative spacing for a modern look
        },
        // Title style for navigation and cards
        titleLarge: {
            fontSize: '1.25rem',
            fontWeight: 500,
        },
        // Body text maintains readability
        body1: {
            fontWeight: 400,
        }
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // M3 standard large shape
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 20, // Fully rounded corners for M3 buttons
                }
            }
        },
        // Ensure Empty State message is slightly bolder for hierarchy
        MuiTypography: {
            variants: [
                {
                    props: { variant: 'h5' },
                    style: {
                        fontWeight: 500,
                    }
                }
            ]
        }
    },
});

// --- Data Structures ---
// The application starts with an empty state as required
const BLANK_ITEM_LIST = []; 

/**
 * Renders the Empty State UI (M3 style card)
 */
const EmptyState = ({ view }) => {
    let message = "";
    let description = "";

    switch (view) {
        case 'catalog':
            message = "Your Digital Wardrobe is Empty";
            description = "Click the large '+' button to catalogue your first item.";
            break;
        case 'laundry':
            message = "No Clothes Ready for Wash";
            description = "Mark items for washing or wait for wear-time to expire.";
            break;
        case 'damaged':
            message = "No Items Needing Repair";
            description = "Log damaged items here to keep track of repairs or retirement.";
            break;
        default:
            message = "History is Blank.";
            description = "Start tracking to build your wash timeline.";
    }

    return (
        <Box 
            sx={{ 
                p: { xs: 4, md: 6 }, 
                mt: 5,
                borderRadius: 4, 
                bgcolor: 'surfaceVariant.main', 
                textAlign: 'center',
                boxShadow: 1
            }}
        >
            <ArchiveIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'primary.main', mb: 1 }}>
                {message}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                {description}
            </Typography>
        </Box>
    );
};


/**
 * Main Application Component
 */
function App() {
    const [view, setView] = useState('catalog');
    const [items, setItems] = useState(BLANK_ITEM_LIST); 
    const theme = useTheme();
    
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    // Placeholder for API interaction
    useEffect(() => {
        // Application starts with an empty list as required
        setItems(BLANK_ITEM_LIST); 
        // We would later add logic here to fetch real data:
        // fetch('/api/v1/items').then(res => res.json()).then(setItems);
    }, [view]); // Rerun effect when view changes to simulate filtering

    const renderContent = () => {
        // For MVP, we always show the empty state until data is added
        return <EmptyState view={view} />;
    };

    const navItems = [
        { name: 'Catalog', icon: <CheckroomIcon />, view: 'catalog' },
        { name: 'Laundry', icon: <LocalLaundryServiceIcon />, view: 'laundry' },
        { name: 'Damaged', icon: <WarningIcon />, view: 'damaged' },
        { name: 'History', icon: <EventIcon />, view: 'history' },
    ];

    // Navigation Rail for Desktop/Tablet
    const NavigationRail = () => (
        <Box 
            width={72} 
            sx={{ 
                height: '100vh', 
                bgcolor: 'background.default', 
                p: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: 2,
                borderRight: 1,
                borderColor: 'divider'
            }}
        >
            <Typography variant="titleLarge" sx={{ mt: 2, mb: 4, color: 'primary.main' }}>
                LW
            </Typography>
            {navItems.map((item) => {
                const isActive = view === item.view;
                return (
                    <Button
                        key={item.name}
                        onClick={() => setView(item.view)}
                        variant={isActive ? 'contained' : 'text'}
                        // Use a custom sx color for the icon/text when not active (M3 on-surface color)
                        color={isActive ? 'primary' : 'inherit'} // Inherit allows the text color to be set by the surrounding Box/Typography
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            mb: 2, 
                            width: 60,
                            height: 60,
                            borderRadius: '16px',
                            textTransform: 'none',
                            // Custom style to ensure the icon color is primary/contained when active, 
                            // and secondary/on-surface when inactive.
                            '& .MuiSvgIcon-root': {
                                color: isActive ? 'inherit' : 'secondary.main', // Set icon color to secondary.main when inactive
                            }
                        }}
                    >
                        {item.icon}
                        <Typography variant="caption" 
                             sx={{ 
                                 // Override the text color to ensure inactive text is darker/secondary
                                 color: isActive ? 'inherit' : 'text.secondary' 
                             }}>
                            {item.name}
                        </Typography>
                    </Button>
                );
            })}
            
            {/* Add New Item FAB (High Emphasis Action) */}
            <Fab 
                color="secondary" 
                aria-label="add" 
                sx={{ mt: 'auto', mb: 2 }}
                onClick={() => console.log('Open Add Item Modal')}
            >
                <AddIcon />
            </Fab>
        </Box>
    );

    const currentPageTitle = navItems.find(n => n.view === view)?.name || 'Wardrobe Tracker';

    return (
        <ThemeProvider theme={M3Theme}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                
                {/* Navigation Rail (Desktop/Tablet) */}
                {!isMobile && <NavigationRail />}
                
                {/* Main Content Area */}
                <Container maxWidth="lg" sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="displayMedium" component="h1" sx={{ color: 'primary.main' }}>
                            {currentPageTitle}
                        </Typography>
                        
                        {/* FAB for Mobile */}
                        {isMobile && (
                            <Fab 
                                color="secondary" 
                                aria-label="add" 
                                size="small"
                                sx={{ mt: 1 }}
                                onClick={() => console.log('Open Add Item Modal')}
                            >
                                <AddIcon />
                            </Fab>
                        )}
                    </Box>

                    {renderContent()}
                    
                    {/* Bottom Navigation on Mobile (Adaptive Design) */}
                    {isMobile && (
                        <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0, bgcolor: 'background.default', boxShadow: 3, p: 1, borderTop: 1, borderColor: 'divider', zIndex: 10 }}>
                            <Grid container justifyContent="space-around">
                                {navItems.map(item => (
                                    <Button 
                                        key={item.name} 
                                        onClick={() => setView(item.view)} 
                                        color={view === item.view ? 'primary' : 'secondary'} 
                                        sx={{ 
                                            textTransform: 'none', 
                                            borderRadius: '16px', 
                                            py: 1,
                                            minWidth: '20%',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}
                                    >
                                        {item.icon}
                                        <Typography variant="caption">{item.name}</Typography>
                                    </Button>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;