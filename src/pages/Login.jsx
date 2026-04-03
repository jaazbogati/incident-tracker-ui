import { useState } from "react";
import API from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", {email, password});
            localStorage.setItem("token", res.data.data.token);
            navigate("/dashboard");
        } catch {
            alert("login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Login</h2>
                <input type="email" value={email} className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Email" />
                <input type="password" value={password} className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400" onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Password" />
                <button className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md" onClick={handleLogin}>
                    Login
                </button>
                {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
            </div>
            
        </div>
    );
}