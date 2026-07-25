import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme, CircularProgress, Paper, Grow, Collapse, Grid, Avatar } from '@mui/material';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import { keyframes } from '@mui/system';

const vibrate = keyframes`
  0% { transform: translate(0) }
  20% { transform: translate(-1px, 1px) }
  40% { transform: translate(-1px, -1px) }
  60% { transform: translate(1px, 1px) }
  80% { transform: translate(1px, -1px) }
  100% { transform: translate(0) }
`;

export const WashJobCard = ({ itemsInJob, jobDetails, onMarkCollected }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);
    
    const jobItems = itemsInJob || [];
    const validItems = jobItems.filter(item => item && item.id);
    
    // Carousel effect: change image every 0.5 seconds
    useEffect(() => {
        if (validItems.length <= 1) return;
        const interval = setInterval(() => {
            setCarouselIndex(prev => (prev + 1) % validItems.length);
        }, 500);
        return () => clearInterval(interval);
    }, [validItems.length]);

    // Calculate the completion time status
    const startTime = new Date(jobDetails.createdAt || jobDetails.startTime || jobDetails.completionTime);
    const completionDate = new Date(jobDetails.completionTime);
    const now = new Date();
    
    const isCompleted = completionDate <= now || jobDetails.status === 'COMPLETED';
    
    // Calculate progress percentage
    const totalDuration = completionDate.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    const progress = isCompleted ? 100 : Math.min(Math.max((elapsed / totalDuration) * 100, 5), 95);

    let messageLine = isCompleted ? 'Ready' : `${completionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <Paper 
            elevation={0}
            onClick={() => setExpanded(!expanded)}
            sx={{
                mb: 0,
                borderRadius: 4, 
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: isCompleted ? 'success.main' : 'divider',
                overflow: 'hidden',
                cursor: 'pointer',
                animation: !isCompleted ? `${vibrate} 1s infinite linear` : 'none',
                transition: theme.transitions.create(['transform', 'box-shadow', 'border-color']),
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6],
                    borderColor: 'primary.main',
                },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}
        >
            {/* Top Control Panel */}
            <Box sx={{ 
                bgcolor: 'surfaceVariant.main', 
                p: 1.5, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '2px solid',
                borderColor: 'background.default'
            }}>
                <Box sx={{ 
                    bgcolor: 'background.paper', 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    fontFamily: 'monospace',
                    color: isCompleted ? 'success.main' : 'text.primary',
                    fontWeight: 'bold',
                    letterSpacing: 1
                }}>
                    {messageLine}
                </Box>
                <Box sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    boxShadow: 2
                }}>
                    {validItems.length}
                </Box>
            </Box>

            {/* Machine Body & Door */}
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Box sx={{ position: 'relative', width: 140, height: 140, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* The Progress Ring (Dotted border replaced by actual progress) */}
                    <CircularProgress 
                        variant="determinate" 
                        value={100} 
                        size={140} 
                        thickness={2} 
                        sx={{ color: 'divider', position: 'absolute' }} 
                    />
                    <CircularProgress 
                        variant="determinate" 
                        value={progress} 
                        size={140} 
                        thickness={4} 
                        sx={{ 
                            color: isCompleted ? 'success.main' : 'primary.main', 
                            position: 'absolute',
                            strokeLinecap: 'round',
                            transition: 'color 0.5s'
                        }} 
                    />
                    
                    {/* The Glass Door */}
                    <Box sx={{
                        width: 110,
                        height: 110,
                        borderRadius: '50%',
                        bgcolor: 'background.default',
                        border: '4px solid',
                        borderColor: 'divider',
                        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {validItems.length > 0 ? (
                            validItems[carouselIndex]?.imageUrl ? (
                                <Box
                                    component="img"
                                    src={validItems[carouselIndex].imageUrl}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: isCompleted ? 1 : 0.8,
                                        transition: 'opacity 0.2s'
                                    }}
                                />
                            ) : (
                                <CheckroomIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                            )
                        ) : (
                            <Typography variant="caption" color="text.secondary">Empty</Typography>
                        )}
                        {/* Reflection overlay for glass effect */}
                        <Box sx={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
                            borderRadius: '50%',
                            pointerEvents: 'none'
                        }} />
                    </Box>
                </Box>
            </Box>

            {/* Collect Button */}
            {isCompleted && (
                <Grow in={true}>
                    <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            startIcon={<CalendarTodayIcon />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onMarkCollected(jobDetails.id);
                            }}
                            sx={{ borderRadius: 3, fontWeight: 'bold' }}
                        >
                            Collect
                        </Button>
                    </Box>
                </Grow>
            )}

            {/* Expandable Items List */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box sx={{ 
                    p: 2, 
                    borderTop: '1px solid', 
                    borderColor: 'divider',
                    bgcolor: 'background.default'
                }}>
                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold', color: 'text.secondary' }}>
                        Clothes Inside
                    </Typography>
                    <Grid container spacing={1.5}>
                        {validItems.map(item => (
                            <Grid item xs={6} key={item.id}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 1.5, 
                                    bgcolor: 'background.paper', 
                                    p: 1, 
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}>
                                    <Avatar 
                                        variant="rounded" 
                                        src={item.imageUrl} 
                                        sx={{ width: 40, height: 40, bgcolor: 'surfaceVariant.main' }}
                                    >
                                        {!item.imageUrl && <CheckroomIcon fontSize="small" />}
                                    </Avatar>
                                    <Typography variant="caption" noWrap sx={{ fontWeight: 500, flexGrow: 1 }}>
                                        {item.name || 'Unnamed Item'}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Collapse>
        </Paper>
    );
};