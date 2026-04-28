import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/incidents", label: "Incidents" },
  { to: "/reports", label: "Reports" },
  { to: "/users", label: "Users" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const desktopLinkClass = (path) =>
    `transition-colors text-sm ${
      isActive(path)
        ? "text-white font-medium"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-semibold tracking-wide">
          Incident Dashboard
        </h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={desktopLinkClass(to)}>
              {label}
              {isActive(to) && (
                <span className="block h-0.5 bg-white mt-0.5 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-2 rounded hover:bg-gray-700 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>

          {/* Logout — desktop only */}
          <button
            onClick={logout}
            className="hidden md:block bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* SLIDE-IN DRAWER */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900 text-white z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-700/60">
          <span className="text-sm font-semibold tracking-wide text-gray-200">
            Incident Dashboard
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            >
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col py-4 flex-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-6 py-3.5 text-sm transition-colors border-l-2 ${
                isActive(to)
                  ? "border-white bg-white/5 text-white font-medium"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-gray-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="px-6 py-5 border-t border-gray-700/60">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}