import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  onClose: () => void;
}

export default function RegisterModal({ onClose }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"seeker" | "employer">("seeker");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    login(email, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleRegister}
        className="rounded bg-white dark:bg-gray-800 p-6 shadow-md space-y-3 max-w-sm w-full"
      >
        <h2 className="text-lg font-bold">Register</h2>
        {error && <p className="text-sm text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "seeker" | "employer")}
          className="w-full border rounded px-2 py-1"
        >
          <option value="seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
