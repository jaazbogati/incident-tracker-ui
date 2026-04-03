import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/client";
import { getSeverityColor } from "../utils/color_scheme";

const getStatusColor = (status) => {
    switch (status) {
        case "Open":
            return "text-yellow-500";
        case "Closed":
            return "text-green-500";
        default:
            return "text-gray-500";
    }
};

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [fetchError, setFetchError] = useState("");
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [severityFilter, setSeverityFilter] = useState("");
    const [title, setTitle] = useState("");
    const [severity, setSeverity] = useState("Low");
    const [status, setStatus] = useState("Open");
    const [description, setDescription] = useState("");
    {/*Modal state*/}
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        API.get("/incidents")
            .then(res => {
                setIncidents(res.data.data.incidents);
            })
            .catch(() => {
                alert("Error loading incidents");
            })
            .finally(() => setLoading(false));
    }, []);

    const filterIncidents = incidents.filter((incident) => {
        const matchesSearch = incident.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter ? incident.status === statusFilter : true;
        const matchesSeverity = severityFilter ? incident.severity === severityFilter : true;
        return matchesSearch && matchesStatus && matchesSeverity;
    });

    const handleCreate = async () => {
        try {
            const response = await API.post("/incidents", {
                title,
                description,
                severity,
                status
            });
            const newIncident = response.data.data;
            setIncidents([newIncident, ...incidents]);
            setTitle("");
            setDescription("");
            setSeverity("Low");
            setStatus("Open");
        } catch (error) {
            alert("Error creating incident");
        }
    };

    const handleUpdate = async () => {
        try {
            await API.patch(
                `/incidents/${selectedIncident.id}`, {
                    title: selectedIncident.title,
                    description: selectedIncident.description,
                    severity: selectedIncident.severity,
                    status: selectedIncident.status
                }
            );

            {/*Update the incident in the list*/}
            setIncidents((prev) =>
                prev.map((i) => (i.id === selectedIncident.id ? selectedIncident : i))
            );

            setIsModalOpen(false);
            } catch (error){ 
                console.error("Update error:", error.response?.data || error.message);
                alert("Error updating incident");
            }
        };
        
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p6 flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">Incidents</h2>

                {fetchError && <p className="text-red-500">{fetchError}</p>}
                
                <div className="bg-white shadow-md rounded-xl p-4 mb-6">
                    <h2 className="text-lg font-medium text-gray-800">Create New Incident</h2>

                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="flex-1 border rounded-lg px-3 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="flex-1 border rounded-lg px-3 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <select
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value)}
                            className="border rounded-lg px-3 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>

                        <button
                            onClick={handleCreate}
                            disabled={!title.trim() || !description.trim() || !severity}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                        >
                            Create Incident
                        </button>
                    </div>
                </div>


                {/* Table with Search & Filters Options*/}
                <div className="bg-white shadow-md rounded-xl p-4 mb-6">
                    <h2 className="text-lg font-medium text-gray-800">Incident/s Search</h2>
                    
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="">All Severities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                        {(search || statusFilter || severityFilter) && (
                            <button
                                onClick={() => { setSearch(""); setStatusFilter(""); setSeverityFilter(""); }}
                                className="text-sm text-purple-500 hover:text-purple-700 font-medium whitespace-nowrap"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Incident Detail Modal */}
            {isModalOpen && selectedIncident && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                       <h2 className="text-lg font-semibold mb-4">Edit Incident</h2>

                       <input
                            value={selectedIncident.title}
                            onChange={(e) => setSelectedIncident({ ...selectedIncident, title: e.target.value })}
                            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />

                        <input
                            value={selectedIncident.description}
                            onChange={(e) => setSelectedIncident({ ...selectedIncident, description: e.target.value })}
                            placeholder="Description"
                            className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />

                       <select 
                        value={selectedIncident.severity}
                        onChange={(e) => setSelectedIncident({ ...selectedIncident, severity: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"   
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                       </select>

                       <select 
                        value={selectedIncident.status}
                        onChange={(e) => setSelectedIncident({ ...selectedIncident, status: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"   
                        >
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                       </select>

                       <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg"
                            >
                                Update Incident
                            </button>
                       </div>
                    </div>
                </div>
            )}

            {/* Filtered Incidents Table */}
            <div className="px-6 pb-6">
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Title</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Severity</th>
                                    <th className="p-3">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading &&(
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-400">No incidents match your filters.</td>
                                    </tr>
                                )}
                                {!loading && filterIncidents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-400">
                                            {search || statusFilter || severityFilter
                                                ? "No incidents match your filters."
                                                : "No incidents found."}
                                        </td>
                                    </tr>
                                )}
                                {!loading && filterIncidents.map((incident) => (
                                    <tr key={incident.id} onClick={() => {
                                        setSelectedIncident(incident);
                                        setIsModalOpen(true);
                                    }} className="border-t hover:bg-gray-50 cursor-pointer transition-colors">
                                        <td className="p-3">{incident.id}</td>
                                        <td className="p-3">{incident.title}</td>
                                        <td className="p-3 font-medium" style={{ color: incident.status === "Open" ? "#eab308" : "#22c55e" }}>
                                            {incident.status}
                                        </td>
                                        <td className="p-3 font-medium" style={{ color: getSeverityColor(incident.severity) }}>
                                            {incident.severity}
                                        </td>
                                        <td className="p-3">{new Date(incident.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}