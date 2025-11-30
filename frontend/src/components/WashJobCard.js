import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; 

// This component displays a visual summary of a single wash job batch.
export const WashJobCard = ({ itemsInJob, jobDetails, onMarkCollected }) => {
    
    // Calculate the completion time status
    const completionDate = new Date(jobDetails.completionTime);
    const now = new Date();
    const isCompleted = completionDate <= now;
    
    // Status Display
    let statusLabel = isCompleted ? 'WASHED' : 'WASHING';
    let statusColor = isCompleted ? 'success' : 'info';
    let messageLine = isCompleted ? 'Ready to collect' : `To be collected on ${completionDate.toLocaleDateString()}`;

    // If the job is COMPLETED but hasn't been cleared from the system, 
    // the backend will handle marking items CLEAN when the user views the tab.
    
    return (
        <Box sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 4, 
            bgcolor: 'background.paper', 
            boxShadow: 3,
            display: 'flex', 
            alignItems: 'center',
            gap: 3,
            border: '1px solid',
            borderColor: statusColor + '.main'
        }}>
            
            {/* 1. Item Image (Simplified Ghosted Look) */}
            <Box sx={{ 
                width: 100, 
                height: 100, 
                borderRadius: 4, 
                bgcolor: 'surfaceVariant.main',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                {/* The "Ghosted" Image Effect (Simulated overlapping cards) */}
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', left: -5, top: -5, opacity: 0.3 }}><CheckroomIcon sx={{ fontSize: 70 }} /></Box>
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, opacity: 0.6 }}><CheckroomIcon sx={{ fontSize: 70 }} /></Box>
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', left: 5, top: 5, opacity: 1, color: 'primary.main' }}><CheckroomIcon sx={{ fontSize: 70 }} /></Box>

            </Box>

            {/* 2. Job Details */}
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    Wash Job {completionDate.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {itemsInJob.length} items in the queue
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {messageLine}
                </Typography>
            </Box>

            {/* 3. Status Chip and Action */}
            <Box sx={{ textAlign: 'right' }}>
                <Chip label={statusLabel} color={statusColor} sx={{ mb: 1, fontWeight: 'bold' }} />
                {isCompleted && (
                    <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        onClick={() => onMarkCollected(jobDetails.id)}
                        startIcon={<CalendarTodayIcon />}
                    >
                        Collect
                    </Button>
                )}
            </Box>
        </Box>
    );
};