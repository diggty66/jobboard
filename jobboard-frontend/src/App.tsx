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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Load countries once
  useEffect(() => {
    getCountries().then(setCountries);
  }, []);

  const selectCountry = async (country: string | null) => {
  setSelectedCountry(country);
  setSelectedRegion(null);
  setJobs([]);

  if (country) {
    const regionList = await getRegions(country);
    setRegions(regionList);

    let fetchedJobs: Job[] = [];

    try {
      switch (country) {
        case "Japan":
          const [gaijin, japanjobs] = await Promise.all([
            getJobs({ source: "gaijinpot", country }),
            getJobs({ source: "japanjobs", country }),
          ]);
          fetchedJobs = [...gaijin, ...japanjobs];
          break;

        case "USA":
          fetchedJobs = await getJobs({ source: "indeed", country });
          break;

        case "Germany":
          fetchedJobs = await getJobs({ country });
          break;

        default:
          fetchedJobs = await getJobs({ country });
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }

    setJobs(fetchedJobs);
  } else {
    setRegions([]);
  }
};

  const selectRegion = async (region: string) => {
  setSelectedRegion(region);

  if (!selectedCountry) return;

  let fetchedJobs: Job[] = [];

  try {
    switch (selectedCountry) {
      case "Japan":
        // Combine both Japan sources
        const [gaijin, japanjobs] = await Promise.all([
          getJobs({ source: "gaijinpot", country: selectedCountry, region }),
          getJobs({ source: "japanjobs", country: selectedCountry, region }),
        ]);
        fetchedJobs = [...gaijin, ...japanjobs];
        break;

      case "USA":
        // Indeed only
        fetchedJobs = await getJobs({ source: "indeed", country: selectedCountry, region });
        break;

      case "Germany":
        // Local DB or future EU source
        fetchedJobs = await getJobs({ country: selectedCountry, region });
        break;

      default:
        fetchedJobs = await getJobs({ country: selectedCountry, region });
    }
  } catch (err) {
    console.error("Error fetching jobs:", err);
  }

  setJobs(fetchedJobs);
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
