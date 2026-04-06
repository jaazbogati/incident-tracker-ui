import { useEffect, useState, useMemo } from "react";
import API from "../api/client";
import Navbar from "../components/Navbar";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const EVENT_LABELS = {
    INCIDENT_CREATED: { label: "Incident Created", color: "#22c55e", bg: "#f0fdf4" },
    INCIDENT_UPDATED: { label: "Incident Updated", color: "#3b82f6", bg: "#eff6ff" },
    INCIDENT_DELETED: { label: "Incident Deleted", color: "#ef4444", bg: "#fef2f2" },
    INCIDENT_RESTORED: { label: "Incident Restored", color: "#f59e0b", bg: "#fffbeb" },
    USER_CREATED: { label: "User Created", color: "#8b5cf6", bg: "#f5f3ff" },
    USER_ROLE_CHANGED: { label: "Role Changed", color: "#ec4899", bg: "#fdf2f8" },
    USER_DEACTIVATED: { label: "User Deactivated", color: "#6b7280", bg: "#f9fafb" },
};

const SEVERITY_COLORS = {
    Low: "#22c55e",
    Medium: "#f59e0b",
    High: "#ef4444",
    Critical: "#7c3aed"
};

const STATUS_COLORS = {
    Open: "#f59e0b",
    "In Progress": "#3b82f6",
    Closed: "#22c55e"
};

const RANGES = [
    { label: "7 Days", days: 7 },
    { label: "30 Days", days: 30 },
    { label: "90 Days", days: 90 },
];

export default function Reports() {
    const [activeTab, setActiveTab] = useState("activity");
    const [events, setEvents] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventFilter, setEventFilter] = useState("");
    const [range, setRange] = useState(30);

    useEffect(() => {
        Promise.all([
            API.get("/events"),
            API.get("/incidents?limit=100")
        ])
            .then(([eventsRes, incidentsRes]) => {
                setEvents(eventsRes.data.data);
                setIncidents(incidentsRes.data.data.incidents);
            })
            .catch(() => alert("Error loading data"))
            .finally(() => setLoading(false));
    }, []);

    // ---- Analytics calculations ----
    const now = new Date();
    const cutoff = new Date(now - range * 24 * 60 * 60 * 1000);

    const filteredIncidents = useMemo(() =>
        incidents.filter(i => new Date(i.created_at) >= cutoff),
        [incidents, range]
    );

    // Incidents per day
    const incidentsByDay = useMemo(() => {
        const map = {};
        for (let d = 0; d < range; d++) {
            const date = new Date(now - d * 24 * 60 * 60 * 1000)
                .toISOString().split("T")[0];
            map[date] = 0;
        }
        filteredIncidents.forEach(i => {
            const date = new Date(i.created_at).toISOString().split("T")[0];
            if (map[date] !== undefined) map[date]++;
        });
        return Object.entries(map)
            .map(([date, count]) => ({ date: date.slice(5), count }))
            .reverse();
    }, [filteredIncidents, range]);

    // By severity
    const bySeverity = useMemo(() =>
        ["Low", "Medium", "High", "Critical"].map(level => ({
            name: level,
            value: filteredIncidents.filter(i => i.severity === level).length
        })).filter(d => d.value > 0),
        [filteredIncidents]
    );

    // By status
    const byStatus = useMemo(() =>
        ["Open", "In Progress", "Closed"].map(s => ({
            name: s,
            value: filteredIncidents.filter(i => i.status === s).length
        })).filter(d => d.value > 0),
        [filteredIncidents]
    );

    // Summary stats
    const total = filteredIncidents.length;
    const closed = filteredIncidents.filter(i => i.status === "Closed").length;
    const resolutionRate = total > 0 ? Math.round((closed / total) * 100) : 0;
    const criticalCount = filteredIncidents.filter(i => i.severity === "Critical").length;

    // Activity log filter
    const filteredEvents = eventFilter
        ? events.filter(e => e.event_type === eventFilter)
        : events;

    if (loading) return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <p className="p-6 text-gray-400">Loading...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-6">

                {/* Page header */}
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {[
                        { id: "activity", label: "Activity Log" },
                        { id: "analytics", label: "Analytics" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab.id
                                    ? "border-purple-500 text-purple-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ---- ACTIVITY LOG TAB ---- */}
                {activeTab === "activity" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-500">{filteredEvents.length} events</p>
                            <select
                                value={eventFilter}
                                onChange={e => setEventFilter(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                <option value="">All Events</option>
                                {Object.entries(EVENT_LABELS).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {filteredEvents.length === 0 ? (
                            <p className="text-gray-400">No events found.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {filteredEvents.map(event => {
                                    const meta = EVENT_LABELS[event.event_type] || {
                                        label: event.event_type,
                                        color: "#6b7280",
                                        bg: "#f9fafb"
                                    };
                                    return (
                                        <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-4">
                                            <span
                                                className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap mt-0.5"
                                                style={{ color: meta.color, backgroundColor: meta.bg }}
                                            >
                                                {meta.label}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-800">{event.new_value || "—"}</p>
                                                {event.incident_id && (
                                                    <p className="text-xs text-gray-400 mt-0.5">Incident #{event.incident_id}</p>
                                                )}
                                            </div>
                                            <div className="text-right text-xs text-gray-400 whitespace-nowrap">
                                                <p>User #{event.performed_by}</p>
                                                <p>{new Date(event.created_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ---- ANALYTICS TAB ---- */}
                {activeTab === "analytics" && (
                    <div>
                        {/* Range switcher */}
                        <div className="flex gap-2 mb-6">
                            {RANGES.map(r => (
                                <button
                                    key={r.days}
                                    onClick={() => setRange(r.days)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        range === r.days
                                            ? "bg-purple-500 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50 border"
                                    }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        {/* Summary cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: "Total Incidents", value: total, color: "text-gray-800" },
                                { label: "Closed", value: closed, color: "text-green-600" },
                                { label: "Resolution Rate", value: `${resolutionRate}%`, color: "text-blue-600" },
                                { label: "Critical", value: criticalCount, color: "text-red-600" },
                            ].map(card => (
                                <div key={card.label} className="bg-white rounded-xl shadow-sm p-4">
                                    <p className="text-xs text-gray-400 mb-1">{card.label}</p>
                                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Line chart — incidents over time */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <h2 className="text-sm font-semibold text-gray-600 mb-4">Incidents Over Time</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={incidentsByDay}>
                                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Severity + Status charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <h2 className="text-sm font-semibold text-gray-600 mb-4">By Severity</h2>
                                {bySeverity.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No data for this period</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={bySeverity}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ name, percent }) =>
                                                    `${name} ${(percent * 100).toFixed(0)}%`
                                                }
                                            >
                                                {bySeverity.map((entry, i) => (
                                                    <Cell key={i} fill={SEVERITY_COLORS[entry.name]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <h2 className="text-sm font-semibold text-gray-600 mb-4">By Status</h2>
                                {byStatus.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No data for this period</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={byStatus}>
                                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                            <Tooltip />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {byStatus.map((entry, i) => (
                                                    <Cell key={i} fill={STATUS_COLORS[entry.name]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}