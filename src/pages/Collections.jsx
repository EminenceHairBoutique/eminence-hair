import { Link } from "react-router-dom";

const COLLECTIONS = [
  {
    id: "sea",
    title: "SEA Collection",
    subtitle: "Fluid movement · Natural luster",
    slug: "sea",
    image: "/gallery/collections/SEA/Eminence_SEA_BodyWave_Natural_01.webp",
  },
  {
    id: "burmese",
    title: "Burmese Collection",
    subtitle: "Defined curls · Density-forward",
    slug: "burmese",
    image: "/gallery/collections/Burmese/Eminence_Burmese_DeepWave_Natural_01.webp",
  },
  {
    id: "lavish",
    title: "Lavish Collection",
    subtitle: "Polished waves · Editorial finish",
    slug: "lavish",
    image: "/gallery/collections/Lavish/Eminence_Lavish_LooseWave_Natural_01.webp",
  },
  {
    id: "straight",
    title: "Straight Collection",
    subtitle: "Ultra-sleek · Minimal silhouette",
    slug: "straight",
    image: "/gallery/collections/Straight/Eminence_Straight_SilkyStraight_Natural_01.webp",
  },
];

export default function Collections() {
  return (
    <div className="pt-28 pb-24 bg-[#FBF6ED]">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-light mb-14">Collections</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.id}
              to={`/collections/${c.slug}`}
              className="group"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-[0_18px_40px_rgba(15,10,5,0.22)]">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4">
                <p className="text-sm text-neutral-900">{c.title}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {c.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
