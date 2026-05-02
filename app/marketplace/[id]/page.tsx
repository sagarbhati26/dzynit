import Link from "next/link";
import { notFound } from "next/navigation";
import { marketplaceDesigns } from "@/lib/marketplaceData";

type MarketplaceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketplaceDetailPage({
  params,
}: MarketplaceDetailPageProps) {
  const { id } = await params;
  const designId = Number(id);
  const design = marketplaceDesigns.find((item) => item.id === designId);

  if (!design) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
        >
          <span aria-hidden>←</span>
          Back to Marketplace
        </Link>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card-glass rounded-2xl p-6 soft-shadow">
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
              <div className="w-48 h-56 bg-white rounded-lg soft-shadow flex items-center justify-center">
                <span className="text-muted text-sm">Design Preview</span>
              </div>
            </div>
          </div>

          <div className="card-glass rounded-2xl p-6 soft-shadow">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold">
              {design.category}
            </div>
            <h1 className="text-3xl font-bold mt-2">{design.title}</h1>
            <p className="text-muted mt-2">by {design.creator}</p>

            <div className="mt-6 text-3xl font-semibold text-primary">
              ${design.price.toFixed(2)}
            </div>

            <p className="mt-4 text-muted leading-relaxed">{design.description}</p>

            <div className="mt-6 space-y-4">
              <div>
                <h2 className="text-sm font-semibold mb-2">Available sizes</h2>
                <div className="flex flex-wrap gap-2">
                  {design.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-3 py-1.5 rounded-lg border border-border text-sm bg-background/50"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold mb-2">Available colors</h2>
                <div className="flex flex-wrap gap-2">
                  {design.colors.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1.5 rounded-lg border border-border text-sm bg-background/50"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="text-sm text-muted">{design.likes} likes</span>
              <Link href="/dzyn">
                <button className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                  Create Similar Style
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
