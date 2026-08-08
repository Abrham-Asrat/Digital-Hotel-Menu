"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  CATEGORIES,
  MENU_ITEMS,
  UNIVERSAL_MENU_INFO,
  MenuItem,
} from "../data/menuData";
import QRScannerModal from "../components/QRScannerModal";
import QRGeneratorModal from "../components/QRGeneratorModal";
import FoodDetailModal from "../components/FoodDetailModal";
import CartDrawer, { CartItem } from "../components/CartDrawer";
import CallWaiterModal from "../components/CallWaiterModal";

import {
  QrCode,
  Search,
  ShoppingCart,
  Bell,
  Star,
  Clock,
  Sparkles,
  Flame,
  Plus,
  Utensils,
  Smartphone,
  Wand2,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  // Dynamic deployment URL for QR codes
  const [currentOrigin, setCurrentOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  // Table / Room input state
  const [tableNumberInput, setTableNumberInput] = useState("Table 04");

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWaiterOpen, setIsWaiterOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Category & Filter state
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  // Filter menu items based on category, search, and dietary tags
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category match
      if (activeCategory !== "all" && item.category !== activeCategory) {
        if (activeCategory === "chef-special") {
          if (!item.dietary.includes("chef-special")) return false;
        } else {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIng = item.ingredients.some((ing) => ing.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      // Dietary filter match
      if (selectedDietary.length > 0) {
        const matchesAllDietary = selectedDietary.every((tag) =>
          item.dietary.includes(tag as any)
        );
        if (!matchesAllDietary) return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, selectedDietary]);

  // Cart actions
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedOptions: Record<string, string>,
    specialNote: string
  ) => {
    const cartItemId = `${item.id}-${JSON.stringify(selectedOptions)}-${specialNote}`;
    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === cartItemId);
      if (existing) {
        return prev.map((ci) =>
          ci.id === cartItemId ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          item,
          quantity,
          selectedOptions,
          specialNote,
        },
      ];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.id === cartItemId) {
            const newQ = ci.quantity + delta;
            return newQ > 0 ? { ...ci, quantity: newQ } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const totalCartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const cartSubtotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  const toggleDietaryFilter = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <main className="min-h-screen bg-[#0d0f12] text-stone-100 selection:bg-amber-500 selection:text-stone-950 pb-28">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-stone-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          
          {/* Brand Logo & Universal Badge */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-[family-name:var(--font-playfair)] text-lg font-bold tracking-tight text-white sm:text-xl">
                  Linen & Lace
                </h1>
                <span className="hidden sm:inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest text-amber-300">
                  Universal Digital Menu
                </span>
              </div>
              
              {/* Universal QR Badge */}
              <button
                onClick={() => setIsScannerOpen(true)}
                className="mt-0.5 flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 transition group"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-stone-200 group-hover:text-amber-300">
                  Universal Table QR Active
                </span>
                <QrCode className="h-3 w-3 text-amber-400 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View/Scan Universal QR */}
            <button
              onClick={() => setIsScannerOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition shadow-sm"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden md:inline">Universal QR Code</span>
            </button>

            {/* Staff Print QR Button */}
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-stone-300 hover:bg-white/10 hover:text-white transition"
              title="Print Universal Table QR Sticker"
            >
              <Wand2 className="h-4 w-4 text-amber-400" />
              <span>Print Table QR Sticker</span>
            </button>

            {/* Call Waiter Bell */}
            <button
              onClick={() => setIsWaiterOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-amber-400 hover:bg-amber-500/20 transition"
              title="Call Waiter"
            >
              <Bell className="h-5 w-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition shadow-md shadow-amber-500/20"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Order Cart</span>
              {totalCartCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-950 text-[11px] font-extrabold text-amber-400">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER - UNIVERSAL QR */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-stone-950 via-stone-900/60 to-[#0d0f12] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              One Single QR Code for All Venue Tables
            </div>

            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Scan one QR code to view & order from any table.
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-stone-300 max-w-xl">
              Guests at every table scan the exact same universal QR code sticker to access the full digital food menu, customize dishes, and order directly to their table or room.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-xs font-extrabold text-stone-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
              >
                <QrCode className="h-4 w-4" /> View Universal QR Code
              </button>
              <button
                onClick={() => setIsWaiterOpen(true)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/15 transition"
              >
                <Bell className="h-4 w-4 text-amber-400" /> Request Waiter Bell
              </button>
            </div>
          </div>

          {/* Universal QR Code Showcase Card */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-amber-500/30 bg-stone-950/90 p-6 shadow-2xl backdrop-blur-xl space-y-4 text-center">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-amber-400 font-bold">Universal Venue Sticker</p>
                    <p className="text-base font-bold text-white">All Tables QR Code</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> 1 Code For All
                </span>
              </div>

              <div className="inline-block rounded-2xl border-4 border-amber-500/40 bg-white p-3 shadow-lg my-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentOrigin || UNIVERSAL_MENU_INFO.qrUrl)}&color=0f172a&bgcolor=f8fafc`}
                  alt="Universal Menu QR Code"
                  className="h-40 w-40 rounded-lg object-contain mx-auto"
                />
              </div>

              <div className="text-xs text-stone-400">
                Place this single QR code on all dining tables, terrace counters, and hotel guest rooms.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY CATEGORY & SEARCH NAVIGATION */}
      <section className="sticky top-[67px] z-30 border-b border-white/10 bg-[#0d0f12]/95 backdrop-blur-md py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Search Bar & Dietary Chips */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, ingredients, cocktails..."
                className="w-full rounded-2xl border border-white/15 bg-stone-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-stone-400 focus:border-amber-500 focus:outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                Filter:
              </span>
              {[
                { tag: "chef-special", label: "Chef's Special ⭐" },
                { tag: "vegetarian", label: "Vegetarian 🌿" },
                { tag: "vegan", label: "Vegan 🌱" },
                { tag: "gluten-free", label: "Gluten-Free 🌾" },
                { tag: "halal", label: "Halal 🌙" },
              ].map(({ tag, label }) => {
                const isActive = selectedDietary.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleDietaryFilter(tag)}
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      isActive
                        ? "border-amber-500 bg-amber-500 text-stone-950 shadow-md"
                        : "border-white/10 bg-stone-900 text-stone-300 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition ${
                    isActive
                      ? "border-amber-500 bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20"
                      : "border-white/10 bg-white/5 text-stone-300 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOD MENU ITEMS GRID */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Results Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">
              {CATEGORIES.find((c) => c.id === activeCategory)?.name || "All Dishes"}
            </h3>
            <p className="text-xs text-stone-400">
              Showing {filteredItems.length} curated item{filteredItems.length === 1 ? "" : "s"}
            </p>
          </div>

          {(searchQuery || selectedDietary.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDietary([]);
                setActiveCategory("all");
              }}
              className="text-xs font-semibold text-amber-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-stone-950 p-12 text-center space-y-3">
            <Utensils className="h-12 w-12 text-stone-600 mx-auto" />
            <h4 className="text-lg font-bold text-white">No dishes match your criteria</h4>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Try adjusting your search keywords or clearing dietary filters to view all menu selections.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDietary([]);
                setActiveCategory("all");
              }}
              className="mt-2 inline-flex rounded-full bg-amber-500 px-5 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400"
            >
              Show Full Menu
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedFood(item)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-stone-950/80 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_20px_50px_rgba(212,175,55,0.12)] cursor-pointer"
              >
                {/* Food Image */}
                <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {item.dietary.includes("chef-special") ? (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-stone-950 shadow-md">
                        <Sparkles className="h-3 w-3" /> Chef&apos;s Special
                      </span>
                    ) : (
                      <span />
                    )}

                    <span className="flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/10">
                      <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" /> {item.rating}
                    </span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 rounded-2xl bg-stone-950/90 border border-amber-500/30 px-3.5 py-1 text-base font-extrabold text-amber-300 backdrop-blur-md">
                    ${item.price}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    {/* Dietary Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.dietary.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-stone-900 border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-stone-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h4 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white group-hover:text-amber-300 transition">
                      {item.name}
                    </h4>

                    <p className="mt-2 text-xs leading-relaxed text-stone-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-3 text-[11px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-400" /> {item.prepTimeMinutes}m
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5 text-orange-400" /> {item.calories} kcal
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFood(item);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-stone-950 font-bold transition hover:bg-amber-400 group-hover:scale-105"
                      title="Customize & Add"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FLOATING ACTION BAR FOR MOBILE/TABLET */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:max-w-md">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex w-full items-center justify-between rounded-3xl bg-amber-500 p-4 text-stone-950 font-bold shadow-2xl shadow-amber-500/30 hover:bg-amber-400 transition"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-950 text-amber-400 font-extrabold text-xs">
                {totalCartCount}
              </span>
              <span className="text-sm">View Table Order</span>
            </div>
            <span className="text-base font-extrabold">${cartSubtotal.toFixed(2)} →</span>
          </button>
        </div>
      )}

      {/* MODALS */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onConfirmMenuScan={() => {}}
      />

      <QRGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />

      <FoodDetailModal
        item={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        tableNumberInput={tableNumberInput}
        onTableNumberChange={setTableNumberInput}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        onOpenScanner={() => {
          setIsCartOpen(false);
          setIsScannerOpen(true);
        }}
      />

      <CallWaiterModal
        isOpen={isWaiterOpen}
        onClose={() => setIsWaiterOpen(false)}
        tableNumberInput={tableNumberInput}
      />
    </main>
  );
}
