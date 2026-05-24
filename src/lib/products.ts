export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  categorySlug: 'veg-pickles' | 'non-veg-pickles';
  weight: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  spice: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    slug: "beef-pickle",
    name: "Beef Pickle",
    category: "Non-Veg Pickle",
    categorySlug: "non-veg-pickles",
    weight: "500g",
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviews: 156,
    image: "/images/products/beef.png",
    badge: "Best Seller",
    spice: "Medium Hot",
    description: "Authentic Kerala style Beef Pickle made with premium cuts of beef, slow-cooked with traditional spices and preserved in pure gingelly oil. A must-have for meat lovers."
  },
  {
    id: 2,
    slug: "fish-pickle",
    name: "Fish Pickle",
    category: "Non-Veg Pickle",
    categorySlug: "non-veg-pickles",
    weight: "500g",
    price: 329,
    originalPrice: 429,
    rating: 4.8,
    reviews: 98,
    image: "/images/products/fish.png",
    badge: "Popular",
    spice: "Hot",
    description: "Spicy and tangy Fish Pickle prepared with fresh catch, marinated in a blend of Kerala spices. Perfect accompaniment for rice and fish curry."
  },
  {
    id: 3,
    slug: "lemon-dates-pickle",
    name: "Lemon & Dates Pickle",
    category: "Veg Pickle",
    categorySlug: "veg-pickles",
    weight: "500g",
    price: 299,
    originalPrice: 399,
    rating: 4.7,
    reviews: 64,
    image: "/images/products/lemon-dates.png",
    badge: "New Arrival",
    spice: "Mild",
    description: "A unique sweet and spicy combination of tangy lemons and premium dates. This pickle is the perfect balance of flavors and a great side for Biryani."
  },
  {
    id: 4,
    slug: "mango-dates-pickle",
    name: "Mango & Dates Pickle",
    category: "Veg Pickle",
    categorySlug: "veg-pickles",
    weight: "500g",
    price: 319,
    originalPrice: 419,
    rating: 4.9,
    reviews: 210,
    image: "/images/products/mango-dates.png",
    badge: "Premium",
    spice: "Medium",
    description: "Traditional Kerala Mango Pickle infused with the sweetness of dates. Made using grandmother's secret recipe for that authentic homemade taste."
  },
  {
    id: 5,
    slug: "garlic-pickle",
    name: "Spicy Garlic Pickle",
    category: "Veg Pickle",
    categorySlug: "veg-pickles",
    weight: "400g",
    price: 210,
    originalPrice: 260,
    rating: 4.8,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1541535882672-13eb287e0b51?q=80&w=1384&auto=format&fit=crop",
    badge: "Hot Choice",
    spice: "Hot",
    description: "Pungent and spicy Garlic Pickle made with handpicked garlic cloves and a rich blend of spices. Known for its health benefits and intense flavor."
  },
  {
    id: 6,
    slug: "chicken-pickle",
    name: "Kerala Chicken Pickle",
    category: "Non-Veg Pickle",
    categorySlug: "non-veg-pickles",
    weight: "500g",
    price: 399,
    originalPrice: 499,
    rating: 4.9,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1470&auto=format&fit=crop",
    badge: "Top Rated",
    spice: "Medium",
    description: "Succulent pieces of chicken fried and pickled in a spicy masala. A flavor-packed non-veg delight that brings the taste of Kerala home kitchens to your plate."
  },
  {
    id: 7,
    slug: "prawn-pickle",
    name: "Malabar Prawn Pickle",
    category: "Non-Veg Pickle",
    categorySlug: "non-veg-pickles",
    weight: "400g",
    price: 450,
    originalPrice: 550,
    rating: 4.7,
    reviews: 85,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1371&auto=format&fit=crop",
    badge: "Gourmet",
    spice: "Medium",
    description: "Exquisite Prawn Pickle made with fresh Malabar prawns. Each bite is a burst of coastal flavors, spice, and the richness of pure oils."
  },
  {
    id: 8,
    slug: "lemon-pickle",
    name: "Traditional Lemon Pickle",
    category: "Veg Pickle",
    categorySlug: "veg-pickles",
    weight: "500g",
    price: 180,
    originalPrice: 220,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1590502593747-422ea969a5a9?q=80&w=1374&auto=format&fit=crop",
    badge: "Authentic",
    spice: "Medium",
    description: "The classic Kerala Lemon Pickle (Naranga Achar). Tangy, salty, and spicy - it's the ultimate comfort food accompaniment for Curd Rice."
  },
  {
    id: 11,
    slug: "tender-mango-pickle",
    name: "Tender Mango Pickle",
    category: "Veg Pickle",
    categorySlug: "veg-pickles",
    weight: "500g",
    price: 220,
    originalPrice: 280,
    rating: 4.8,
    reviews: 132,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1587&auto=format&fit=crop",
    badge: "Best Seller",
    spice: "Medium",
    description: "Whole small mangoes (Kadumango) pickled in a spicy red gravy. A traditional Kerala delicacy that is essential for any festive Sadhya."
  }
];
