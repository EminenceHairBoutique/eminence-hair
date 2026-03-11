export default function RouteSkeleton() {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto">
      <div className="h-8 w-48 rounded mb-6 eminence-skeleton" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-3xl eminence-skeleton"
          />
        ))}
      </div>
    </div>
  );
}
