import { useEffect, useState } from "react";
import { getJobs, type Job } from "../api";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";

export default function JobsGaijinPot() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<Job | null>(null);

  useEffect(() => {
    getJobs({ source: "gaijinpot" })
      .then(setJobs)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">GaijinPot Jobs</h1>

      <div className="grid gap-4">
        {jobs.map(j => (
          <JobCard key={j.id} job={j} onOpen={() => setSelected(j)} />
        ))}
      </div>

      <JobModal job={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
