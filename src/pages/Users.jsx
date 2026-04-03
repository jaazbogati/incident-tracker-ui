import { useEffect, useState } from "react";
import API from "../api/client";
import Navbar from "../components/Navbar";

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        API.get("/users")
            .then(res => setUsers(res.data.data))
            .catch(() => alert("Access denied"));
    }, [])

    return (
        <div>
            <Navbar />
            <div>
                <h2 className="text-xl mb-4">Users</h2>

                <table className="w-full border">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>{u.is_active ? "Active" : "Inactive"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}