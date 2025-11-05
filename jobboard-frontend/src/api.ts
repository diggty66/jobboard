// src/api.ts
// ============================

export interface Job {
  id: number;
  title: string;
  country: string;
  region: string;
  visa_type: string;
  salary: number;
  currency: string;
  description: string;
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
  },
];

// ========== API Functions ==========

export async function getCountries(): Promise<string[]> {
  // Try live API if available
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/countries`);
      if (res.ok) return res.json();
    } catch {
      console.warn("Falling back to mock countries data");
    }
  }
  // Fallback
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

export async function getJobs(params: Record<string, string>): Promise<Job[]> {
  if (API_URL) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/jobs?${query}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    } catch {
      console.warn("Falling back to mock job data");
    }
  }
  return mockJobs;
}
