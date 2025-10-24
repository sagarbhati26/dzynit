import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Hero />
      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass rounded-2xl p-6 soft-shadow">
          <h3 className="text-lg font-semibold">Design Studio</h3>
          <p className="mt-3 text-sm text-muted">
            Create your own tee/hoodie with a powerful in-browser editor.
          </p>
        </div>
        <div className="card-glass rounded-2xl p-6 soft-shadow">
          <h3 className="text-lg font-semibold">Marketplace</h3>
          <p className="mt-3 text-sm text-muted">
            Browse community designs and buy unique pieces.
          </p>
        </div>
        <div className="card-glass rounded-2xl p-6 soft-shadow">
          <h3 className="text-lg font-semibold">Your Profile</h3>
          <p className="mt-3 text-sm text-muted">
            Save drafts, publish designs and track sales (coming soon).
          </p>
        </div>
      </section>
    </div>
  );
}