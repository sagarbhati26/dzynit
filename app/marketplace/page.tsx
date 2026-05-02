"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { marketplaceCategories, marketplaceDesigns } from "@/lib/marketplaceData";

type SortOption = "popular" | "price-low-high" | "price-high-low" | "newest";

const sortLabels: Record<SortOption, string> = {
  popular: "Most Popular",
  "price-low-high": "Price: Low to High",
  "price-high-low": "Price: High to Low",
  newest: "Newest",
};

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [likedDesignIds, setLikedDesignIds] = useState<number[]>([]);

  const filteredDesigns = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = marketplaceDesigns.filter((design) => {
      const matchesCategory =
        activeCategory === "All" || design.category === activeCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        design.title.toLowerCase().includes(normalizedQuery) ||
        design.creator.toLowerCase().includes(normalizedQuery) ||
        design.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered];
    if (sortBy === "popular") {
      sorted.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "price-low-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted.sort((a, b) => b.id - a.id);
    }

    return sorted;
  }, [activeCategory, searchQuery, sortBy]);

  const toggleLike = (designId: number) => {
    setLikedDesignIds((prev) =>
      prev.includes(designId)
        ? prev.filter((id) => id !== designId)
        : [...prev, designId]
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Design Marketplace</h1>
          <p className="text-muted max-w-2xl mx-auto">
            Browse community designs, discover trending styles, and open any design to view details before creating your own.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap gap-2">
            {marketplaceCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === activeCategory
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
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
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

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="px-4 py-2 rounded-lg border border-border bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-sm"
          >
            {(Object.keys(sortLabels) as SortOption[]).map((option) => (
              <option key={option} value={option}>
                {sortLabels[option]}
              </option>
            ))}
          </select>
        </div>

        {/* Design Grid */}
        {filteredDesigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => {
              const isLiked = likedDesignIds.includes(design.id);
              const displayLikes = design.likes + (isLiked ? 1 : 0);
              return (
                <div
                  key={design.id}
                  className="card-glass rounded-xl soft-shadow overflow-hidden transition-all hover:translate-y-[-4px]"
                >
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 relative">
                {/* Design preview */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-40 bg-white rounded-md soft-shadow flex items-center justify-center">
                    <div className="text-xs text-muted">Design Preview</div>
                  </div>
                </div>
                
                {/* Like button */}
                <button
                  onClick={() => toggleLike(design.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-colors ${
                    isLiked ? "text-primary" : "text-muted hover:text-primary"
                  }`}
                  aria-label={isLiked ? "Unlike design" : "Like design"}
                >
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
                  <div className="font-semibold text-primary">${design.price.toFixed(2)}</div>
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
                    {displayLikes}
                  </div>
                </div>
                
                <Link href={`/marketplace/${design.id}`}>
                  <button className="w-full mt-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                    View Design
                  </button>
                </Link>
              </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card-glass rounded-xl p-10 soft-shadow text-center">
            <h3 className="text-xl font-semibold">No results found</h3>
            <p className="text-muted mt-2">
              Try changing search terms, category, or sorting to discover more designs.
            </p>
          </div>
        )}
        
        {/* Create your own CTA */}
        <div className="mt-16 card-glass rounded-xl p-8 soft-shadow text-center">
          <h2 className="text-2xl font-bold mb-3">Can&apos;t find what you&apos;re looking for?</h2>
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