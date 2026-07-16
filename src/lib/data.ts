import { Product } from "./types";

export const products: Product[] = [
  {
    id: "1", name: "Majestic Oak Dining Table", slug: "majestic-oak-dining-table",
    description: "Handcrafted from solid sheesham wood with a rich walnut finish. Seats 8-10 people comfortably. Each piece is unique with natural grain patterns.",
    price: 84999, compareAtPrice: 99999,
    images: ["https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
    category: "Dining", material: "Sheesham Wood", dimensions: "213 x 91 x 76 cm", color: "Walnut", inStock: true, featured: true, rating: 4.8, reviewCount: 124,
  },
  {
    id: "2", name: "Velvet Empire Sofa", slug: "velvet-empire-sofa",
    description: "Premium velvet upholstery with deep button tufting and solid mango wood frame. Plush foam cushioning for ultimate comfort.",
    price: 124999, compareAtPrice: 149999,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"],
    category: "Living Room", material: "Velvet + Mango Wood", dimensions: "210 x 85 x 75 cm", color: "Emerald Green", inStock: true, featured: true, rating: 4.9, reviewCount: 89,
  },
  {
    id: "3", name: "Artisan Bookshelf Collection", slug: "artisan-bookshelf-collection",
    description: "Modular bookshelf system crafted from reclaimed teak wood. Adjustable shelves with intricate carved details.",
    price: 67999,
    images: ["https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800", "https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=800"],
    category: "Storage", material: "Reclaimed Teak", dimensions: "180 x 35 x 200 cm", color: "Natural Teak", inStock: true, featured: true, rating: 4.7, reviewCount: 56,
  },
  {
    id: "4", name: "Royal Canopy Bed", slug: "royal-canopy-bed",
    description: "Majestic king-size bed frame carved from solid acacia wood. Features a regal canopy design with intricate headboard detailing.",
    price: 189999, compareAtPrice: 219999,
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800", "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"],
    category: "Bedroom", material: "Acacia Wood", dimensions: "213 x 183 x 210 cm", color: "Dark Walnut", inStock: true, featured: true, rating: 4.9, reviewCount: 43,
  },
  {
    id: "5", name: "Marble Coffee Table", slug: "marble-coffee-table",
    description: "Italian marble top on a brushed brass frame. Elegant, timeless design that anchors any living room.",
    price: 45999,
    images: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800", "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800"],
    category: "Living Room", material: "Italian Marble + Brass", dimensions: "120 x 60 x 45 cm", color: "White Marble / Gold", inStock: true, rating: 4.6, reviewCount: 78,
  },
  {
    id: "6", name: "Leather Executive Desk", slug: "leather-executive-desk",
    description: "Premium top-grain leather inlay desk with solid mahogany frame. Brass hardware and hand-polished finish.",
    price: 139999,
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800", "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800"],
    category: "Office", material: "Mahogany + Leather", dimensions: "183 x 91 x 76 cm", color: "Mahogany / Cognac", inStock: true, featured: true, rating: 4.8, reviewCount: 34,
  },
  {
    id: "7", name: "Hand-Knotted Silk Rug", slug: "hand-knotted-silk-rug",
    description: "Pure silk hand-knotted in Varanasi. Traditional pattern with modern color palette. 100 knots per square inch.",
    price: 79999, compareAtPrice: 99999,
    images: ["https://images.unsplash.com/photo-1530731141654-5993c3016c77?w=800", "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800"],
    category: "Decor", material: "Pure Silk", dimensions: "244 x 183 cm", color: "Ivory / Gold", inStock: true, rating: 4.9, reviewCount: 27,
  },
  {
    id: "8", name: "Crystal Chandelier", slug: "crystal-chandelier",
    description: "Bohemian crystal chandelier with hand-polished K9 crystal drops. Gold-finished frame. Dimmable LED compatible.",
    price: 54999,
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=800"],
    category: "Lighting", material: "K9 Crystal + Brass", dimensions: "80 x 80 x 100 cm", color: "Crystal / Gold", inStock: true, rating: 4.7, reviewCount: 52,
  },
  {
    id: "9", name: "Upholstered Wing Chair", slug: "upholstered-wing-chair",
    description: "Classic wingback chair reimagined in rich velvet. Nailhead trim, flared arms, and plush cushioning.",
    price: 45999,
    images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800", "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800"],
    category: "Living Room", material: "Velvet + Hardwood", dimensions: "94 x 85 x 102 cm", color: "Navy Blue", inStock: true, rating: 4.5, reviewCount: 63,
  },
  {
    id: "10", name: "Console Entry Table", slug: "console-entry-table",
    description: "Slim console table in carved mango wood with marble inlay top. Perfect for hallways or entryways.",
    price: 32999,
    images: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800", "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800"],
    category: "Storage", material: "Mango Wood + Marble", dimensions: "120 x 35 x 76 cm", color: "Honey / White", inStock: true, rating: 4.6, reviewCount: 41,
  },
];

export const categories = [
  { name: "All", slug: "all" },
  { name: "Living Room", slug: "living-room" },
  { name: "Dining", slug: "dining" },
  { name: "Bedroom", slug: "bedroom" },
  { name: "Office", slug: "office" },
  { name: "Storage", slug: "storage" },
  { name: "Decor", slug: "decor" },
  { name: "Lighting", slug: "lighting" },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === "all") return products;
  return products.filter(
    (p) => p.category.toLowerCase().replace(/\s+/g, "-") === category
  );
}
