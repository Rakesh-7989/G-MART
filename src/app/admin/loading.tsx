export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="animate-pulse space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-[#e7e7e7]" />
          <div className="h-10 w-32 bg-[#e7e7e7]" />
        </div>
        <div className="flex gap-6">
          {[1,2,3].map((i) => (
            <div key={i} className="h-10 w-28 bg-[#e7e7e7]" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-10 w-24 bg-[#e7e7e7]" />
              <div className="h-8 w-32 bg-[#e7e7e7]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
