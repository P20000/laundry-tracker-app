import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, useTheme, LinearProgress, Paper } from '@mui/material';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 
import TimerIcon from '@mui/icons-material/Timer';

// This component displays a visual summary of a single wash job batch.
export const WashJobCard = ({ itemsInJob, jobDetails, onMarkCollected }) => {
    const theme = useTheme();
    const jobItems = itemsInJob || [];
    
    // Calculate the completion time status
    const startTime = new Date(jobDetails.createdAt || jobDetails.startTime || jobDetails.completionTime); // Fallback if startTime missing
    const completionDate = new Date(jobDetails.completionTime);
    const now = new Date();
    
    const isCompleted = completionDate <= now || jobDetails.status === 'COMPLETED';
    
    // Calculate progress percentage
    const totalDuration = completionDate.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    const progress = isCompleted ? 100 : Math.min(Math.max((elapsed / totalDuration) * 100, 5), 95);

    const jobPreviewImageUrl = jobItems.length > 0 ? jobItems[0].imageUrl : '';
    
    // Status Display
    let statusLabel = isCompleted ? 'WASHED' : 'WASHING';
    let statusColor = isCompleted ? 'success' : 'primary';
    let messageLine = isCompleted ? 'Ready to collect' : `Estimated completion: ${completionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
        <Paper 
            elevation={0}
            sx={{
                mb: 3,
                p: 3,
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 3,
                transition: '0.3s',
                '&:hover': {
                    boxShadow: theme.shadows[4],
                    borderColor: 'primary.main',
                }
            }}
        >
            {/* 1. Item Image Stack (Visual Representation) */}
            <Box sx={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                {jobItems.slice(0, 3).map((item, index) => (
                    <Box
                        key={item.id}
                        sx={{
                            position: 'absolute',
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            bgcolor: 'surfaceVariant.main',
                            backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '2px solid',
                            borderColor: 'background.paper',
                            left: index * 10,
                            top: index * 10,
                            zIndex: 3 - index,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 2
                        }}
                    >
                        {!item.imageUrl && <CheckroomIcon sx={{ fontSize: 30, opacity: 0.5 }} />}
                    </Box>
                ))}
            </Box>

            {/* 2. Job Info and Progress */}
            <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 200 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="titleLarge" color="text.primary" sx={{ fontWeight: 600 }}>
                        Wash Job #{jobDetails.id.slice(0, 4)}
                    </Typography>
                    <Chip 
                        label={statusLabel} 
                        color={statusColor} 
                        size="small" 
                        sx={{ fontWeight: 'bold', borderRadius: 1.5 }} 
                    />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {jobItems.length} items • Completed on {completionDate.toLocaleDateString()}
                </Typography>

                <Box sx={{ mt: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimerIcon sx={{ fontSize: 14 }} /> {messageLine}
                        </Typography>
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                            {Math.round(progress)}%
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'surfaceVariant.main',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                            }
                        }} 
                    />
                </Box>
            </Box>

            {/* 3. Action Area */}
            <Box sx={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                {isCompleted ? (
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        startIcon={<CalendarTodayIcon />}
                        onClick={() => onMarkCollected(jobDetails.id)}
                        sx={{ 
                            borderRadius: 3, 
                            py: 1.25,
                            boxShadow: theme.shadows[2],
                            '&:hover': { boxShadow: theme.shadows[4] }
                        }}
                    >
                        Collect
                    </Button>
                ) : (
                    <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        In Progress...
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};