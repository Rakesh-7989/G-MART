export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12 space-y-3">
        <div className="h-4 w-40 bg-gray-200 animate-pulse mx-auto" />
        <div className="h-8 w-48 bg-gray-200 animate-pulse mx-auto" />
        <div className="h-4 w-72 bg-gray-200 animate-pulse mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[16/9] bg-gray-200 animate-pulse rounded-lg mb-4" />
            <div className="h-3 w-24 bg-gray-200 animate-pulse mb-2" />
            <div className="h-5 w-full bg-gray-200 animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse mb-1" />
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
