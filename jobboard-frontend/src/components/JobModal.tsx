import type { Job } from "../api";

type Props = {
  job: Job | null;
  onClose: () => void;
};

export default function JobModal({ job, onClose }: Props) {
  if (!job) return null;

  const openApply = () => {
    if (job.apply_url) {
      window.open(job.apply_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <p className="text-gray-600 dark:text-gray-300">
          {job.region}, {job.country}{job.visa_type ? ` — ${job.visa_type}` : ""}
        </p>
        {job.salary !== undefined && job.currency && (
          <p className="mt-2">💰 {job.salary.toLocaleString()} {job.currency}</p>
        )}
        {job.description && <p className="mt-3">{job.description}</p>}

        <div className="mt-5 flex gap-2">
          <button className="px-3 py-1.5 rounded bg-blue-600 text-white" onClick={openApply}>
            Apply
          </button>
          <button className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
