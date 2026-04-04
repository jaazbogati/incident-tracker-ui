import { useEffect, useState } from "react";
import API from "../api/client";
import Navbar from "../components/Navbar";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading , setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter ? u.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const currentUserId = localStorage.getItem("user_id");
        if (id === currentUserId) {
            alert("You cannot delete your own account");
            return;
        }

        try {
            await API.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch {
            alert("Failed to delete user");
        }
    };

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

                <div className="mb-4 flex gap-4">
                    <input 
                        type="text"
                        placeholder="Search by email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select 
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                        className="border rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="superuser">SuperUser</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="w-full border rounded overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Role</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-blue-400 text-gray-950">
                                    <td className="p-2 border">{u.email}</td>
                                    <td className="p-2 border">{u.role}</td>
                                    <td className="p-2 border">{u.is_active ? "Active" : "Inactive"}</td>
                                    <td className="p-2 border">
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded flex items-center"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
                )}
            </div>
        </div>
    );
}