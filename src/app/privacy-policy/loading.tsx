export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12 space-y-3">
        <div className="h-4 w-20 bg-gray-200 animate-pulse mx-auto" />
        <div className="h-8 w-64 bg-gray-200 animate-pulse mx-auto" />
      </div>
      <div className="space-y-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 animate-pulse" />
            <div className="h-4 w-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
