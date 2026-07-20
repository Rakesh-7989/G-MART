export default function CartLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="h-9 w-64 skeleton mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-6 pb-6">
              <div className="w-24 h-24 skeleton flex-shrink-0" />
              <div className="flex-1">
                <div className="h-5 w-48 skeleton mb-2" />
                <div className="h-4 w-20 skeleton mb-3" />
                <div className="h-8 w-32 skeleton" />
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-[#efefef] p-8">
            <div className="h-6 w-36 skeleton mb-6" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-20 skeleton" />
                <div className="h-4 w-24 skeleton" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-20 skeleton" />
                <div className="h-4 w-16 skeleton" />
              </div>
              <div className="border-t pt-3 flex justify-between">
                <div className="h-6 w-16 skeleton" />
                <div className="h-6 w-24 skeleton" />
              </div>
            </div>
            <div className="h-12 skeleton mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
