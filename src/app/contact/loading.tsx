export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-[#e7e7e7]" />
        <div className="h-5 w-96 bg-[#e7e7e7]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-32 bg-[#e7e7e7]" />
            <div className="h-32 bg-[#e7e7e7]" />
          </div>
          <div className="space-y-4">
            <div className="h-12 bg-[#e7e7e7]" />
            <div className="h-12 bg-[#e7e7e7]" />
            <div className="h-24 bg-[#e7e7e7]" />
            <div className="h-12 w-32 bg-[#cf542f]" />
          </div>
        </div>
      </div>
    </div>
  );
}
