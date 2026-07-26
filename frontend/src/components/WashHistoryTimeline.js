import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Skeleton, Fade, Tooltip, Grow } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
    onTime:    { bg: '#3B82F6', light: '#DBEAFE', label: 'On-time' },   // blue
    delayed:   { bg: '#F59E0B', light: '#FEF3C7', label: 'Delayed' },   // amber
    overdue:   { bg: '#EF4444', light: '#FEE2E2', label: 'Overdue' },   // red
    predicted: { bg: 'transparent', border: '#A78BFA', label: 'Predicted' }, // purple dashed
};

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─────────────────────────────────────────────────────────────────────────────
// DATA PROCESSING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Given raw wash history from API, produces enriched events with:
 * - daysSincePrev: days since last wash
 * - color: visual tier (onTime / delayed / overdue)
 * - monthKey: "2026-07" for grouping
 */
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
        if (idx === 0)             color = 'onTime';
        else if (daysSincePrev <= 5) color = 'onTime';
        else if (daysSincePrev <= 15) color = 'delayed';
        else                           color = 'overdue';

        return {
            id: event.id || Math.random(),
            date,
            dayOfMonth: date.getDate(),
            monthKey: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            monthYear: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
            timeStr: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            daysSincePrev,
            color,
        };
    });
}

/**
 * Computes high-level stats from processed events.
 */
function computeStats(events) {
    if (events.length === 0) return null;

    const now = new Date();

    // --- Counts by color ---
    const counts = { onTime: 0, delayed: 0, overdue: 0 };
    events.forEach(e => counts[e.color]++);

    // --- Average interval ---
    const intervals = events.slice(1).map(e => e.daysSincePrev);
    const avgInterval = intervals.length > 0
        ? Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length)
        : 0;

    // --- Wash streak (consecutive on-time from most recent going backwards) ---
    let streak = 0;
    for (let i = events.length - 1; i >= 1; i--) {
        if (events[i].color === 'onTime') streak++;
        else break;
    }
    if (events.length === 1) streak = 1; // first ever wash counts

    // --- Item Health Score (0–100) ---
    const lastWash = events[events.length - 1].date;
    const daysSinceLastWash = Math.round((now - lastWash) / (1000 * 60 * 60 * 24));

    // Recency score: full marks if washed within 5 days, zero at 30+ days
    const recencyScore = Math.max(0, 100 - (daysSinceLastWash / 30) * 100);

    // Consistency score: based on ratio of on-time washes
    const consistencyScore = events.length > 1
        ? (counts.onTime / events.length) * 100
        : 100;

    // Frequency score: higher is better; using avg interval (lower = more frequent)
    const freqScore = avgInterval > 0
        ? Math.max(0, 100 - ((avgInterval - 5) / 25) * 100)
        : 100;

    const healthScore = Math.round((recencyScore * 0.4) + (consistencyScore * 0.35) + (freqScore * 0.25));

    // --- Next wash prediction ---
    let predictedDate = null;
    if (avgInterval > 0) {
        predictedDate = new Date(lastWash);
        predictedDate.setDate(predictedDate.getDate() + avgInterval);
    }

    return { counts, avgInterval, streak, healthScore, predictedDate, daysSinceLastWash };
}

/**
 * Groups processed events by monthKey. Returns a sorted array of
 * { monthKey, monthYear, year, month0, events[] }.
 * Also includes empty months in the range if needed so the calendar
 * looks contiguous.
 */
