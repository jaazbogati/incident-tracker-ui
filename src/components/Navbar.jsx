import { useNavigate, useLocation, Link } from "react-router-dom";



export default function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

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
            </div>
            
            {/* Logout Button */}
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Logout</button>
        </div>
    );
}