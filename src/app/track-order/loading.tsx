export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12 space-y-3">
        <div className="h-4 w-24 bg-gray-200 animate-pulse mx-auto" />
        <div className="h-8 w-64 bg-gray-200 animate-pulse mx-auto" />
        <div className="h-4 w-72 bg-gray-200 animate-pulse mx-auto" />
      </div>
      <div className="max-w-sm mx-auto space-y-4 mb-12">
        <div className="h-12 w-full bg-gray-200 animate-pulse" />
        <div className="h-12 w-full bg-gray-200 animate-pulse" />
        <div className="h-12 w-full bg-gray-200 animate-pulse" />
      </div>
      <div className="border border-gray-200 p-6 max-w-sm mx-auto space-y-4">
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-gray-200 animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 animate-pulse" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-3/4 bg-gray-200 animate-pulse" />
        ))}
        <div className="border-t border-gray-200 pt-4">
          <div className="h-3 w-12 bg-gray-200 animate-pulse mb-2" />
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
