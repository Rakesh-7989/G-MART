export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="h-4 w-32 bg-gray-200 animate-pulse mb-8" />
      <div className="h-3 w-28 bg-gray-200 animate-pulse mb-2" />
      <div className="h-8 w-3/4 bg-gray-200 animate-pulse mb-4" />
      <div className="h-4 w-48 bg-gray-200 animate-pulse mb-8" />
      <div className="aspect-[16/9] bg-gray-200 animate-pulse rounded-lg mb-8" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-5/6 bg-gray-200 animate-pulse" />
        <div className="h-4 w-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-3/4 bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
