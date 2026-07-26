import React, { useState, useEffect, useMemo } from 'react';
import { 
    Box, Typography, Skeleton, Fade, Tooltip, Grow, IconButton, Button, CircularProgress, Alert, Snackbar 
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PsychologyIcon from '@mui/icons-material/Psychology';
import FavoriteIcon from '@mui/icons-material/Favorite';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & PALETTE
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
    onTime:    { bg: '#3B82F6', label: 'On-time' },     // Blue
    delayed:   { bg: '#F59E0B', label: 'Delayed' },     // Amber
    overdue:   { bg: '#EF4444', label: 'Overdue' },     // Red
    predicted: { border: '#A78BFA', label: 'Predicted' }, // Dashed Purple
};

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function processHistory(rawHistory) {
    if (!rawHistory || rawHistory.length === 0) return [];

    const sorted = [...rawHistory].sort((a, b) => new Date(a.washDate) - new Date(b.washDate));

    return sorted.map((event, idx) => {
        const date = new Date(event.washDate);
        const prevDate = idx > 0 ? new Date(sorted[idx - 1].washDate) : null;
        const daysSincePrev = prevDate
            ? Math.round((date - prevDate) / (1000 * 60 * 60 * 24))
            : 0;

        let color;
        if (idx === 0) color = 'onTime';
        else if (daysSincePrev <= 5) color = 'onTime';
        else if (daysSincePrev <= 15) color = 'delayed';
        else color = 'overdue';

        return {
            id: event.id || Math.random(),
            date,
            year: date.getFullYear(),
            month0: date.getMonth(),
            dayOfMonth: date.getDate(),
            timeStr: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            daysSincePrev,
            color,
        };
    });
}

function computeStats(events) {
    if (events.length === 0) return null;

    const now = new Date();
    const counts = { onTime: 0, delayed: 0, overdue: 0 };
    events.forEach(e => counts[e.color]++);

    const intervals = events.slice(1).map(e => e.daysSincePrev);
    const avgInterval = intervals.length > 0
        ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
        : 0;

    let streak = 0;
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].color === 'onTime') streak++;
        else break;
    }

    const lastWash = events[events.length - 1].date;
    const daysSinceLastWash = Math.round((now - lastWash) / (1000 * 60 * 60 * 24));

    const recencyScore = Math.max(0, 100 - (daysSinceLastWash / 30) * 100);
    const consistencyScore = events.length > 1 ? (counts.onTime / events.length) * 100 : 100;
    const freqScore = avgInterval > 0 ? Math.max(0, 100 - ((avgInterval - 5) / 25) * 100) : 100;
    const healthScore = Math.round((recencyScore * 0.4) + (consistencyScore * 0.35) + (freqScore * 0.25));

    let predictedDate = null;
    if (avgInterval > 0) {
        predictedDate = new Date(lastWash);
        predictedDate.setDate(predictedDate.getDate() + avgInterval);
    } else {
        // Fallback: 7 days after last wash if single entry
        predictedDate = new Date(lastWash);
        predictedDate.setDate(predictedDate.getDate() + 7);
    }

    return { counts, avgInterval, streak, healthScore, predictedDate, daysSinceLastWash };
}

function computeMonthlyFrequency(events) {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        months.push({ key, year: d.getFullYear(), month0: d.getMonth(), label: MONTH_NAMES[d.getMonth()], count: 0 });
    }
    events.forEach(e => {
        const m = months.find(m => m.year === e.year && m.month0 === e.month0);
        if (m) m.count++;
    });
    return months;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

