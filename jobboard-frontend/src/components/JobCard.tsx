import type { Job } from "../api";

type Props = {
  job: Job;
  onOpen?: (job: Job) => void;
};

export default function JobCard({ job, onOpen }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow">
      <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {job.region}, {job.country}{job.visa_type ? ` — ${job.visa_type}` : ""}
      </p>
      {job.salary !== undefined && job.currency && (
        <p className="mt-2">💰 {job.salary.toLocaleString()} {job.currency}</p>
      )}
      <button
        className="mt-3 px-3 py-1.5 rounded bg-blue-600 text-white"
        onClick={() => onOpen?.(job)}
      >
        Apply
      </button>
    </div>
  );
}
