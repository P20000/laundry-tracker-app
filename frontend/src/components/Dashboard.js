import React, { useEffect, useState } from 'react';
import { 
    Box, Grid, Paper, Typography, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, Card, CardContent 
} from '@mui/material';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, Users, Shirt, AlertCircle, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography color="text.secondary" variant="subtitle2" fontWeight="bold">
                    {title}
                </Typography>
                <Box p={1} borderRadius={2} bgcolor={`${color}15`} color={color}>
                    {icon}
                </Box>
            </Box>
            <Typography variant="h4" fontWeight="bold">
                {value}
            </Typography>
        </CardContent>
    </Card>
);

export const Dashboard = ({ apiUrl, token }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${apiUrl}/admin/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setStats(data);
            } catch (e) {
                console.error("Dashboard fetch failed", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [apiUrl, token]);

    if (loading) return <Box p={4}>Loading Analytics...</Box>;
    if (!stats) return <Box p={4}>Failed to load dashboard.</Box>;

    // Prepare chart data
    const chartData = [
        { name: 'Users', count: stats.users },
        { name: 'Items', count: stats.items },
        { name: 'Washes', count: stats.washes },
    ];

    return (
        <Box p={3}>
            <Typography variant="h4" mb={4} fontWeight="bold">System Status</Typography>
            
            {/* Stats Grid */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={4}>
                    <StatCard title="Total Users" value={stats.users} icon={<Users size={24} />} color="#6750A4" />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard title="Total Items" value={stats.items} icon={<Shirt size={24} />} color="#006A60" />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard title="System Uptime" value={`${Math.floor(stats.uptime / 60)}m`} icon={<Activity size={24} />} color="#B3261E" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Chart Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" mb={3}>Data Overview (Items/Users)</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={chartData}> 
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#6750A4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* ADDED: New Wash Volume by Category Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" mb={3}>Wash Volume by Category</Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={stats.washVolumeByCategory}> {/* Uses the new data */}
                                <CartesianGrid strokeDasharray="3 3" />
                                {/* Chart uses category name on X-axis and count on Y-axis */}
                                <XAxis dataKey="name" /> 
                                <YAxis />
                                <Tooltip />
                                {/* Use a secondary color for visual distinction */}
                                <Bar dataKey="count" fill="#006A60" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Recent Logs Table */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 0, height: '400px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Box p={3} borderBottom={1} borderColor="divider">
                            <Typography variant="h6">System Logs (Recent Failures)</Typography>
                        </Box>
                        <TableContainer sx={{ flexGrow: 1 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Level</TableCell>
                                        <TableCell>Message</TableCell>
                                        <TableCell>Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stats.logs && stats.logs.length > 0 ? (
                                        stats.logs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>
                                                    <Chip 
                                                        label={log.level} 
                                                        size="small" 
                                                        color={log.level === 'ERROR' ? 'error' : 'info'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>{log.message}</TableCell>
                                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                                    {new Date(log.createdAt).toLocaleTimeString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">No recent logs</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};