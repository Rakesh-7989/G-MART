export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-8 bg-[#efefef] w-40 mb-10" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-2">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-10 bg-[#efefef]" />
          ))}
        </div>
        <div className="md:col-span-3">
          <div className="h-64 bg-[#efefef]" />
        </div>
      </div>
    </div>
  );
}
