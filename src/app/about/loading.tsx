export default function Loading() {
  return (
    <div>
      <div className="h-64 md:h-80 bg-gray-200 animate-pulse" />
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-gray-200 animate-pulse" />
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="aspect-[4/3] bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </section>
    </div>
  );
}
