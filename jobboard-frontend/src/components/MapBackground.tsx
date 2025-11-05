export default function MapBackground() {
  return (
    <div className="fixed inset-0 -z-10 flex items-center justify-center opacity-20 dark:opacity-10 pointer-events-none">
      <svg
        viewBox="0 0 500 250"
        className="w-4/5 max-w-3xl animate-pulse text-blue-300"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M20,150 Q150,80 300,120 T480,140"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="120" cy="110" r="2.5" className="animate-ping" />
        <circle cx="260" cy="130" r="2.5" className="animate-ping" />
        <circle cx="400" cy="125" r="2.5" className="animate-ping" />
      </svg>
    </div>
  );
}
