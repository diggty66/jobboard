// src/App.tsx
import { useEffect, useState } from "react";
import { getCountries, getRegions, getJobs, type Job } from "./api";

import TopNav from "./components/TopNav";
import LeftNav from "./components/LeftNav";
import JobList from "./components/JobList";
import MapBackground from "./components/MapBackground";

const PAGE_SIZE = 100;

export default function App() {
  const [countries, setCountries] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);            // 👈 matches LeftNav Props
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  // Load countries once
  useEffect(() => {
    getCountries()
      .then(setCountries)
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // ---------- Country selection ----------

  const selectCountry = async (country: string | null) => {
    setSelectedCountry(country);
    setSelectedRegion(null);
    setJobs([]);
    setPage(1);

    if (!country) {
      // Back to "All countries" state
      setRegions([]);
      return;
    }

    // For non-Japan, we fetch regions from backend
    try {
      const regionList = await getRegions(country);
      setRegions(regionList);
    } catch (err) {
      console.warn("Error fetching regions, leaving empty:", err);
      setRegions([]);
    }

    let fetched: Job[] = [];

    try {
      switch (country) {
        case "Japan": {
          // Combine GaijinPot + JapanJobs
          const [gaijin, japanjobs] = await Promise.all([
            getJobs({ source: "gaijinpot", country }),
            getJobs({ source: "japanjobs", country }),
          ]);
          fetched = [...gaijin, ...japanjobs];
          break;
        }
        case "USA": {
          // Indeed for USA
          fetched = await getJobs({ source: "indeed", country });
          break;
        }
        default: {
          // Local DB / default for other countries
          fetched = await getJobs({ country });
        }
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
    setAllJobs(fetched);
    setJobs(fetched);
  };

  // ---------- Region selection (prefectures / states / etc.) ----------

    const selectRegion = async (region: string) => {
    setSelectedRegion(region);
    setPage(1);

    if (!selectedCountry) return;

    // client-side filtering of the full dataset
    const regionLower = region.toLowerCase();

    const filtered = allJobs.filter((job) => {
      const jobRegion = (job.region || "").toLowerCase();
      const jobTitle = job.title.toLowerCase();
      return (
        jobRegion.includes(regionLower) ||
        jobTitle.includes(regionLower)
      );
    });

    setJobs(filtered);
  };

  // ---------- Pagination ----------

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const visibleJobs = jobs.slice(startIndex, endIndex);

  return (
    <div className="relative grid h-screen grid-rows-[60px_1fr] grid-cols-[220px_1fr]">
      <MapBackground />

      <TopNav
        onMenuToggle={() => setMenuOpen((open) => !open)}
        className="col-span-2 row-[1]"
      />

      <LeftNav
        countries={countries}
        regions={regions}                    // 👈 now provided
        selectedCountry={selectedCountry}
        onCountrySelect={selectCountry}
        onRegionSelect={selectRegion}
        open={menuOpen}
        setOpen={setMenuOpen}
        className="row-[2] col-[1]"
      />

      <div className="row-[2] col-[2] p-4 flex flex-col">
        <div className="mb-2 text-sm text-gray-600">
          Country:{" "}
          <span className="font-semibold">
            {selectedCountry ?? "All"}
          </span>
          {selectedRegion && (
            <>
              {" "}
              / Region: <span className="font-semibold">{selectedRegion}</span>
            </>
          )}
        </div>

        <JobList jobs={visibleJobs} className="flex-1 overflow-y-auto" />

        <div className="mt-4 flex items-center justify-between">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page} of {totalPages}{" "}
            <span className="text-gray-500">
              ({jobs.length} jobs total, showing {visibleJobs.length})
            </span>
          </span>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
