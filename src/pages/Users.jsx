import { useEffect, useState } from "react";
import API from "../api/client";
import Navbar from "../components/Navbar";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        API.get("/users")
            .then(res => {
                setUsers(res.data.data);
                setLoading(false);
            })
            .catch(() => {
                alert("Access denied");
                setLoading(false);
            });
    }, [])

    return (
        <div>
            <Navbar />
            <div className="p-6">
                <h2 className="text-xl mb-4">Users</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Role</th>
                                <th className="p-2 border">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="p-2 border">{u.email}</td>
                                    <td className="p-2 border">{u.role}</td>
                                    <td className="p-2 border">{u.is_active ? "Active" : "Inactive"}</td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
                )}
            </div>
        </div>
    );
}