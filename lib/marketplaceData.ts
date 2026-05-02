export type MarketplaceDesign = {
  id: number;
  title: string;
  creator: string;
  price: number;
  category: string;
  likes: number;
  description: string;
  sizes: string[];
  colors: string[];
  tags: string[];
};

export const marketplaceDesigns: MarketplaceDesign[] = [
  {
    id: 1,
    title: "Abstract Waves",
    creator: "Alex Chen",
    price: 24.99,
    category: "Abstract",
    likes: 124,
    description:
      "Fluid wave forms blended in high-contrast indigo and violet tones for an energetic streetwear look.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    tags: ["modern", "wave", "bold"],
  },
  {
    id: 2,
    title: "Mountain Sunset",
    creator: "Jamie Smith",
    price: 19.99,
    category: "Nature",
    likes: 89,
    description:
      "A calm mountain silhouette with a warm dusk gradient that works well for casual and travel-themed fits.",
    sizes: ["S", "M", "L"],
    colors: ["Cream", "Olive", "Black"],
    tags: ["nature", "sunset", "minimal"],
  },
  {
    id: 3,
    title: "Geometric Pattern",
    creator: "Taylor Wong",
    price: 22.99,
    category: "Geometric",
    likes: 67,
    description:
      "Precision-focused line and shape composition with symmetry-driven details for a clean technical aesthetic.",
    sizes: ["M", "L", "XL"],
    colors: ["White", "Black"],
    tags: ["geometry", "clean", "tech"],
  },
  {
    id: 4,
    title: "Vintage Typography",
    creator: "Morgan Lee",
    price: 18.99,
    category: "Typography",
    likes: 112,
    description:
      "Retro-inspired type treatment with subtle distressing and classic print-shop rhythm.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Heather Gray", "Black"],
    tags: ["retro", "type", "vintage"],
  },
  {
    id: 5,
    title: "Space Explorer",
    creator: "Casey Johnson",
    price: 26.99,
    category: "Space",
    likes: 95,
    description:
      "Planetary glyphs and orbital accents designed for futuristic collections and sci-fi fans.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Purple", "Navy"],
    tags: ["space", "future", "sci-fi"],
  },
  {
    id: 6,
    title: "Floral Dreams",
    creator: "Jordan Rivera",
    price: 21.99,
    category: "Nature",
    likes: 78,
    description:
      "Soft botanical motifs with pastel accents, tuned for a light and expressive everyday style.",
    sizes: ["S", "M", "L"],
    colors: ["White", "Blush"],
    tags: ["floral", "soft", "nature"],
  },
  {
    id: 7,
    title: "Urban Sketch",
    creator: "Riley Cooper",
    price: 23.99,
    category: "Urban",
    likes: 56,
    description:
      "Marker-style city linework and layered strokes inspired by fast street sketching.",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Stone", "Charcoal"],
    tags: ["urban", "street", "art"],
  },
  {
    id: 8,
    title: "Minimalist Lines",
    creator: "Quinn Adams",
    price: 17.99,
    category: "Minimalist",
    likes: 103,
    description:
      "Ultra-clean linear composition with balanced negative space for a premium minimal finish.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Sand"],
    tags: ["minimal", "line", "clean"],
  },
];

export const marketplaceCategories = [
  "All",
  ...new Set(marketplaceDesigns.map((design) => design.category)),
];
