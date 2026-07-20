export default function Loading() {
  return (
    <div>
      <div className="h-64 md:h-80 bg-gray-200 animate-pulse" />
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-3">
          <div className="h-4 w-40 bg-gray-200 animate-pulse mx-auto" />
          <div className="h-8 w-56 bg-gray-200 animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="text-center p-6 space-y-3">
              <div className="h-10 w-10 bg-gray-200 animate-pulse mx-auto rounded" />
              <div className="h-5 w-32 bg-gray-200 animate-pulse mx-auto" />
              <div className="h-4 w-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