function groupByMonth(events, predictedDate) {
    if (events.length === 0) return [];

    const map = new Map();
    events.forEach(e => {
        if (!map.has(e.monthKey)) {
            map.set(e.monthKey, {
                monthKey: e.monthKey,
                monthYear: e.monthYear,
                year: e.date.getFullYear(),
                month0: e.date.getMonth(),
                events: [],
            });
        }
        map.get(e.monthKey).events.push(e);
    });

    // Include predicted month if it exists and isn't already in map
    if (predictedDate) {
        const pk = `${predictedDate.getFullYear()}-${String(predictedDate.getMonth() + 1).padStart(2, '0')}`;
        if (!map.has(pk)) {
            map.set(pk, {
                monthKey: pk,
                monthYear: `${MONTH_NAMES[predictedDate.getMonth()]} ${predictedDate.getFullYear()}`,
                year: predictedDate.getFullYear(),
                month0: predictedDate.getMonth(),
                events: [],
            });
        }
    }

    // Sort months ascending
    return Array.from(map.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

/**
 * Computes wash frequency per month for the last 6 calendar months.
 */
function computeMonthlyFrequency(events) {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months.push({ key, label: MONTH_NAMES[d.getMonth()], count: 0 });
    }
    events.forEach(e => {
        const m = months.find(m => m.key === e.monthKey);
        if (m) m.count++;
    });
    return months;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const SkeletonCalendar = () => (
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} variant="rounded" animation="wave" width={80} height={70}
                    sx={{ borderRadius: 3, flex: 1, bgcolor: 'primary.main', opacity: 0.07 }} />
            ))}
        </Box>
        {[1, 2].map(m => (
            <Box key={m} sx={{ mb: 4 }}>
                <Skeleton variant="text" width={120} height={28} sx={{ mb: 1.5, bgcolor: 'primary.main', opacity: 0.1 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
                    {Array.from({ length: 35 }).map((_, i) => (
                        <Skeleton key={i} variant="circular" width={32} height={32}
                            animation="wave" sx={{ bgcolor: 'primary.main', opacity: 0.06 }} />
                    ))}
                </Box>
            </Box>
        ))}
    </Box>
);

/** Stat card used in the summary row at the top */
const StatCard = ({ icon, label, value, color, delay = 0 }) => (
    <Grow in timeout={500} style={{ transformOrigin: 'bottom center', transitionDelay: `${delay}ms` }}>
        <Box sx={(theme) => ({
            flex: '1 1 0',
            minWidth: 80,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            p: 1.5,
            borderRadius: 3,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            border: '1px solid',
            borderColor: 'divider',
        })}>
            <Box sx={{ color: color || 'primary.main', display: 'flex', alignItems: 'center' }}>
                {icon}
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: color || 'text.primary', lineHeight: 1, fontSize: '1.1rem' }}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.2 }}>
                {label}
            </Typography>
        </Box>
    </Grow>
);

