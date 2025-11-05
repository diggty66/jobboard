import { useEffect, useState } from "react";
import { getAllJobs, type Job } from "../api";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";

export default function JobsAll() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<Job | null>(null);

  useEffect(() => { getAllJobs().then(setJobs); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Sources</h1>
      <div className="grid gap-4">
        {jobs.map((j) => (
          <JobCard key={j.id} job={j} onOpen={setSelected} />
        ))}
      </div>
      <JobModal job={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
