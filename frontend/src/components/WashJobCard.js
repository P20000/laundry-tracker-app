import React from 'react';
import { Box, Typography, Chip, Button, useTheme } from '@mui/material';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 

// This component displays a visual summary of a single wash job batch.
export const WashJobCard = ({ itemsInJob, jobDetails, onMarkCollected }) => {
    const theme = useTheme();

    // Calculate the completion time status
    const completionDate = new Date(jobDetails.completionTime);
    const jobStartTime = new Date(jobDetails.startTime);
    const now = new Date();
    const isCompleted = completionDate <= now;
    
    // Status Display
    let statusLabel = isCompleted ? 'WASHED' : 'WASHING';
    let statusColor = isCompleted ? 'success' : 'info';
    let messageLine = isCompleted ? 'Ready to collect' : `To be collected on ${completionDate.toLocaleDateString()}`;

    // --- M3 Styles for the card ---
    const cardStyles = { 
        p: 3, 
        mb: 3, 
        borderRadius: 4, 
        bgcolor: 'background.paper', 
        boxShadow: 3,
        display: 'flex', 
        alignItems: 'center',
        gap: 3,
        // Make the card edges soft pill shape 
        borderRadius: theme.spacing(4), 
        border: '1px solid',
        borderColor: statusColor + '.main' + '30', // Faint border based on status
    };

    return (
        <Box sx={cardStyles}>
            
            {/* 1. Item Image (Ghosted Look) */}
            <Box sx={{ 
                width: 100, 
                height: 100, 
                borderRadius: '50%', // Full capsule shape for the image area
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                // Placeholder background (using surface variant for depth)
                bgcolor: theme.palette.mode === 'dark' ? 'surfaceVariant.main' : 'grey.100', 
            }}>
                {/* The "Ghosted" Image Effect (Simulated overlapping item summary) */}
                {[...Array(3)].map((_, i) => (
                    <Box key={i} sx={{ 
                        position: 'absolute', 
                        width: '100%', 
                        height: '100%', 
                        left: i * -5, 
                        top: i * -5, 
                        opacity: 1 - (i * 0.3), // Fades out the background layers
                        color: theme.palette.primary.main,
                        transform: `scale(${1 - (i * 0.1)})`
                    }}>
                        {/* We use CheckroomIcon as the visual representation */}
                        <CheckroomIcon sx={{ fontSize: 70, opacity: 0.8 }} />
                    </Box>
                ))}
            </Box>

            {/* 2. Job Details */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    Wash Job {jobStartTime.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {itemsInJob.length} items in the queue
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {messageLine}
                </Typography>
            </Box>

            {/* 3. Status Chip and Action Button */}
            <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip 
                    label={statusLabel} 
                    color={statusColor} 
                    sx={{ fontWeight: 'bold' }} 
                />
                {isCompleted && (
                    <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        onClick={() => onMarkCollected(jobDetails.id)}
                        startIcon={<CalendarTodayIcon />}
                        sx={{ mt: 1, borderRadius: 20 }}
                    >
                        Collect
                    </Button>
                )}
            </Box>
        </Box>
    );
};