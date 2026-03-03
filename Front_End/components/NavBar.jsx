import { Link } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";

// Floating bottom navigation bar for primary app navigation.
const Navbar = ({ theme, onToggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const isDarkMode = theme === "dark";

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed bottom-4 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4 md:bottom-8">
      <div className="pointer-events-none absolute inset-x-10 -bottom-4 h-12 rounded-full bg-base-content/25 blur-2xl" />
      <div className="mx-auto">
        <div className="relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-full border border-base-content/15 bg-neutral/90 px-3 py-2 text-neutral-content shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-secondary/15" />

          <Link
            to="/"
            className="relative z-10 inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-100 px-3 py-2 text-neutral shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            aria-label="Home"
            onClick={closeMobileMenu}
          >
            <img
              src="/favicon.svg"
              alt="NoteVerse"
              className="size-6 rounded-md"
            />
            <span className="hidden text-sm font-semibold sm:inline">
              NoteVerse
            </span>
          </Link>

          {/* Desktop navigation links */}
          <nav className="relative z-10 hidden flex-1 items-center justify-evenly px-6 text-lg font-medium md:flex">
            <Link
              to="/create"
              className="rounded-full px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-100/15"
            >
              Create Note
            </Link>
            <Link
              to="/about"
              className="rounded-full px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-100/15"
            >
              About
            </Link>
            <Link
              to="/resource"
              className="rounded-full px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-100/15"
            >
              Resource
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-100/15"
              onClick={onToggleTheme}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDarkMode ? "Light" : "Dark"}</span>
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-100/15"
                >
                  {user?.name || "Profile"}
                </Link>
                <button
                  type="button"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-100/15"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-100/15"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-base-100/15"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            className="relative z-10 inline-flex size-10 items-center justify-center rounded-full border border-base-content/20 bg-base-100/90 text-neutral shadow md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="mt-3 rounded-2xl border border-base-content/15 bg-neutral/95 p-3 text-neutral-content shadow-2xl backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-2">
              <Link
                to="/create"
                className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-base-100/15"
                onClick={closeMobileMenu}
              >
                Create Note
              </Link>
              <Link
                to="/about"
                className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-base-100/15"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link
                to="/resource"
                className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-base-100/15"
                onClick={closeMobileMenu}
              >
                Resource
              </Link>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-base-100/15"
                onClick={onToggleTheme}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-base-100/15"
                    onClick={closeMobileMenu}
                  >
                    {user?.name || "Profile"}
                  </Link>
                  <button
                    type="button"
                    className="rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-base-100/15"
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-base-100/15"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-base-100/15"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
