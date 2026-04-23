import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = (path) =>
    `transition ${
      location.pathname === path
        ? "text-white"
        : "text-gray-300 hover:text-white"
    }`;

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-semibold">Incident Dashboard</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 text-sm">
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

        {/* Right side */}
        <div className="flex gap-2 items-center">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-2xl p2"
          >
            ☰
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* SLIDE-IN MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col gap-6 text-lg">
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/incidents" onClick={() => setMenuOpen(false)}>
            Incidents
          </Link>
          <Link to="/reports" onClick={() => setMenuOpen(false)}>
            Reports
          </Link>
          <Link to="/users" onClick={() => setMenuOpen(false)}>
            Users
          </Link>

          <button
            onClick={logout}
            className="mt-6 bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}