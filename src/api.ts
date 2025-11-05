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

export async function getCountries(): Promise<string[]> {
  return ["Japan", "USA", "Germany"];
}

export async function getRegions(country: string): Promise<string[]> {
  const regions: Record<string, string[]> = {
    Japan: ["Tokyo", "Osaka"],
    USA: ["New Jersey", "California"],
    Germany: ["Berlin", "Hamburg"],
  };
  return regions[country] || [];
}

export async function getJobs(_: Record<string, string>): Promise<Job[]> {
  return [
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
}
