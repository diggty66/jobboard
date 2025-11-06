import { useState, useEffect } from "react";

export function useBackendStatus(apiUrl: string) {
  const [online, setOnline] = useState<boolean | null>(null);

  async function checkStatus() {
    try {
      const res = await fetch(`${apiUrl}/health`);
      if (res.ok) setOnline(true);
      else setOnline(false);
    } catch {
      setOnline(false);
    }
  }

  useEffect(() => {
    checkStatus(); // initial check
    const interval = setInterval(checkStatus, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  return online;
}
