export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-[3/4] skeleton mb-4" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-20 skeleton" />
            ))}
          </div>
        </div>

        <div>
          <div className="h-4 w-24 skeleton mb-2" />
          <div className="h-10 w-3/4 skeleton mb-4" />
          <div className="h-4 w-32 skeleton mb-4" />
          <div className="h-8 w-48 skeleton mb-6" />
          <div className="space-y-2 mb-6">
            <div className="h-4 skeleton" />
            <div className="h-4 skeleton" />
            <div className="h-4 w-2/3 skeleton" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="h-16 skeleton" />
            <div className="h-16 skeleton" />
          </div>
          <div className="h-12 skeleton mb-3" />
          <div className="h-12 skeleton" />
        </div>
      </div>
    </div>
  );
}
