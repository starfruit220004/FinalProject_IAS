import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Profile from "../pages/Profile";

const navLinks = [
  { path: "/dashboard", label: "Dashboard", icon: "⊞" },
  { path: "/blog",      label: "Blog",       icon: "📖" },
  { path: "/flashcards",label: "Flashcards", icon: "🃏" },
  { path: "/quiz",      label: "Quiz",       icon: "❓" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Floating navbar wrapper */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-5xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 px-4 h-14 flex items-center gap-3">

          {/* Left: theme toggles + profile */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Sun + Moon both visible */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600/40 rounded-xl px-2 py-1.5 transition-all hover:border-blue-400/40"
              title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
            >
              <span className={`text-lg transition-opacity ${theme === "light" ? "opacity-100" : "opacity-40"}`}>☀️</span>
              <span className={`text-lg transition-opacity ${theme === "dark"  ? "opacity-100" : "opacity-40"}`}>🌙</span>
            </button>

            {/* Profile pill */}
            {user && (
              <button
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-3 py-1.5 transition-all ml-1"
                title="View profile"
              >
                <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-[11px] font-black shrink-0">
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold hidden sm:block">
                  {user.username}
                </span>
              </button>
            )}

            {/* Guest sign in */}
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1.5 rounded-xl transition-all ml-1"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Center: nav links (Hidden on mobile, shown on md+) */}
          {user && (
            <div className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive(link.path)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive(link.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Right: Logout (Hidden on mobile) */}
          {user && (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-150 shadow-md shadow-red-500/30 shrink-0 ml-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          )}

          {/* Mobile hamburger (Visible on mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 ml-auto transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current rounded-full transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="absolute top-16 left-4 right-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-3 space-y-1 md:hidden">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl"
                >
                  Get Started →
                </button>
              </>
            ) : (
              <>
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </button>
                ))}
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Spacer so content doesn't hide behind floating nav */}
      <div className="h-6" />

      {/* Profile Modal */}
      <Profile isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}