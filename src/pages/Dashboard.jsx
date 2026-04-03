import { useEffect,useState } from "react";
import API from "../api/client";
import Navbar from "../components/Navbar";
import { getSeverityColor } from "../utils/color_scheme";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis} from "recharts";

export default function Dashboard() {
    const [incidents, setIncidents] = useState([]);
    const [fetchError, setFetchError] = useState("");
    

    useEffect(() => {
        API.get("/incidents")
            .then(res => setIncidents(res.data.data.incidents))
            .catch(() => setFetchError("Error loading incidents"));
    }, []);

    //Metrics
    const total = incidents.length;
    const open = incidents.filter(i => i.status === "Open").length;
    const closed = incidents.filter(i => i.status === "Closed").length;

    //Severity Data
    const severityData = ["Low", "Medium", "High", "Critical"].map(level => ({
        name: level,
        value: incidents.filter(i => i.severity === level).length
    }));

    //Status Data
    const statusData = [
        { name: "Open", value: open},
        { name: "Closed", value: closed}
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            {fetchError && <p className="text-red-500 text-center mt-4">{fetchError}</p>}

            {/* Metrics Cards */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white shadow-md p-5 rounded-xl border-l-4 border-blue-400">
                    <h3 className="text-sm text-gray-500">Total incidents</h3>
                    <p className="text-3xl font-semibold">{total}</p>
                </div>

                <div className="bg-white shadow-md p-5 rounded-xl border-l-4 border-red-400">
                    <h3 className="text-sm text-gray-500">Open</h3>
                    <p className="text-3xl text-red-500 font-semibold">{open}</p>
                </div>

                <div className="bg-white shadow-md p-5 rounded-xl border-l-4 border-green-400">
                    <h3 className="text-sm text-gray-500">Closed</h3>
                    <p className="text-3xl text-green-500 font-semibold">{closed}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Severity Pie*/}
                <div className="bg-white p-5 shadow-md rounded-xl">
                    <h3 className="text-sm text-gray-500">Severity Distribution</h3>
                    
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={severityData} dataKey="value" outerRadius={100}>
                                {severityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getSeverityColor(entry.name)} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/*Status Bar */}
                <div className="bg-white p-5 shadow-md rounded-xl">
                    <h3 className="text-sm text-gray-500">Status Overview</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}