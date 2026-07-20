export default function Loading() {
  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-36 bg-[#e7e7e7] mx-auto" />
        <div className="h-12 bg-[#e7e7e7]" />
        <div className="h-12 bg-[#e7e7e7]" />
        <div className="h-12 w-full bg-[#cf542f]" />
      </div>
    </div>
  );
}
