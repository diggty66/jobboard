// src/api.ts
// ============================

export interface Job {
  id: number | string;
  title: string;
  country?: string;
  region?: string;
  visa_type?: string;
  salary?: number;
  currency?: string;
  description?: string;
  company?: string;
  apply_url?: string;
}

type JobSource = "local" | "indeed" | "japanjobs" | "gaijinpot" | "all";

interface GetJobsParams {
  source?: JobSource;
  country?: string;
  region?: string;
}

// Get environment variable safely
const API_URL = import.meta.env.VITE_API_URL ?? "";

// ========== Mock Data ==========
const mockCountries = ["Japan", "USA", "Germany"];
const mockRegions: Record<string, string[]> = {
  Japan: ["Tokyo", "Osaka"],
  USA: ["New Jersey", "California"],
  Germany: ["Berlin", "Hamburg"],
};
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    country: "Japan",
    region: "Tokyo",
    visa_type: "Work Visa",
    salary: 85000,
    currency: "USD",
    description: "Develop and maintain scalable applications.",
    apply_url: "https://example.com/apply/software-engineer",
  },
];

// Helper to build full URL
function buildUrl(path: string, params?: Record<string, string | undefined>) {
  const query = params
    ? new URLSearchParams(
        Object.entries(params).reduce((acc, [k, v]) => {
          if (v != null && v !== "") acc[k] = v;
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";

  return `${API_URL}${path}${query ? `?${query}` : ""}`;
}

// ========== API Functions ==========

export async function getCountries(): Promise<string[]> {
  if (API_URL) {
    try {
      const res = await fetch(buildUrl("/api/countries"));
      if (res.ok) return res.json();
    } catch (err) {
      console.warn("Falling back to mock countries data", err);
    }
  }
  return mockCountries;
}

export async function getRegions(country: string): Promise<string[]> {
  if (API_URL) {
    try {
      const res = await fetch(buildUrl("/api/regions", { country }));
      if (res.ok) return res.json();
    } catch (err) {
      console.warn("Falling back to mock regions data", err);
    }
  }
  return mockRegions[country] || [];
}

export async function getJobs(params: GetJobsParams = {}): Promise<Job[]> {
  // If there's no API URL at all, we're in pure mock mode
  if (!API_URL) {
    return mockJobs;
  }

  try {
    let endpoint = "/api/jobs"; // default local DB

    switch (params.source) {
      case "gaijinpot":
        endpoint = "/api/gaijinpot/jobs";
        break;
      case "japanjobs":
        endpoint = "/api/japanjobs/jobs";
        break;
      case "indeed":
        endpoint = "/api/indeed/jobs";
        break;
      case "all":
        endpoint = "/api/aggregate/all";
        break;
      case "local":
      case undefined:
        endpoint = "/api/jobs";
        break;
    }

    const { country, region } = params;

    const res = await fetch(
      buildUrl(endpoint, {
        country,
        region,
      })
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch jobs from ${endpoint} (status ${res.status})`);
    }

    return res.json();
  } catch (error) {
    console.warn("Error fetching jobs:", error);

    // If the backend is reachable but a specific source fails,
    // don't inject mock data for external APIs — just say "no jobs".
    if (params.source && params.source !== "local") {
      return [];
    }

    // For local DB / generic, you *may* still want a mock for demo
    return mockJobs;
  }
}

export async function getJobById(id: number | string): Promise<Job | null> {
  if (API_URL) {
    try {
      const res = await fetch(buildUrl(`/api/jobs/${id}`));
      if (res.ok) return res.json();
    } catch (err) {
      console.warn("Failed to fetch job details, falling back to mock", err);
    }
  }
  return mockJobs.find((j) => j.id === id) || null;
}
