export default function RouteSkeleton() {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-16">
      <div className="h-5 w-36 rounded-lg mb-3 eminence-skeleton" />
      <div className="h-8 w-64 rounded-lg mb-10 eminence-skeleton" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <div className="aspect-[3/4] eminence-skeleton" />
            <div className="pt-3 space-y-2">
              <div className="h-3 w-24 rounded eminence-skeleton" />
              <div className="h-4 w-full rounded eminence-skeleton" />
              <div className="h-3 w-16 rounded eminence-skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
