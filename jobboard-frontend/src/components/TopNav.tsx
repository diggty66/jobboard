import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useBackendStatus } from "../hooks/useBackendStatus";

export default function TopNav({
  onMenuToggle,
  className = "",
}: {
  onMenuToggle: () => void;
  className?: string;
}) {
  const { user, logout } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const online = useBackendStatus(apiUrl);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <header
      className={`flex items-center justify-between bg-gray-800 px-4 py-2 text-white shadow-md dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-center space-x-2">
        <button onClick={onMenuToggle} className="sm:hidden text-2xl">☰</button>
        <h1 className="text-lg font-semibold">🌐 International Job Board</h1>
      </div>

      <div className="flex items-center space-x-3">
        {!user ? (
          <>
            <button onClick={() => setShowLogin(true)} className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700">
              Log In
            </button>
            <button onClick={() => setShowRegister(true)} className="rounded bg-green-600 px-3 py-1 text-sm hover:bg-green-700">
              Register
            </button>
          </>
        ) : (
          <>
            <span className="text-sm">{user.email} ({user.role})</span>
            <button onClick={logout} className="rounded bg-gray-700 px-2 py-1 text-sm hover:bg-gray-600">
              Log Out
            </button>
          </>
        )}
      </div>
      {/* ✅ backend status indicator */}
      {online === null ? (
        <div className="w-3 h-3 rounded-full bg-gray-500 animate-pulse ml-3" />
      ) : online ? (
        <div className="w-3 h-3 rounded-full bg-green-500 ml-3" />
      ) : (
        <div className="w-3 h-3 rounded-full bg-red-500 ml-3" />
      )}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </header>
  );
}

