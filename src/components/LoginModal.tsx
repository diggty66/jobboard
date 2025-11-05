import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"seeker" | "employer">("seeker");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleLogin}
        className="rounded bg-white dark:bg-gray-800 p-6 shadow-md space-y-3 max-w-sm w-full"
      >
        <h2 className="text-lg font-bold">Log In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
