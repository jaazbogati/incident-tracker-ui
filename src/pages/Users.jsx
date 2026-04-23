import { useEffect, useState } from "react";
import API from "../api/client";
import Navbar from "../components/Navbar";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading , setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedRole, setEditedRole] = useState("");

    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        role: "user"
    });

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter ? u.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    const handleDeactivate = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await API.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch {
            alert("Failed to delete user");
        }
    };

    const handleCreateUser = async () => {
        try {
            await API.post("/users", newUser);
            const res = await API.get("/users");
            setUsers(res.data.data);
            setShowForm(false);
            setNewUser({ email: "", password: "", role: "user" });
        } catch {
            alert("Failed to create user");
        }
    };

    const handleUpdateUser = async (id) => {
        try {
            await API.patch(`/users/${id}/role`, { role: editedRole });

            setUsers(prev => 
                prev.map(u => 
                    u.id === id ? { ...u, role: editedRole } : u));
            setEditingUserId(null);
            setEditedRole("");
        } catch {
            alert("Failed to update user");     
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

                <div className="flex justify-between mb-4">
                    <h1 className="text-xl font-semibold">User Management</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
                    >
                        {showForm ? "Cancel" : "+ Create User"}
                    </button>
                </div>

                {showForm && (
                    <div className="bg-gray-100 mb-4 p-4 border rounded flex flex-col gap-3 items-center">
                        <h3 className="text-lg font-semibold">Create User</h3>
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={e => setNewUser({...newUser, email: e.target.value})}
                                className="w-full md:w-auto flex-1 border rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={e => setNewUser({...newUser, password: e.target.value})}
                                className="w-full md:w-auto flex-1 border rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row gap-3">
                            <select
                                value={newUser.role}
                                onChange={e => setNewUser({...newUser, role: e.target.value})}
                                className="border rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="superuser">SuperUser</option>
                            </select>
                            <button
                                onClick={handleCreateUser}
                                className="w-full md:w-auto bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                            >
                                Create User
                            </button>
                        </div>
                    </div>
                )}

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
                                <tr key={u.id} className="hover:bg-slate-300 text-gray-650">
                                    <td className="p-2 border">{u.email}</td>
                                    <td className="p-2 border">
                                        {editingUserId === u.id ? (
                                            <select
                                                value={editedRole}
                                                onChange={e => setEditedRole(e.target.value)}
                                                className="border rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                                <option value="superuser">SuperUser</option>
                                            </select>
                                        ) : (
                                            u.role
                                        )}
                                    </td>
                                    <td className="p-2 border">{u.is_active ? "Active" : "Inactive"}</td>
                                    <td className="p-2 border flex gap-2">
                                        {editingUserId === u.id ? (
                                            <button
                                                onClick={() => handleUpdateUser(u.id)}
                                                className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded flex items-center"
                                            >
                                                Save    
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingUserId(u.id);
                                                    setEditedRole(u.role);
                                                }}
                                                className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded flex items-center"
                                            >
                                                Edit Role
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeactivate(u.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded flex items-center"
                                        >
                                            Deactivate
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