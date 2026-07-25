import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, useTheme, CircularProgress, Paper, Grow, Collapse, Grid, Avatar } from '@mui/material';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import { keyframes } from '@mui/system';

const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export const WashJobCard = ({ itemsInJob, jobDetails, onMarkCollected }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState(false);
    // Live-ticking clock so the progress ring updates every second
    const [now, setNow] = useState(() => new Date());
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const jobItems = itemsInJob || [];
    const validItems = jobItems.filter(item => item && item.id);
    
    // Create a duplicated array for seamless infinite looping
    const marqueeItems = [...validItems, ...validItems];

    // Calculate the completion time status
    const completionDate = jobDetails.completionTime ? new Date(jobDetails.completionTime) : new Date();

    // Derive start time: prefer explicit DB fields, then back-calculate from durationHours
    let startTime;
    if (jobDetails.createdAt) {
        startTime = new Date(jobDetails.createdAt);
    } else if (jobDetails.startTime) {
        startTime = new Date(jobDetails.startTime);
    } else if (jobDetails.durationHours) {
        startTime = new Date(completionDate.getTime() - jobDetails.durationHours * 3600000);
    } else {
        startTime = new Date(completionDate.getTime() - 3600000); // fallback: assume 1h
    }

    const isCompleted = completionDate <= now || jobDetails.status === 'COMPLETED';
    
    // Calculate progress percentage, avoiding NaN
    let progress = 0;
    if (isCompleted) {
        progress = 100;
    } else {
        const totalDuration = completionDate.getTime() - startTime.getTime();
        const elapsed = now.getTime() - startTime.getTime();
        if (totalDuration > 0) {
            progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
        }
    }

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
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Box sx={{ position: 'relative', width: 220, height: 220, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* The Progress Ring (Dotted border replaced by actual progress) */}
                    <CircularProgress 
                        variant="determinate" 
                        value={100} 
                        size={220} 
                        thickness={2} 
                        sx={{ color: 'divider', position: 'absolute' }} 
                    />
                    <CircularProgress 
                        variant="determinate" 
                        value={progress} 
                        size={220} 
                        thickness={4} 
                        sx={{ 
                            color: isCompleted ? 'success.main' : 'primary.main', 
                            position: 'absolute',
                            transition: 'color 0.5s',
                            '& circle': { strokeLinecap: 'round' }
                        }} 
                    />
                    
                    {/* The Glass Door */}
                    <Box sx={{
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        bgcolor: 'background.default',
                        border: '4px solid',
                        borderColor: 'divider',
                        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)',
                        display: 'flex',
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {validItems.length > 0 ? (
                            <Box sx={{
                                display: 'flex',
                                width: 'max-content',
                                height: '100%',
                                animation: `${marquee} ${validItems.length * 1.5}s linear infinite`,
                                '&:hover': {
                                    animationPlayState: 'paused'
                                }
                            }}>
                                {marqueeItems.map((item, idx) => (
                                    <Box key={`${item.id}-${idx}`} sx={{ 
                                        width: '180px', 
                                        height: '180px', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        flexShrink: 0
                                    }}>
                                        {item.imageUrl ? (
                                            <Box
                                                component="img"
                                                src={item.imageUrl}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    opacity: isCompleted ? 1 : 0.8,
                                                }}
                                            />
                                        ) : (
                                            <CheckroomIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">Empty</Typography>
                            </Box>
                        )}
                        {/* Progress text overlay inside the door if running */}
                        {!isCompleted && (
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    position: 'absolute', bottom: 4, width: '100%', textAlign: 'center', 
                                    fontWeight: 'bold', color: 'primary.main', bgcolor: 'rgba(255,255,255,0.7)',
                                    pointerEvents: 'none'
                                }}
                            >
                                {Math.round(progress)}%
                            </Typography>
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