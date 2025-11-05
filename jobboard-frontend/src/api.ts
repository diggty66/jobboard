// src/api.ts
// ============================

export interface Job {
  id: number | string;
  title: string;
  country: string;
  region: string;
  visa_type: string;
  salary: number;
  currency: string;
  description: string;
  apply_url?: string; // optional in case older data doesn’t have it
}

// Get environment variable safely
const API_URL = import.meta.env.VITE_API_URL;

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

// ========== API Functions ==========

export async function getCountries(): Promise<string[]> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/countries`);
      if (res.ok) return res.json();
    } catch {
      console.warn("Falling back to mock countries data");
    }
  }
  return mockCountries;
}

export async function getRegions(country: string): Promise<string[]> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/regions?country=${country}`);
      if (res.ok) return res.json();
    } catch {
      console.warn("Falling back to mock regions data");
    }
  }
  return mockRegions[country] || [];
}

export async function getJobs(params: Record<string, string> = {}): Promise<Job[]> {
  if (API_URL) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/jobs${query ? `?${query}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    } catch {
      console.warn("Falling back to mock job data");
    }
  }
  return mockJobs;
}

export async function getJobById(id: number): Promise<Job | null> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`);
      if (res.ok) return res.json();
    } catch {
      console.warn("Failed to fetch job details, falling back to mock");
    }
  }
  return mockJobs.find((j) => j.id === id) || null;
}

// --- External APIs ---

export async function getIndeedJobs(): Promise<Job[]> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/indeed/jobs`);
      if (res.ok) return res.json();
    } catch {
      console.warn("Failed to fetch Indeed jobs");
    }
  }
  return mockJobs;
}

export async function getJapanJobs(): Promise<Job[]> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/japanjobs/jobs`);
      if (res.ok) return res.json();
    } catch {
      console.warn("Failed to fetch JapanJobs");
    }
  }
  return mockJobs;
}

export async function getGaijinpotJobs(): Promise<Job[]> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/gaijinpot/jobs`);
      if (res.ok) return res.json();
    } catch {
      console.warn("Failed to fetch GaijinPot jobs");
    }
  }
  return mockJobs;
}

// --- Aggregate (All Sources Combined) ---
export async function getAllJobs(): Promise<Job[]> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/aggregate/all`);
      if (res.ok) return res.json();
    } catch {
      console.warn("Falling back to mock job data");
    }
  }
  return mockJobs;
}
