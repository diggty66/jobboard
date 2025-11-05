export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-gray-300">
      <div className="w-12 h-12 mb-3 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm">Loading jobs...</p>
    </div>
  );
}
