import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";


export const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const isAdmin = authUser?.role === "ADMIN";
  const navigate = useNavigate();

  useEffect(() => {
    // keep alt+a admin shortcut
    const handleKeyPress = (e) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        if (isAdmin) {
          e.preventDefault();
          navigate("/add-problem");
        }
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [navigate, isAdmin]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };

  return (
    <header className="w-full">
      <div
        className={`
          mx-auto px-4 sm:px-6 lg:px-8
          py-3
        `}
      >
        {/* glossy navbar container */}
        <nav
          className={`
            flex items-center gap-4 justify-between
            w-full max-w-6xl mx-auto
            rounded-2xl px-4 py-2
            border border-black/10 bg-[#f7f7f7] text-black
            dark:border-white/10 dark:bg-white/5 dark:text-white
            backdrop-blur-md shadow-md
          `}
          aria-label="Main navigation"
        >

          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.svg" alt="DsaHub logo" className="w-10 h-10 rounded-md" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-base font-semibold">DsaHub</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-300 -mt-0.5">
                Practice & master DSA
              </span>
            </div>
            {/* show title on very small screens too (compact) */}
            <span className="sm:hidden text-sm font-semibold">DsaHub</span>
          </Link>

          {/* right: controls */}
          <div className="flex items-center gap-3">
            {/* admin add problem */}
            {isAdmin && (
              <Link
                to="/add-problem"
                className={`
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
                  bg-transparent border border-neutral-200 dark:border-neutral-700
                  hover:bg-neutral-100/50 dark:hover:bg-white/6 transition
                `}
                title="Add Problem"
              >
                <span>Add Problem</span>
              </Link>
            )}

            {/* logout (hidden on xs to save space) */}
            <button
                onClick={handleLogout}
                className="
                    hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-sm
                    bg-black text-white border border-black/30 
                    dark:bg-white dark:text-black dark:border-white/20
                    shadow-[0_2px_6px_rgba(0,0,0,0.25)]
                    hover:bg-black/80 dark:hover:bg-white/90
                    transition
                "
                >
                Logout
            </button>


            <button
              onClick={handleLogout}
              className="inline-flex sm:hidden items-center px-2 py-1 rounded-md text-sm bg-red-600 text-white"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>  
  );
};

export default Navbar;
