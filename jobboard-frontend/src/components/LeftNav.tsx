import { useEffect, useState } from "react";

interface Props {
  countries: string[];
  regions: string[];
  selectedCountry: string | null;
  onCountrySelect: (c: string | null) => void;
  onRegionSelect: (r: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  className?: string;
}

export default function LeftNav({
  countries,
  regions,
  selectedCountry,
  onCountrySelect,
  onRegionSelect,
  open,
  setOpen,
  className = "",
}: Props) {
  const [animation, setAnimation] = useState("animate-fadeIn");

  useEffect(() => {
    setAnimation(selectedCountry ? "animate-slideLeft" : "animate-slideRight");
  }, [selectedCountry]);

    function flagEmoji(country: string): string {
    const code = country
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .split("")
        .map((char) => 127397 + char.charCodeAt(0))
        .map((n) => String.fromCodePoint(n))
        .join("");
    return code;
    }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <aside
        className={`bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                    transform transition-transform duration-300 
                    ${open ? "translate-x-0" : "-translate-x-full"} 
                    sm:translate-x-0 ${animation} ${className}`}
      >
        <div className="absolute top-[18px] left-0 w-full border-b border-gray-200 dark:border-gray-700" />

        <div className="p-4">
            {!selectedCountry ? (
            countries.map((c) => (
                <div
                key={c}
                onClick={() => onCountrySelect(c)}
                className="cursor-pointer rounded px-2 py-1 hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center space-x-2"
                >
                <span>{flagEmoji(c)}</span>
                <span>{c}</span>
                </div>
            ))
            ) : (
            <>
                <div
                onClick={() => onCountrySelect(null)}
                className="mb-2 cursor-pointer text-blue-600 dark:text-blue-400"
                >
                ← All Countries
                </div>
                {regions.map((r) => (
                <div
                    key={r}
                    onClick={() => onRegionSelect(r)}
                    className="cursor-pointer rounded px-2 py-1 hover:bg-blue-100 dark:hover:bg-blue-900 flex items-center space-x-2"
                >
                    <span className="text-sm">🏙️</span>
                    <span>{r}</span>
                </div>
                ))}
            </>
            )}
        </div>
    </aside>
    </>
  );
}
