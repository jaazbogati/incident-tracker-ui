import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";



export default function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const linkClass = (path) => 
        `hover:text-white cursor-pointer transition-colors ${
            location.pathname === path ? "text-white" : "text-gray-300 hover:text-white"
        }`;
    

    return (
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center gap-6 justify-between shadow-md">
            <h1 className="text-lg font-semibold tracking-wide">Incident Dashboard</h1>
            
            {/* Nav links */}
            <div className="hidden md:flex gap-4 text-sm text-gray-300">
                <Link to="/dashboard" className={linkClass("/dashboard")}>
                    Dashboard
                </Link>
                <Link to="/incidents" className={linkClass("/incidents")}>
                    Incidents
                </Link>
                <Link to="/reports" className={linkClass("/reports")}>
                    Reports
                </Link>
                <Link to="/users" className={linkClass("/users")}>
                    Users
                </Link>
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)} 
                className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            >
                ☰
            </button>
            
            {isOpen && (
                <div className="md:hidden bg-gray-800 text-white flex flex-col items-center gap-4 py-4 absolute top-16 left-0 w-full">
                    
                    <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                    </Link>

                    <Link to="/incidents" onClick={() => setIsOpen(false)}>
                    Incidents
                    </Link>

                    <Link to="/reports" onClick={() => setIsOpen(false)}>
                    Reports
                    </Link>

                    <Link to="/users" onClick={() => setIsOpen(false)}>
                    Users
                    </Link>

                </div>
            )}

            {/* Logout Button */}
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Logout</button>
        </div>
    );
}