/** Color legend at the top */
const Legend = ({ counts }) => {
    const items = [
        { color: COLORS.onTime.bg,    label: `On-time`,  count: counts.onTime },
        { color: COLORS.delayed.bg,   label: `Delayed`,  count: counts.delayed },
        { color: COLORS.overdue.bg,   label: `Overdue`,  count: counts.overdue },
        { color: COLORS.predicted.border, label: `Predicted`, count: null, dashed: true },
    ];
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
            {items.map(item => (
                <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{
                        width: 12, height: 12, borderRadius: '50%',
                        bgcolor: item.dashed ? 'transparent' : item.color,
                        border: item.dashed ? `2px dashed ${item.color}` : 'none',
                        flexShrink: 0,
                    }} />
                    <Typography variant="caption" color="text.secondary">
                        {item.count !== null ? `${item.label} (${item.count})` : item.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

/** Frequency bar chart — last 6 months */
const FrequencyChart = ({ months }) => {
    const max = Math.max(...months.map(m => m.count), 1);
    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}
                sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1.5 }}>
                Washes per Month (Last 6)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 64 }}>
                {months.map((m) => {
                    const heightPct = max > 0 ? (m.count / max) * 100 : 0;
                    return (
                        <Tooltip key={m.key} title={`${m.label}: ${m.count} wash${m.count !== 1 ? 'es' : ''}`} arrow>
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'default' }}>
                                <Box sx={{
                                    width: '100%',
                                    height: `${Math.max(heightPct, 4)}%`,
                                    minHeight: 4,
                                    maxHeight: 52,
                                    borderRadius: '4px 4px 0 0',
                                    bgcolor: m.count > 0 ? COLORS.onTime.bg : 'divider',
                                    opacity: m.count > 0 ? 0.8 + (heightPct / 100) * 0.2 : 0.3,
                                    transition: 'height 0.4s ease',
                                    alignSelf: 'flex-end',
                                }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                                    {m.label}
                                </Typography>
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>
        </Box>
    );
};

/** Health score ring */
const HealthRing = ({ score }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const dash = (score / 100) * circumference;
    const color = score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444';

    return (
        <Box sx={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={64} height={64} style={{ position: 'absolute', top: 0, left: 0 }}>
                <circle cx={32} cy={32} r={radius} fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth={5} />
                <circle
                    cx={32} cy={32} r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={5}
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                />
            </svg>
            <Typography variant="caption" fontWeight={700} sx={{ color, fontSize: '0.75rem', zIndex: 1 }}>
                {score}
            </Typography>
        </Box>
    );
};

/** A single calendar month grid */
const CalendarMonth = ({ monthData, predictedDate, isLast }) => {
    const { year, month0, monthYear, events } = monthData;

    // Build a set of day → event for quick lookup
    const eventByDay = new Map();
    events.forEach(e => eventByDay.set(e.dayOfMonth, e));

    // First day of month (0=Sun ... 6=Sat)
    const firstDow = new Date(year, month0, 1).getDay();
    const daysInMonth = new Date(year, month0 + 1, 0).getDate();

    // Compute predicted day if it falls in this month
    const predictedDay =
        predictedDate &&
        predictedDate.getFullYear() === year &&
        predictedDate.getMonth() === month0
            ? predictedDate.getDate()
            : null;

    // Monthly summary stats
    const monthIntervals = events.slice(1).map(e => e.daysSincePrev);
    const monthAvg = monthIntervals.length > 0
        ? Math.round(monthIntervals.reduce((a, b) => a + b, 0) / monthIntervals.length)
        : null;

    // Grid cells: empty leading cells + day cells
    const cells = [
        ...Array.from({ length: firstDow }, (_, i) => ({ type: 'empty', key: `e-${i}` })),
        ...Array.from({ length: daysInMonth }, (_, i) => ({ type: 'day', day: i + 1, key: `d-${i + 1}` })),
    ];

    const today = new Date();
    const todayDay = today.getFullYear() === year && today.getMonth() === month0 ? today.getDate() : null;

    return (
        <Box sx={{ mb: isLast ? 0 : 4 }}>
            {/* Month Header */}
            <Typography variant="subtitle2" fontWeight={700}
                sx={{ mb: 1, color: 'text.primary', letterSpacing: 0.5 }}>
                {monthYear}
            </Typography>

            {/* Day-of-week labels */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
                {DAY_LABELS.map(d => (
                    <Typography key={d} variant="caption" color="text.disabled"
                        sx={{ textAlign: 'center', fontSize: '0.6rem', fontWeight: 600 }}>
                        {d}
                    </Typography>
                ))}
            </Box>

            {/* Day cells */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {cells.map(cell => {
                    if (cell.type === 'empty') {
                        return <Box key={cell.key} />;
                    }

                    const { day } = cell;
                    const event = eventByDay.get(day);
                    const isPredicted = predictedDay === day;
                    const isToday = todayDay === day;
                    const colorCfg = event ? COLORS[event.color] : null;

                    let tooltipTitle = '';
                    if (event) {
                        const gapText = event.daysSincePrev > 0
                            ? ` · ${event.daysSincePrev}d since last wash`
                            : ' · First wash!';
                        tooltipTitle = `Washed ${monthYear.split(' ')[0]} ${day} at ${event.timeStr}${gapText}`;
                    } else if (isPredicted) {
                        tooltipTitle = `Predicted next wash (~${monthYear.split(' ')[0]} ${day})`;
                    }

                    const cellContent = (
                        <Box
                            sx={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                cursor: event || isPredicted ? 'pointer' : 'default',
                                // Wash event styles
                                bgcolor: event ? colorCfg.bg : 'transparent',
                                // Predicted: dashed outline
                                border: isPredicted && !event
                                    ? `2px dashed ${COLORS.predicted.border}`
                                    : isToday && !event
                                    ? '1px solid'
                                    : 'none',
                                borderColor: isToday && !event ? 'text.disabled' : undefined,
                                // Hover glow for events
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                '&:hover': event ? {
                                    transform: 'scale(1.15)',
                                    boxShadow: `0 0 0 3px ${colorCfg.bg}40`,
                                } : {},
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: '0.62rem',
                                    fontWeight: event ? 700 : isToday ? 600 : 400,
                                    color: event
                                        ? '#fff'
                                        : isPredicted
                                        ? COLORS.predicted.border
                                        : isToday
                                        ? 'text.primary'
                                        : 'text.secondary',
                                    lineHeight: 1,
                                }}
                            >
                                {day}
                            </Typography>
                        </Box>
                    );

                    return (
                        <Box key={cell.key}>
                            {tooltipTitle ? (
                                <Tooltip title={tooltipTitle} arrow placement="top" enterDelay={200}>
                                    {cellContent}
                                </Tooltip>
                            ) : (
                                cellContent
                            )}
                        </Box>
                    );
                })}
            </Box>

            {/* Monthly Summary Row */}
            {events.length > 0 && (
                <Box sx={{
                    mt: 1, pt: 1,
                    borderTop: '1px solid', borderColor: 'divider',
                    display: 'flex', gap: 0.5, flexWrap: 'wrap'
                }}>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                        {events.length} wash{events.length !== 1 ? 'es' : ''} this month
                        {monthAvg !== null ? ` · avg ${monthAvg}d apart` : ''}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORTED COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const WashHistoryTimeline = ({ itemId, apiUrl, token }) => {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch history from API
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
                setHistory(await res.json());
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        if (itemId) fetchHistory();
    }, [itemId, apiUrl, token]);

    // Process all data
    const events = useMemo(() => processHistory(history || []), [history]);
    const stats   = useMemo(() => computeStats(events), [events]);
    const months  = useMemo(() => groupByMonth(events, stats?.predictedDate || null), [events, stats]);
    const freqData = useMemo(() => computeMonthlyFrequency(events), [events]);

    // ── Loading state ──
    if (loading) {
        return (
            <Fade in timeout={400}>
                <Box><SkeletonCalendar /></Box>
            </Fade>
        );
    }

    // ── Error state ──
    if (error) {
        return (
            <Typography color="error" sx={{ p: 2 }}>
                Error loading history: {error}
            </Typography>
        );
    }

    // ── Empty state ──
    if (events.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    No wash history recorded yet for this item.
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                    Mark it as "Done Washing" to start tracking!
                </Typography>
            </Box>
        );
    }

    // ── Health score color ──
    const healthColor = stats.healthScore >= 70 ? '#22C55E'
        : stats.healthScore >= 40 ? '#F59E0B' : '#EF4444';

    return (
        <Fade in timeout={500}>
            <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>

                {/* ── SECTION 1: Stats Cards ── */}
                <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                    {/* Health Score */}
                    <Grow in timeout={400} style={{ transformOrigin: 'bottom center' }}>
                        <Box sx={(theme) => ({
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            justifyContent: 'center', gap: 0.5, p: 1.5, borderRadius: 3,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                            border: '1px solid', borderColor: 'divider', minWidth: 80, flex: '1 1 0',
                        })}>
                            <HealthRing score={stats.healthScore} />
                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.2 }}>
                                Health Score
                            </Typography>
                        </Box>
                    </Grow>

                    <StatCard
                        delay={80}
                        icon={<LocalFireDepartmentIcon fontSize="small" />}
                        label="Wash Streak"
                        value={`${stats.streak}🔥`}
                        color="#F97316"
                    />
                    <StatCard
                        delay={160}
                        icon={<AccessTimeIcon fontSize="small" />}
                        label="Avg Interval"
                        value={stats.avgInterval > 0 ? `${stats.avgInterval}d` : 'N/A'}
                        color="#6366F1"
                    />
                    <StatCard
                        delay={240}
                        icon={<PsychologyIcon fontSize="small" />}
                        label="Next Wash"
                        value={
                            stats.predictedDate
                                ? `${MONTH_NAMES[stats.predictedDate.getMonth()]} ${stats.predictedDate.getDate()}`
                                : 'N/A'
                        }
                        color="#A78BFA"
                    />
                </Box>

                {/* ── SECTION 2: Legend ── */}
                <Legend counts={stats.counts} />

                {/* ── SECTION 3: Frequency Bar Chart ── */}
                <FrequencyChart months={freqData} />

                {/* ── DIVIDER ── */}
                <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mb: 3 }} />

                {/* ── SECTION 4: Calendar Grid (newest month last) ── */}
                <Box>
                    {months.map((monthData, idx) => (
                        <CalendarMonth
                            key={monthData.monthKey}
                            monthData={monthData}
                            predictedDate={stats.predictedDate}
                            isLast={idx === months.length - 1}
                        />
                    ))}
                </Box>

            </Box>
        </Fade>
    );
};