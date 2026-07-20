export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-[#efefef] w-48 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] bg-[#efefef] mb-3" />
            <div className="h-4 bg-[#efefef] w-3/4 mb-2" />
            <div className="h-4 bg-[#efefef] w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
