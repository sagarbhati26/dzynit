import Link from "next/link";

// Mock data for marketplace designs
const designs = [
  { id: 1, title: "Abstract Waves", creator: "Alex Chen", price: "$24.99", category: "Abstract", likes: 124 },
  { id: 2, title: "Mountain Sunset", creator: "Jamie Smith", price: "$19.99", category: "Nature", likes: 89 },
  { id: 3, title: "Geometric Pattern", creator: "Taylor Wong", price: "$22.99", category: "Geometric", likes: 67 },
  { id: 4, title: "Vintage Typography", creator: "Morgan Lee", price: "$18.99", category: "Typography", likes: 112 },
  { id: 5, title: "Space Explorer", creator: "Casey Johnson", price: "$26.99", category: "Space", likes: 95 },
  { id: 6, title: "Floral Dreams", creator: "Jordan Rivera", price: "$21.99", category: "Nature", likes: 78 },
  { id: 7, title: "Urban Sketch", creator: "Riley Cooper", price: "$23.99", category: "Urban", likes: 56 },
  { id: 8, title: "Minimalist Lines", creator: "Quinn Adams", price: "$17.99", category: "Minimalist", likes: 103 },
];

// Categories for filtering
const categories = ["All", "Abstract", "Nature", "Geometric", "Typography", "Space", "Urban", "Minimalist"];

export default function MarketplacePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Design Marketplace</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Browse and purchase unique designs created by our community of talented designers.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "All"
                    ? "bg-primary text-white"
                    : "bg-background border border-border hover:border-primary/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search designs..."
              className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all w-full md:w-64"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>

        {/* Design Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {designs.map((design) => (
            <div key={design.id} className="card-glass rounded-xl soft-shadow overflow-hidden transition-all hover:translate-y-[-4px]">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 relative">
                {/* Design preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-40 bg-white rounded-md soft-shadow flex items-center justify-center">
                    <div className="text-xs text-muted">Design Preview</div>
                  </div>
                </div>
                
                {/* Like button */}
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </button>
                
                {/* Category tag */}
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium">
                  {design.category}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium">{design.title}</h3>
                <p className="text-sm text-muted mt-1">by {design.creator}</p>
                
                <div className="mt-3 flex items-center justify-between">
                  <div className="font-semibold text-primary">{design.price}</div>
                  <div className="text-xs text-muted flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                    {design.likes}
                  </div>
                </div>
                
                <Link href={`/marketplace/${design.id}`}>
                  <button className="w-full mt-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                    View Design
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Create your own CTA */}
        <div className="mt-16 card-glass rounded-xl p-8 soft-shadow text-center">
          <h2 className="text-2xl font-bold mb-3">Can't find what you're looking for?</h2>
          <p className="text-muted max-w-2xl mx-auto mb-6">
            Create your own custom design in our easy-to-use design studio.
          </p>
          <Link href="/dzyn">
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-colors">
              Create Your Own Design
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}