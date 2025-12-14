import { useParams, Link } from "react-router-dom";
import products from "../data/products";

const COLLECTION_META = {
  sea: {
    title: "SEA Collection",
    description:
      "Fluid textures sourced from SEA donors, selected for softness, movement, and longevity.",
  },
  burmese: {
    title: "Burmese Collection",
    description:
      "Rich curl definition with exceptional density and durability.",
  },
  lavish: {
    title: "Lavish Collection",
    description:
      "Polished wave patterns with an editorial, high-gloss finish.",
  },
  straight: {
    title: "Straight Collection",
    description:
      "Ultra-sleek raw straight textures with natural sheen and flow.",
  },
};

export default function CollectionDetail() {
  const { slug } = useParams();
  const meta = COLLECTION_META[slug];

  const collectionProducts = products.filter((p) =>
    p.collection.toLowerCase().includes(meta?.title.split(" ")[0].toLowerCase())
  );

  if (!meta) {
    return (
      <div className="pt-32 text-center text-neutral-600">
        Collection not found.
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-[#FBF6ED]">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-light">{meta.title}</h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-600">
          {meta.description}
        </p>

        <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {collectionProducts.map((p) => (
            <Link
              key={p.slug}
              to={`/products/${p.slug}`}
              className="group"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-[0_18px_40px_rgba(15,10,5,0.22)]">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                  {p.collection}
                </p>
                <p className="text-sm text-neutral-900">{p.name}</p>
                <p className="text-xs text-neutral-600">{p.texture}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
