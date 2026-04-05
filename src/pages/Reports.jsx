import { useEffect, useState } from "react";
import API from "../api/client";
import Navbar from "../components/Navbar";

const EVENT_LABELS = {
    INCIDENT_CREATED: { label: "Incident Created", color: "#22c55e", bg: "#f0fdf4" },
    INCIDENT_UPDATED: { label: "Incident Updated", color: "#3b82f6", bg: "#eff6ff" },
    INCIDENT_DELETED: { label: "Incident Deleted", color: "#ef4444", bg: "#fef2f2" },
    INCIDENT_RESTORED: { label: "Incident Restored", color: "#f59e0b", bg: "#fffbeb" },
    USER_CREATED: { label: "User Created", color: "#8b5cf6", bg: "#f5f3ff" },
    USER_ROLE_CHANGED: { label: "Role Changed", color: "#ec4899", bg: "#fdf2f8" },
    USER_DEACTIVATED: { label: "User Deactivated", color: "#6b7280", bg: "#f9fafb" },
};

export default function Reports() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        API.get("/events")
            .then(res => setEvents(res.data.data))
            .catch(() => alert("Error loading activity log"))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter
        ? events.filter(e => e.event_type === filter)
        : events;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="">All Events</option>
                        {Object.entries(EVENT_LABELS).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-gray-400">No events found.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.map(event => {
                            const meta = EVENT_LABELS[event.event_type] || {
                                label: event.event_type,
                                color: "#6b7280",
                                bg: "#f9fafb"
                            };
                            return (
                                <div key={event.id} className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-4">
                                    {/* Event type badge */}
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap mt-0.5"
                                        style={{ color: meta.color, backgroundColor: meta.bg }}
                                    >
                                        {meta.label}
                                    </span>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800">{event.new_value || "—"}</p>
                                        {event.incident_id && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Incident #{event.incident_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Meta */}
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
        </div>
    );
}