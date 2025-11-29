import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, CircularProgress, Chip, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const processHistory = (history) => {
    if (!history || history.length === 0) return [];
    
    // Sort oldest first (ascending date)
    history.sort((a, b) => new Date(a.washDate) - new Date(b.washDate));
    
    // Convert to simple date objects
    return history.map(event => {
        const date = new Date(event.washDate);
        return { 
            id: event.id || Math.random(), // Use unique ID
            date: date.getDate(),
            month: date.toLocaleString('en-us', { month: 'short' }),
            year: date.getFullYear(),
            day: date.toLocaleString('en-us', { weekday: 'short' }),
            fullDate: date.toLocaleDateString(),
            timestamp: date.getTime(),
        };
    });
};

export const WashHistoryTimeline = ({ itemId, apiUrl, token }) => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    
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

    // Processed data, sorted oldest first
    const processedData = useMemo(() => processHistory(history || []), [history]);

    // Calculate unique months for display
    const uniqueMonths = useMemo(() => {
        const months = new Set();
        return processedData.filter(event => {
            const monthYear = `${event.month} ${event.year}`;
            if (months.has(monthYear)) return false;
            months.add(monthYear);
            return true;
        });
    }, [processedData]);

    // --- SCROLL HANDLERS ---
    const scrollAmount = 300; // Pixels to scroll per click
    const handleScroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" sx={{ p: 2 }}>Error loading history: {error}</Typography>;
    
    if (processedData.length === 0) {
        return <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No wash history recorded yet.</Typography>;
    }

    // --- Component Rendering ---
    
    // Calculate total duration in days (for proportional spacing)
    const firstDate = processedData[0].timestamp;
    const lastDate = processedData[processedData.length - 1].timestamp;
    const totalDurationMs = lastDate - firstDate;
    
    // Scale the entire timeline to a minimum width (e.g., 2000px) if dates are close
    const MIN_WIDTH = 2000;
    const DURATION_SCALE_FACTOR = totalDurationMs > 0 ? MIN_WIDTH / totalDurationMs : 0;
    const timelineWidth = Math.max(MIN_WIDTH, processedData.length * 100);


    return (
        <Box sx={{ 
            p: 2, 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center', 
            height: 200, // Fixed height for timeline visualization
            maxWidth: '100%',
        }}>
            {/* Left Scroll Button */}
            <IconButton onClick={() => handleScroll('left')} sx={{ zIndex: 10, bgcolor: 'background.paper', boxShadow: 3 }}>
                <ChevronLeftIcon />
            </IconButton>

            {/* Scrollable Timeline Container */}
            <Box ref={scrollRef} sx={{ 
                flexGrow: 1, 
                overflowX: 'hidden', 
                mx: 1,
                scrollSnapType: 'x mandatory',
                position: 'relative',
                height: '100%',
            }}>
                
                {/* Timeline Visualization */}
                <Box sx={{ 
                    width: timelineWidth, // Dynamic calculated width
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: 80,
                }}>
                    
                    {/* The Main Horizontal Line */}
                    <Box sx={{ 
                        height: '2px', 
                        width: '100%', 
                        bgcolor: 'primary.main', 
                        position: 'absolute', 
                        top: '50%', 
                        transform: 'translateY(-50%)' 
                    }} />

                    {/* Wash Events (Circles) */}
                    {processedData.map((event, index) => {
                        // Calculate position based on proportional time passed since first wash
                        const timeSinceStartMs = event.timestamp - firstDate;
                        let positionX;
                        
                        if (totalDurationMs > 0) {
                            // Proportional position based on time
                            positionX = (timeSinceStartMs / totalDurationMs) * MIN_WIDTH; 
                        } else {
                            // If only one event, center it
                            positionX = MIN_WIDTH / 2;
                        }
                        
                        // Fallback adjustment for scaling the container width
                        positionX = Math.min(positionX, timelineWidth - 50); // Ensure it doesn't overflow

                        // Determine if this is the start of a new month (for the Chip)
                        const isNewMonth = index === 0 || event.month !== processedData[index - 1].month;

                        return (
                            <Box key={event.id} sx={{ 
                                position: 'absolute',
                                left: positionX,
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}>
                                {/* Month Header Chip (Only show for the first event of the month) */}
                                {isNewMonth && (
                                    <Chip 
                                        label={`${event.month} ${event.year}`}
                                        sx={{ 
                                            position: 'absolute',
                                            top: -50,
                                            bgcolor: 'secondary.container', 
                                            color: 'onSecondary.container', 
                                            fontWeight: 'bold',
                                        }}
                                    />
                                )}
                                
                                {/* The Wash Circle */}
                                <Box sx={{
                                    width: 30, height: 30,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: 3,
                                    mb: 1,
                                    border: '4px solid white' // Adds a clean halo
                                }}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {event.date}
                                    </Typography>
                                </Box>
                                
                                {/* Day Label */}
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {event.day}
                                </Typography>
                            </Box>
                        );
                    })}
                    
                </Box>
            </Box>

            {/* Right Scroll Button */}
            <IconButton onClick={() => handleScroll('right')} sx={{ zIndex: 10, bgcolor: 'background.paper', boxShadow: 3 }}>
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
};