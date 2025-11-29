import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress, Chip, Divider } from '@mui/material';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';

const processHistory = (history) => {
    if (!history || history.length === 0) return [];
    
    // Sort newest first (descending date) for typical vertical list view
    history.sort((a, b) => new Date(b.washDate) - new Date(a.washDate));
    
    return history.map(event => {
        const date = new Date(event.washDate);
        return { 
            id: event.id || Math.random(),
            day: date.toLocaleString('en-us', { weekday: 'long' }),
            fullDate: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            monthYear: date.toLocaleString('en-us', { month: 'short', year: 'numeric' }),
        };
    });
};

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

    const processedData = useMemo(() => processHistory(history || []), [history]);
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ p: 2 }}>Error loading history: {error}</Typography>;
    
    if (processedData.length === 0) {
        return <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No wash history recorded yet for this item.</Typography>;
    }

    // --- Component Rendering ---
    let lastMonthYear = ''; // Tracker for Month/Year grouping

    return (
        <Box sx={{ p: 2, maxWidth: 500, margin: '0 auto' }}>
            
            {processedData.map((event, index) => {
                const showMonthHeader = event.monthYear !== lastMonthYear;
                lastMonthYear = event.monthYear; // Update tracker
                
                return (
                    <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                        
                        {/* Month Header (Divider and Chip) */}
                        {showMonthHeader && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 4 }}>
                                <Divider sx={{ flexGrow: 1, borderColor: 'divider' }} />
                                <Chip 
                                    label={event.monthYear}
                                    sx={{ 
                                        mx: 1, 
                                        bgcolor: 'primary.container', 
                                        color: 'primary.main', 
                                        fontWeight: 'bold',
                                        fontSize: '0.8rem',
                                    }}
                                />
                                <Divider sx={{ flexGrow: 1, borderColor: 'divider' }} />
                            </Box>
                        )}

                        {/* Timeline Event Row */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            
                            {/* Marker Column */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 0.5 }}>
                                {/* Wash Circle */}
                                <Box sx={{
                                    width: 24, height: 24,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: 1,
                                    zIndex: 2,
                                    p: 0.5,
                                }}>
                                    <LocalLaundryServiceIcon sx={{ fontSize: 14 }} />
                                </Box>
                                {/* Vertical Connector Line */}
                                {index < processedData.length - 1 && (
                                    <Box sx={{ width: '2px', height: '100%', bgcolor: 'divider', flexGrow: 1, mt: '-1px' }} />
                                )}
                            </Box>

                            {/* Content Column */}
                            <Box sx={{ pb: 0 }}>
                                <Typography variant="body1" fontWeight="500">
                                    {event.day}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {event.fullDate} at {event.time}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};