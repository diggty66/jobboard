import { useState, useEffect } from "react";
import type { Job } from "../api";
import Loader from "./Loader";
import { useAuth } from "../context/AuthContext";

interface Props {
  jobs: Job[];
  className?: string;
}

export default function JobList({ jobs, className = "" }: Props) {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Job | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [jobs]);

  if (loading) return <Loader />;

  return (
    <main
      className={`overflow-y-auto bg-gray-100 p-6 dark:bg-gray-900 transition-colors duration-500 ${className}`}
    >
      {jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No jobs found. Select a region to view listings.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((j, i) => (
            <div
              key={`${j.title}-${j.company ?? "unknown"}-${i}`}
              onClick={() => setSelected(j)}
              className="cursor-pointer rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {j.title || "Untitled position"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {j.region || "Unknown region"}, {j.country || "Japan"}
              </p>

              {/* Safe salary display */}
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                💰{" "}
                {j.salary
                  ? `${Number(j.salary).toLocaleString()} ${j.currency || "¥"}`
                  : "Salary not listed"}
              </p>

              {user?.role === "seeker" && (
                <button className="mt-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
                  Apply
                </button>
              )}
              {!user && (
                <p className="text-xs text-gray-500 mt-1">
                  Log in to view apply options.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-2 dark:text-white">
              {selected.title || "Untitled position"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {selected.region || "Unknown region"},{" "}
              {selected.country || "Japan"}{" "}
              {selected.visa_type ? `— ${selected.visa_type}` : ""}
            </p>
            <p className="text-gray-800 dark:text-gray-300 mb-2">
              💰{" "}
              {selected.salary
                ? `${Number(selected.salary).toLocaleString()} ${
                    selected.currency || "¥"
                  }`
                : "Salary not listed"}
            </p>
            <p className="text-gray-700 dark:text-gray-200 mb-4">
              {selected.description || "No description available."}
            </p>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
