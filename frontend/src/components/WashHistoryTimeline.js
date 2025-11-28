import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';

const processHistory = (history) => {
    if (!history || history.length === 0) return [];
    
    const timeline = {};
    // Sort oldest first for correct month order
    history.sort((a, b) => new Date(a.washDate) - new Date(b.washDate));

    history.forEach(event => {
        // NOTE: washDate is returned as a string from Turso
        const date = new Date(event.washDate);
        const yearMonth = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0');
        
        if (!timeline[yearMonth]) {
            timeline[yearMonth] = [];
        }
        timeline[yearMonth].push(date);
    });

    return Object.entries(timeline).map(([key, dates]) => ({
        month: key,
        dates: dates.map(d => ({ 
            date: d.getDate(),
            fullDate: d.toLocaleDateString(),
            day: d.toLocaleString('en-us', { weekday: 'short' }),
        })).sort((a, b) => a.date - b.date)
    }));
};

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const WashHistoryTimeline = ({ itemId, apiUrl, token }) => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const AUTH_HEADERS = { 'Authorization': `Bearer ${token}` };

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                // Ensure API URL path is correct
                const res = await fetch(`${apiUrl}/items/${itemId}/history`, { headers: AUTH_HEADERS }); 
                if (res.status === 401) throw new Error("Unauthorized");
                if (!res.ok) throw new Error("Failed to fetch history data.");
                
                const data = await res.json();
                setHistory(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        if (itemId) fetchHistory();
    }, [itemId, apiUrl, token]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ p: 2 }}>Error loading history: {error}</Typography>;
    
    if (!history || history.length === 0) {
        return <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No wash history recorded yet.</Typography>;
    }

    const processedData = processHistory(history);
    
    return (
        <Box sx={{ p: 2, overflowX: 'auto', whiteSpace: 'nowrap', pb: 3 }}>
            
            {processedData.map(monthData => (
                <Box key={monthData.month} sx={{ display: 'inline-block', minWidth: 150, mr: 4 }}>
                    
                    {/* Month Header (M3 Chip Style) */}
                    <Chip 
                        label={`${monthNames[parseInt(monthData.month.split('-')[1]) - 1]} ${monthData.month.split('-')[0]}`}
                        sx={{ mb: 2, bgcolor: 'primary.container', color: 'primary.main', fontWeight: 'bold' }}
                    />
                    
                    {/* Vertical Timeline Line */}
                    <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', minHeight: 150, ml: 3 }}>
                        
                        {monthData.dates.map(event => (
                            <Box key={event.date} sx={{ position: 'relative', ml: -3, py: 1 }}>
                                {/* Blue Circle (The Wash Event Marker) */}
                                <Box sx={{ 
                                    width: 40, height: 40, 
                                    borderRadius: '50%', 
                                    bgcolor: 'primary.main', 
                                    color: 'white', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'absolute', left: -20, top: 0,
                                    zIndex: 1, boxShadow: 2
                                }}>
                                    <Typography variant="caption" fontWeight="bold">
                                        {event.date}
                                    </Typography>
                                </Box>
                                
                                {/* Event Detail (Date/Day) */}
                                <Box sx={{ ml: 4, pt: 0.5 }}>
                                    <Typography variant="body2">{event.fullDate}</Typography>
                                    <Typography variant="caption" color="text.secondary">{event.day} Wash</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};