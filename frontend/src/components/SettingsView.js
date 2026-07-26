import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Card, CardContent, Switch, FormControlLabel, Button, Divider, Alert, CircularProgress, Fade, Chip, Avatar
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import LogoutIcon from '@mui/icons-material/Logout';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';

export const SettingsView = ({ apiUrl, token, onLogout }) => {
    const [userEmail, setUserEmail] = useState('');
    const [emailNotify, setEmailNotify] = useState(true);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [sendingDigest, setSendingDigest] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('info');

    useEffect(() => {
        const fetchUserSettings = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiUrl}/user/settings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUserEmail(data.email);
                    setEmailNotify(data.emailNotificationsEnabled);
                }
            } catch (err) {
                console.error('Failed to load user settings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserSettings();
    }, [apiUrl, token]);

    const handleToggleEmail = async (event) => {
        const newValue = event.target.checked;
        setEmailNotify(newValue);
        setUpdating(true);
        setMessage('');

        try {
            const res = await fetch(`${apiUrl}/user/settings`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ emailNotificationsEnabled: newValue })
            });

            if (res.ok) {
                setSeverity('success');
                setMessage(newValue ? 'Email notifications enabled!' : 'Email notifications disabled.');
            } else {
                setEmailNotify(!newValue); // Revert on failure
                setSeverity('error');
                setMessage('Failed to update email setting.');
            }
        } catch (err) {
            setEmailNotify(!newValue);
            setSeverity('error');
            setMessage('Network error updating settings.');
        } finally {
            setUpdating(false);
        }
    };

    const handleSendTestDigest = async () => {
        setSendingDigest(true);
        setMessage('');

        try {
            const res = await fetch(`${apiUrl}/user/send-wash-digest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                setSeverity('success');
                setMessage(data.message || `Smart Wash Digest sent to ${userEmail}!`);
            } else {
                setSeverity('warning');
                setMessage(data.error || 'Could not send digest email.');
            }
        } catch (err) {
            setSeverity('error');
            setMessage('Network error sending digest email.');
        } finally {
            setSendingDigest(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Fade in timeout={400}>
            <Box sx={{ maxWidth: 640, mx: 'auto', p: { xs: 1, sm: 2 } }}>
                
                {/* ── HEADER ── */}
                <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                        <SettingsIcon />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>Settings & Preferences</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage your account notifications, email preferences, and security
                        </Typography>
                    </Box>
                </Box>

                {/* ── NOTIFICATION BANNERS ── */}
                {message && (
                    <Alert severity={severity} onClose={() => setMessage('')} sx={{ mb: 3, borderRadius: 3 }}>
                        {message}
                    </Alert>
                )}

                {/* ── CARD 1: ACCOUNT PROFILE ── */}
                <Card sx={{ mb: 3, borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <PersonIcon color="primary" />
                            <Typography variant="h6" fontWeight={600} fontSize="1.1rem">
                                Account Profile
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Email Address</Typography>
                                <Typography variant="body1" fontWeight={600}>{userEmail || 'User Account'}</Typography>
                            </Box>
                            <Chip label="Verified Account" color="success" size="small" variant="outlined" icon={<SecurityIcon />} />
                        </Box>
                    </CardContent>
                </Card>

                {/* ── CARD 2: EMAIL NOTIFICATIONS & SMART DIGEST ── */}
                <Card sx={{ mb: 3, borderRadius: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <EmailIcon color="primary" />
                            <Typography variant="h6" fontWeight={600} fontSize="1.1rem">
                                Email Notifications & Reminders
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Box sx={{ pr: 2 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Wash Reminder Emails
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                                    Receive automated emails with cloth images and 1-click batch wash links when clothes are due.
                                </Typography>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={emailNotify}
                                        onChange={handleToggleEmail}
                                        disabled={updating}
                                        color="primary"
                                    />
                                }
                                label=""
                            />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
                            <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                                Test how the visual email digest looks in your inbox:
                            </Typography>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleSendTestDigest}
                                disabled={sendingDigest || !emailNotify}
                                startIcon={sendingDigest ? <CircularProgress size={16} color="inherit" /> : <MarkEmailReadIcon />}
                                sx={{ borderRadius: 4, textTransform: 'none', px: 2 }}
                            >
                                {sendingDigest ? 'Sending Email...' : 'Send Test Smart Digest'}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* ── CARD 3: LOGOUT & ACCOUNT ACTION ── */}
                <Card sx={{ borderRadius: 4, borderColor: 'error.light', borderStyle: 'solid', borderWidth: 1 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                            <Box>
                                <Typography variant="h6" color="error.main" fontWeight={600} fontSize="1.05rem">
                                    Sign Out
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontSize="0.85rem">
                                    Sign out of your Smart Laundry Tracker session on this device.
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={onLogout}
                                startIcon={<LogoutIcon />}
                                sx={{ borderRadius: 5, px: 3, py: 1 }}
                            >
                                Log Out
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

            </Box>
        </Fade>
    );
};
