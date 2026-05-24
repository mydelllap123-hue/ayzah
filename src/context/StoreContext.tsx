"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

interface Product {
  _id?: string;
  id?: number | string;
  title?: string;
  name?: string;
  price: number;
  offerPrice?: number;
  images?: string[];
  image?: string;
  weight?: string;
  quantity?: number;
}

interface StoreContextType {
  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Cart & Wishlist State
  cart: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  cartTotal: number;
  clearCart: () => void;

  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string | number) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("kerala_pickles_cart");
      const savedWishlist = localStorage.getItem("kerala_pickles_wishlist");
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("kerala_pickles_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("kerala_pickles_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isHydrated]);

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const price = item.offerPrice || item.price;
    return total + price * (item.quantity || 1);
  }, 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    const productId = product._id || product.id;
    const productName = product.title || product.name;

    const existing = cart.find((p) => (p._id || p.id) === productId);
    if (existing) {
      setCart((prev) =>
        prev.map((p) =>
          (p._id || p.id) === productId ? { ...p, quantity: (p.quantity || 1) + quantity } : p
        )
      );
      toast.success(`Updated ${productName} quantity in cart!`);
    } else {
      setCart((prev) => [...prev, { ...product, quantity }]);
      toast.success(`Added ${productName} to cart!`);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((p) => (p._id || p.id) !== id));
    toast.error("Removed from cart");
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((p) => ((p._id || p.id) === id ? { ...p, quantity } : p)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("kerala_pickles_cart");
  };

  const toggleWishlist = (product: Product) => {
    const productId = product._id || product.id;
    const productName = product.title || product.name;

    const existing = wishlist.find((p) => (p._id || p.id) === productId);
    if (existing) {
      setWishlist((prev) => prev.filter((p) => (p._id || p.id) !== productId));
      toast.error(`Removed ${productName} from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      toast.success(`Added ${productName} to wishlist!`);
    }
  };

  const isInWishlist = (id: string | number) => {
    return wishlist.some((p) => (p._id || p.id) === id);
  };

  return (
    <StoreContext.Provider
      value={{
        isCartOpen, setIsCartOpen,
        isWishlistOpen, setIsWishlistOpen,
        isSearchOpen, setIsSearchOpen,
        isLoginOpen, setIsLoginOpen,
        quickViewProduct, setQuickViewProduct,
        cart, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart,
        wishlist, toggleWishlist, isInWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
