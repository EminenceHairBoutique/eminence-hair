export default function RouteSkeleton() {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-neutral-200 rounded mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-3xl bg-neutral-200"
          />
        ))}
      </div>
    </div>
  );
}
