import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button, useTheme} from '@mui/material';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 

// This component displays a visual summary of a single wash job batch.
export const WashJobCard = ({ itemsInJob, jobDetails, onMarkCollected }) => {

    // itemsInJob might be null/undefined, so ensure it's an array
    const jobItems = itemsInJob || [];
    const theme = useTheme();
    // Calculate the completion time status
    const completionDate = new Date(jobDetails.completionTime);
    const now = new Date();
    const isCompleted = completionDate <= now;
    const jobPreviewImageUrl = jobItems.length > 0 ? jobItems[0].imageUrl : '';
    // Status Display
    let statusLabel = isCompleted ? 'WASHED' : 'WASHING';
    let statusColor = isCompleted ? 'success' : 'info';
    let messageLine = isCompleted ? 'Ready to collect' : `To be collected on ${completionDate.toLocaleDateString()}`;

    // If the job is COMPLETED but hasn't been cleared from the system, 
    // the backend will handle marking items CLEAN when the user views the tab.
        const cardStyles = (theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            padding: 2.5,
            borderRadius: 999,
            backgroundColor:
                theme.palette.mode === 'dark'
                ? '#14171C'
                : theme.palette.grey[900],
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.45)',
            });
    
    return (
        <Box sx={cardStyles}>
            
            {/* 1. Item Image (Ghosted Look) */}
                <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '2px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                    backgroundColor:
                    theme.palette.mode === 'dark'
                        ? '#111111'
                        : theme.palette.grey[200],
                }}
                >
                {/* The "Ghosted" Image Effect (Simulated overlapping item summary) */}
                {[...Array(3)].map((_, i) => (
                    <Box
                    key={i}
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: i * 10,
                        top: i * 10,
                        opacity: 0.5 - i * 0.15,
                        transform: `scale(${1 + i * 0.1})`,
                        backgroundImage: `url(${jobPreviewImageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '50%',
                    }}
                    />
                ))}
                </Box>

            {/* 2. Job Details */}
            <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: '#FFFFFF', mb: 0.5 }}
            >
                Wash Job {completionDate.toLocaleDateString()}
            </Typography>
            <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.25 }}
            >
                {jobItems.length} items in the queue
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {messageLine}
            </Typography>
            </Box>

            {/* 3. Status Chip and Action */}
            <Box sx={{ textAlign: 'right', minWidth: 130 }}>
            <Chip
                label={statusLabel}
                color={statusColor}
                sx={{
                mb: 1,
                fontWeight: 'bold',
                borderRadius: 999,
                px: 2.5,
                py: 0.5,
                fontSize: 12,
                letterSpacing: 0.5,
                }}
            />
            {isCompleted && (
                <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => onMarkCollected(jobDetails.id)}
                startIcon={<CalendarTodayIcon />}
                sx={{
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                }}
                >
                Collect
                </Button>
            )}
            </Box>
        </Box>
    );
};