export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-line border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted text-sm">Loading G-MART...</p>
      </div>
    </div>
  );
}
