import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiLogOut, FiUser, FiLayout, FiZap } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 bg-blue-50 font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-4 py-2 rounded-xl transition-all";

  return (
    <nav className={`
      w-full sticky top-0 z-50 transition-all duration-300
      ${scrolled
        ? 'glass shadow-lg'
        : 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md group-hover:shadow-glow-sm transition-all duration-300 group-hover:scale-105">
                <FiLayout className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                TeamSync
              </span>
            </Link>

            {user && (
              <div className="hidden md:flex space-x-2">
                <Link to="/" className={isActive("/")}>
                  <span className="flex items-center gap-2">
                    <FiLayout className="text-lg" />
                    Boards
                  </span>
                </Link>
                <Link to="/workflows" className={isActive("/workflows")}>
                  <span className="flex items-center gap-2">
                    <FiZap className="text-lg" />
                    Automation
                  </span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/60 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-500 hover:text-red-600 transition-all duration-200 p-2.5 rounded-xl hover:bg-red-50 group"
                  title="Logout"
                >
                  <FiLogOut className="text-lg group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-all rounded-xl hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
