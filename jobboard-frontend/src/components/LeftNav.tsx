import { japanRegions } from "../data/japanRegions";
import { useState, useEffect } from "react";

interface Props {
  countries: string[];
  selectedCountry: string | null;
  onCountrySelect: (c: string | null) => void;
  onRegionSelect: (r: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  className?: string;
}

export default function LeftNav({
  countries,
  selectedCountry,
  onCountrySelect,
  onRegionSelect,
  open,
  setOpen,
  className = "",
}: Props) {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [animation, setAnimation] = useState("animate-fadeIn");

  useEffect(() => {
    setAnimation(selectedCountry ? "animate-slideLeft" : "animate-slideRight");
  }, [selectedCountry]);

  const flagEmoji = (country: string): string =>
    country
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .split("")
      .map((c) => 127397 + c.charCodeAt(0))
      .map((n) => String.fromCodePoint(n))
      .join("");

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setOpen(false)}
        />
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

              {/* Japan region / prefecture drill-down */}
              {selectedCountry === "Japan" &&
                japanRegions.map((region) => (
                  <div key={region.code}>
                    <div
                      className="cursor-pointer font-semibold text-blue-700 dark:text-blue-300 hover:underline"
                      onClick={() =>
                        setExpandedRegion(
                          expandedRegion === region.code ? null : region.code
                        )
                      }
                    >
                      {expandedRegion === region.code ? "▼" : "▶"} {region.name}
                    </div>
                    {expandedRegion === region.code && (
                      <ul className="ml-4 mt-1">
                        {region.prefectures.map((p) => (
                          <li
                            key={p.code}
                            onClick={() => onRegionSelect(p.code)}
                            className="cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {p.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
