export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-36 bg-[#e7e7e7]" />
        <div className="space-y-6">
          <div className="h-12 bg-[#e7e7e7]" />
          <div className="h-12 bg-[#e7e7e7]" />
          <div className="h-48 bg-[#e7e7e7]" />
          <div className="h-12 bg-[#e7e7e7]" />
          <div className="h-12 w-48 bg-[#cf542f]" />
        </div>
      </div>
    </div>
  );
}
