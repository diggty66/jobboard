import { useEffect, useState } from "react";
import { getCountries, getRegions, getJobs, type Job } from "../api";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";

export default function JobsLocal() {
  const [countries, setCountries] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [country, setCountry] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selected, setSelected] = useState<Job | null>(null);

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  useEffect(() => {
    if (country) {
      getRegions(country).then(setRegions);
    } else {
      setRegions([]);
    }
    setRegion("");
  }, [country]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (country) params.country = country;
    if (region) params.region = region;
    getJobs(params).then(setJobs);
  }, [country, region]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Local Jobs (Database)</h1>

      <div className="flex gap-4 mb-4">
        <select className="border p-2 rounded" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All Countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="border p-2 rounded" value={region} onChange={(e) => setRegion(e.target.value)} disabled={!regions.length}>
          <option value="">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="grid gap-4">
        {jobs.map(j => <JobCard key={j.id} job={j} onOpen={setSelected} />)}
      </div>

      <JobModal job={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
