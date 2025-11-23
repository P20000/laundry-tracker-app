import React, { useState, useEffect } from 'react';
import { 
    ThemeProvider, 
    createTheme, 
    CssBaseline, 
    Container, 
    Typography, 
    Box, 
    Card, 
    CardContent, 
    CircularProgress 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// --- Material Design 3 Theming ---
// Using a basic M3 color pallet based on 'Primary' blue
const M3Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4', // Primary M3 color
    },
    background: {
        default: '#FFFBFE', // Surface background
        paper: '#E6E0E9',   // Card/Paper background
    }
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    h4: {
        fontWeight: 600,
        marginBottom: 16
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16, // M3 standard large shape
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

// The API URL is injected by Railway's environment variable VITE_API_URL
// In development, this will be undefined, so we use a local fallback.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Check API Health
    fetch(`${API_BASE_URL}/health`)
      .then(res => res.json())
      .then(healthData => {
        if (healthData.status === 'ok') {
            console.log("API Health Check OK. Fetching items...");
            // 2. If healthy, fetch the item list
            return fetch(`${API_BASE_URL}/api/v1/items`);
        } else {
            throw new Error(`API Health Error: ${healthData.details || healthData.database}`);
        }
      })
      .then(res => res.json())
      .then(itemData => {
        setData(itemData);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Card sx={{ mt: 3, p: 3, borderColor: 'error.main', border: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
                <ErrorIcon color="error" />
                <Typography variant="h6" color="error.main">Deployment Error</Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Could not connect to the backend API or database.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                URL Attempted: {API_BASE_URL}/health
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Details: {error}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    // Display MVP success content
    return (
        <Card sx={{ mt: 3, p: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={1} color="primary.main">
                    <CheckCircleIcon />
                    <Typography variant="h6">Application Deployed Successfully</Typography>
                </Box>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    The React Frontend is running and connected to the Node.js API.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                    API returned **{data ? data.length : 0}** clothing items from the PostgreSQL database.
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                    Your full stack is online! Now let's build the interactive inventory UI.
                </Typography>
            </CardContent>
        </Card>
    );
  };

  return (
    <ThemeProvider theme={M3Theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4" color="primary">
            Smart Wardrobe Tracker
        </Typography>
        {renderContent()}
      </Container>
    </ThemeProvider>
  );
}

export default App;