import { useEffect, useState } from "react";
import {
  getCountries,
  getRegions,
  getJobs,
  getIndeedJobs,
  getJapanJobs,
  getGaijinpotJobs,
  getAllJobs,
  type Job,
} from "./api";

import TopNav from "./components/TopNav";
import LeftNav from "./components/LeftNav";
import JobList from "./components/JobList";
import MapBackground from "./components/MapBackground";

export default function App() {
  const [countries, setCountries] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [source, setSource] = useState<"local" | "indeed" | "japanjobs" | "gaijinpot" | "all">("local");

  // Load countries once
  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  // Country + region selection (only applies to local DB)
  const selectCountry = (c: string | null) => {
    setSelectedCountry(c);
    if (c) getRegions(c).then(setRegions);
    else setRegions([]);
  };

  const selectRegion = (r: string) => {
    if (selectedCountry) getJobs({ country: selectedCountry, region: r }).then(setJobs);
  };

  // Source switching
  useEffect(() => {
    if (source === "local") {
      if (selectedCountry) {
        getJobs({ country: selectedCountry }).then(setJobs);
      } else {
        getJobs().then(setJobs);
      }
    } else if (source === "indeed") {
      getIndeedJobs().then(setJobs);
    } else if (source === "japanjobs") {
      getJapanJobs().then(setJobs);
    } else if (source === "gaijinpot") {
      getGaijinpotJobs().then(setJobs);
    } else if (source === "all") {
      getAllJobs().then(setJobs);
    }
  }, [source, selectedCountry]);

  return (
    <div className="relative grid h-screen grid-rows-[60px_1fr] grid-cols-[220px_1fr]">
      <MapBackground />
      <TopNav
        onMenuToggle={() => setMenuOpen(!menuOpen)}
        className="col-span-2 row-[1]"
      />
      <LeftNav
        countries={countries}
        regions={regions}
        selectedCountry={selectedCountry}
        onCountrySelect={selectCountry}
        onRegionSelect={selectRegion}
        open={menuOpen}
        setOpen={setMenuOpen}
        className="row-[2] col-[1]"
      />
      <div className="row-[2] col-[2] p-4 flex flex-col">
        <div className="mb-4 flex items-center gap-2">
          <label className="font-semibold">Source:</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as any)}
            className="border rounded p-1"
          >
            <option value="local">Local DB</option>
            <option value="indeed">Indeed</option>
            <option value="japanjobs">JapanJobs</option>
            <option value="gaijinpot">GaijinPot</option>
            <option value="all">All Sources</option>
          </select>
        </div>

        <JobList jobs={jobs} className="flex-1 overflow-y-auto" />
      </div>
    </div>
  );
}
