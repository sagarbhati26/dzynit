import Link from "next/link";

export default function Hero() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center py-10">
      <div>
        <h1 className="text-5xl font-display font-semibold leading-tight">
          Design. Publish. Sell.
        </h1>
        <p className="mt-4 text-lg text-muted max-w-xl">
          DzynIt is a minimalist studio for creators — design premium tees &
          hoodies, save drafts, and publish to the marketplace.
        </p>

        <div className="mt-8 flex gap-3">
          <Link href="/dzyn">
            <button className="px-5 py-3 rounded-lg bg-ink text-white shadow-sm">
              Start Designing
            </button>
          </Link>
          <Link href="/marketplace">
            <button className="px-5 py-3 rounded-lg border border-ink text-ink">
              Explore Marketplace
            </button>
          </Link>
        </div>
      </div>
      <div className="rounded-2xl card-glass p-6 soft-shadow">
        <div className="relative h-80 flex items-center justify-center">
          <div className="w-48 h-56 bg-white rounded-lg soft-shadow flex items-center justify-center">
            <div className="text-muted">T-SHIRT MOCKUP</div>
          </div>
        </div>
      </div>
    </section>
  );
}