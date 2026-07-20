export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-36 bg-[#e7e7e7]" />
        <div className="h-6 w-64 bg-[#e7e7e7]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/5] bg-[#e7e7e7]" />
              <div className="h-4 w-3/4 bg-[#e7e7e7]" />
              <div className="h-4 w-1/2 bg-[#e7e7e7]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
