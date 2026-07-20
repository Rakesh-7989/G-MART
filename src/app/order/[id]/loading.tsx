export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-full mx-auto mb-6" />
      <div className="h-4 w-24 bg-gray-200 animate-pulse mx-auto mb-3" />
      <div className="h-8 w-64 bg-gray-200 animate-pulse mx-auto mb-4" />
      <div className="h-4 w-80 bg-gray-200 animate-pulse mx-auto mb-2" />
      <div className="h-4 w-96 bg-gray-200 animate-pulse mx-auto mb-8" />
      <div className="bg-gray-100 p-6 text-left mt-8 mb-8 space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-32 bg-gray-200 animate-pulse" />
          <div className="h-5 w-20 bg-gray-200 animate-pulse" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-48 bg-gray-200 animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 animate-pulse" />
          </div>
        ))}
        <div className="border-t border-gray-300 pt-3 flex justify-between">
          <div className="h-5 w-16 bg-gray-200 animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="h-12 w-40 bg-gray-200 animate-pulse" />
        <div className="h-12 w-40 bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
