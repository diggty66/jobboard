import { useEffect, useState } from "react";
import { getCountries, getRegions, getJobs } from "./api";
import type { Job } from "./api";
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

  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  const selectCountry = (c: string | null) => {
    setSelectedCountry(c);
    if (c) getRegions(c).then(setRegions);
    else setRegions([]);
  };

  const selectRegion = (r: string) => {
    if (selectedCountry) getJobs({ country: selectedCountry, region: r }).then(setJobs);
  };

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
      <JobList jobs={jobs} className="row-[2] col-[2]" />
    </div>
  );
}