export const WashHistoryTimeline = ({ itemId, apiUrl, token }) => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Month Navigation State (Default to current month)
    const [currentViewDate, setCurrentViewDate] = useState(new Date());



    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${apiUrl}/items/${itemId}/history`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.status === 401) throw new Error('Unauthorized');
                if (!res.ok) throw new Error('Failed to fetch history data.');
                const data = await res.json();
                setHistory(data);

                // Set initial view month to latest event date if exists
                if (data && data.length > 0) {
                    const sorted = [...data].sort((a, b) => new Date(b.washDate) - new Date(a.washDate));
                    setCurrentViewDate(new Date(sorted[0].washDate));
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        if (itemId) fetchHistory();
    }, [itemId, apiUrl, token]);

    const events = useMemo(() => processHistory(history || []), [history]);
    const stats = useMemo(() => computeStats(events), [events]);
    const freqData = useMemo(() => computeMonthlyFrequency(events), [events]);

    const handlePrevMonth = () => {
        setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleResetToToday = () => {
        setCurrentViewDate(new Date());
    };



    if (loading) {
        return (
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                Error loading history: {error}
            </Alert>
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CALENDAR GRID COMPUTATIONS FOR CURRENT VIEW MONTH
    // ─────────────────────────────────────────────────────────────────────────
    const viewYear = currentViewDate.getFullYear();
    const viewMonth0 = currentViewDate.getMonth();
    const daysInMonth = new Date(viewYear, viewMonth0 + 1, 0).getDate();
    const firstDayOfWeek = new Date(viewYear, viewMonth0, 1).getDay();

    // Filter events for this month
    const monthEvents = events.filter(e => e.year === viewYear && e.month0 === viewMonth0);
    const eventMap = new Map();
    monthEvents.forEach(e => eventMap.set(e.dayOfMonth, e));

    // Predicted date check
    const isPredictedInMonth = stats?.predictedDate &&
        stats.predictedDate.getFullYear() === viewYear &&
        stats.predictedDate.getMonth() === viewMonth0;
    const predictedDay = isPredictedInMonth ? stats.predictedDate.getDate() : null;

    // Today check
    const today = new Date();
    const isTodayInMonth = today.getFullYear() === viewYear && today.getMonth() === viewMonth0;
    const todayDay = isTodayInMonth ? today.getDate() : null;

    const healthColor = stats?.healthScore >= 70 ? '#22C55E' : stats?.healthScore >= 40 ? '#F59E0B' : '#EF4444';

    return (
        <Fade in timeout={300}>
            <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', p: 1 }}>

                {/* ── 1. COMPACT STATS ROW (MUI3 Style) ── */}
                {stats ? (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 1,
                        mb: 2
                    }}>
                        {/* Health */}
                        <Tooltip title="Freshness & consistency score" arrow>
                            <Box sx={{
                                border: '1px solid', borderColor: 'divider', borderRadius: 2,
                                p: 1, textAlign: 'center', bgcolor: 'action.hover'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.25 }}>
                                    <FavoriteIcon sx={{ fontSize: 16, color: healthColor }} />
                                    <Typography variant="caption" fontWeight={700} sx={{ color: healthColor, fontSize: '0.85rem' }}>
                                        {stats.healthScore}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1 }}>
                                    Health Score
                                </Typography>
                            </Box>
                        </Tooltip>

                        {/* Streak */}
                        <Tooltip title="Consecutive on-time washes" arrow>
                            <Box sx={{
                                border: '1px solid', borderColor: 'divider', borderRadius: 2,
                                p: 1, textAlign: 'center', bgcolor: 'action.hover'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.25 }}>
                                    <LocalFireDepartmentIcon sx={{ fontSize: 16, color: '#F97316' }} />
                                    <Typography variant="caption" fontWeight={700} sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                                        {stats.streak}🔥
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1 }}>
                                    Wash Streak
                                </Typography>
                            </Box>
                        </Tooltip>

                        {/* Avg Interval */}
                        <Tooltip title="Average days between washes" arrow>
                            <Box sx={{
                                border: '1px solid', borderColor: 'divider', borderRadius: 2,
                                p: 1, textAlign: 'center', bgcolor: 'action.hover'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.25 }}>
                                    <AccessTimeIcon sx={{ fontSize: 16, color: '#6366F1' }} />
                                    <Typography variant="caption" fontWeight={700} sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                                        {stats.avgInterval > 0 ? `${stats.avgInterval}d` : 'N/A'}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1 }}>
                                    Avg Interval
                                </Typography>
                            </Box>
                        </Tooltip>

                        {/* Next Wash */}
                        <Tooltip title="Predicted next wash date" arrow>
                            <Box sx={{
                                border: '1px solid', borderColor: 'divider', borderRadius: 2,
                                p: 1, textAlign: 'center', bgcolor: 'action.hover'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.25 }}>
                                    <PsychologyIcon sx={{ fontSize: 16, color: '#A78BFA' }} />
                                    <Typography variant="caption" fontWeight={700} sx={{ color: 'primary.main', fontSize: '0.75rem' }}>
                                        {stats.predictedDate
                                            ? `${MONTH_NAMES[stats.predictedDate.getMonth()]} ${stats.predictedDate.getDate()}`
                                            : 'N/A'}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', lineHeight: 1 }}>
                                    Next Wash
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                ) : null}

                {/* ── 2. COMPACT LEGEND BAR ── */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 1, mb: 1.5, px: 0.5
                }}>
                    {/* Legend */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.onTime.bg }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                On-time ({stats?.counts.onTime || 0})
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.delayed.bg }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Delayed ({stats?.counts.delayed || 0})
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: COLORS.overdue.bg }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Overdue ({stats?.counts.overdue || 0})
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: `1.5px dashed ${COLORS.predicted.border}` }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                Predicted
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* ── 3. INTERACTIVE MONTH SWITCHER HEADER ── */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                    borderRadius: 2, px: 1, py: 0.5, mb: 1.5
                }}>
                    <IconButton size="small" onClick={handlePrevMonth} title="Previous Month">
                        <ChevronLeftIcon fontSize="small" />
                    </IconButton>

                    <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9rem' }}>
                            {MONTH_NAMES_FULL[viewMonth0]} {viewYear}
                        </Typography>

                        {/* Reset to Today button */}
                        {(viewYear !== today.getFullYear() || viewMonth0 !== today.getMonth()) && (
                            <Tooltip title="Jump to Current Month" arrow>
                                <IconButton size="small" onClick={handleResetToToday} color="primary" sx={{ p: 0.25 }}>
                                    <TodayIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    <IconButton size="small" onClick={handleNextMonth} title="Next Month">
                        <ChevronRightIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* ── 4. PROPORTIONATE & COMPACT CALENDAR GRID ── */}
                <Box sx={{
                    border: '1px solid', borderColor: 'divider', borderRadius: 2.5,
                    p: 1.5, bgcolor: 'background.paper'
                }}>
                    {/* Day-of-week Headers */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
                        {DAY_LABELS.map(d => (
                            <Typography key={d} variant="caption" color="text.secondary"
                                sx={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
                                {d}
                            </Typography>
                        ))}
                    </Box>

                    {/* Day Cells Grid */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, rowGap: 1 }}>
                        {/* Empty leading cells */}
                        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                            <Box key={`empty-${i}`} sx={{ height: 28 }} />
                        ))}

                        {/* Day Cells */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const event = eventMap.get(day);
                            const isPredicted = predictedDay === day;
                            const isToday = todayDay === day;
                            const colorCfg = event ? COLORS[event.color] : null;

                            let tooltipText = '';
                            if (event) {
                                const gapStr = event.daysSincePrev > 0 ? ` (${event.daysSincePrev}d interval)` : ' (First wash)';
                                tooltipText = `Washed on ${MONTH_NAMES[viewMonth0]} ${day} at ${event.timeStr}${gapStr}`;
                            } else if (isPredicted) {
                                tooltipText = `Predicted Wash Date: ${MONTH_NAMES[viewMonth0]} ${day}`;
                            } else if (isToday) {
                                tooltipText = `Today (${MONTH_NAMES[viewMonth0]} ${day})`;
                            }

                            const cellMarkup = (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: event || isPredicted ? 'pointer' : 'default',
                                            bgcolor: event ? colorCfg.bg : 'transparent',
                                            border: isPredicted && !event
                                                ? `2px dashed ${COLORS.predicted.border}`
                                                : isToday && !event
                                                ? '1.5px solid'
                                                : 'none',
                                            borderColor: isToday && !event ? 'primary.main' : undefined,
                                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                            '&:hover': event ? {
                                                transform: 'scale(1.15)',
                                                boxShadow: `0 0 0 3px ${colorCfg.bg}33`
                                            } : isPredicted ? {
                                                transform: 'scale(1.15)',
                                                boxShadow: `0 0 0 3px ${COLORS.predicted.border}33`
                                            } : {}
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontSize: '0.72rem',
                                                fontWeight: event ? 700 : isToday ? 700 : 400,
                                                color: event
                                                    ? '#ffffff'
                                                    : isPredicted
                                                    ? COLORS.predicted.border
                                                    : isToday
                                                    ? 'primary.main'
                                                    : 'text.primary',
                                                lineHeight: 1
                                            }}
                                        >
                                            {day}
                                        </Typography>
                                    </Box>
                                </Box>
                            );

                            return tooltipText ? (
                                <Tooltip key={`day-${day}`} title={tooltipText} arrow placement="top">
                                    {cellMarkup}
                                </Tooltip>
                            ) : (
                                <Box key={`day-${day}`}>{cellMarkup}</Box>
                            );
                        })}
                    </Box>

                    {/* Month Summary Bar */}
                    <Box sx={{
                        mt: 1.5, pt: 1, borderTop: '1px solid', borderColor: 'divider',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
                            {monthEvents.length} wash{monthEvents.length !== 1 ? 'es' : ''} in {MONTH_NAMES[viewMonth0]}
                        </Typography>

                        {isPredictedInMonth && (
                            <Typography variant="caption" sx={{ fontSize: '0.68rem', color: COLORS.predicted.border, fontWeight: 600 }}>
                                🔮 Next wash scheduled ~{MONTH_NAMES[viewMonth0]} {predictedDay}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* ── 5. MINI FREQUENCY CHART (COMPACT) ── */}
                {freqData && freqData.some(f => f.count > 0) && (
                    <Box sx={{ mt: 1.5, px: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}
                            sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.75 }}>
                            6-Month Wash Frequency
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 32 }}>
                            {freqData.map(m => {
                                const maxCount = Math.max(...freqData.map(f => f.count), 1);
                                const pct = (m.count / maxCount) * 100;
                                return (
                                    <Tooltip key={m.key} title={`${m.label} ${m.year}: ${m.count} wash(es)`} arrow>
                                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                            <Box sx={{
                                                width: '100%',
                                                height: `${Math.max(pct, 8)}%`,
                                                bgcolor: m.count > 0 ? 'primary.main' : 'action.disabledBackground',
                                                borderRadius: '2px 2px 0 0',
                                                opacity: m.count > 0 ? 0.85 : 0.4
                                            }} />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.55rem', mt: 0.25 }}>
                                                {m.label}
                                            </Typography>
                                        </Box>
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    </Box>
                )}

            </Box>
        </Fade>
    );
};