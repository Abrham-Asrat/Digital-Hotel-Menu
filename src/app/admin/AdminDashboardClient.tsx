"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CATEGORIES,
  MENU_ITEMS,
  UNIVERSAL_MENU_INFO,
  MenuItem,
} from "../../data/menuData";
import QRGeneratorModal from "../../components/QRGeneratorModal";

import {
  QrCode,
  Smartphone,
  Download,
  Printer,
  Wand2,
  CheckCircle2,
  Copy,
  Check,
  Utensils,
  ExternalLink,
  ChefHat,
  Sliders,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowLeft,
  Clock,
  Flame,
  Search,
} from "lucide-react";

export default function AdminDashboardClient() {
  const [hotelName, setHotelName] = useState("Linen & Lace | Grand Hotel Dining");
  const [currentOrigin, setCurrentOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Track availability state for items locally in demo
  const [availabilityState, setAvailabilityState] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    MENU_ITEMS.forEach((item) => {
      initialState[item.id] = true;
    });
    return initialState;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  const liveUrl = currentOrigin || UNIVERSAL_MENU_INFO.qrUrl;
  const qrImageApi = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(liveUrl)}&color=0f172a&bgcolor=f8fafc`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleItemAvailability = (id: string) => {
    setAvailabilityState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = MENU_ITEMS.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      if (selectedCategory === "chef-special") {
        if (!item.dietary.includes("chef-special")) return false;
      } else {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0d0f12] text-stone-100 selection:bg-amber-500 selection:text-stone-950 pb-20">
      
      {/* ADMIN NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-stone-950/90 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ChefHat className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-white sm:text-xl">
                  Hotel Admin Control Center
                </h1>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest text-amber-300">
                  Manager Portal
                </span>
              </div>
              <p className="text-xs text-stone-400">QR Code Management & Kitchen Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-white/15 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4 text-amber-400" /> View Guest Menu
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        
        {/* TOP QR MANAGEMENT HUB SECTION */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 mb-1">
                <Sparkles className="h-3 w-3" /> Live Venue QR Code
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">
                Table QR Code Management
              </h2>
              <p className="text-xs text-stone-400">
                Single universal QR code for all tables, counters, and guest rooms
              </p>
            </div>

            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-stone-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              <Wand2 className="h-4 w-4" /> Open Sticker Generator
            </button>
          </div>

          {/* QR Showcase Grid */}
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            
            {/* Live QR Card */}
            <div className="flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 p-6 shadow-2xl backdrop-blur-xl">
              <div className="rounded-2xl border-4 border-amber-500/40 bg-white p-3 shadow-lg shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrImageApi}
                  alt="Universal Menu QR Code"
                  className="h-44 w-44 rounded-lg object-contain"
                />
              </div>

              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-400 inline-flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 1 Code For All Tables
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
                    {hotelName}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Print and display this QR code on all table tents, room key cards, and bar counters.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-stone-300">
                  <span className="truncate flex-1 text-amber-300 font-mono text-[11px]">{liveUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold px-2 py-1 rounded-lg bg-stone-900 border border-white/10"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={qrImageApi}
                    download="Universal_Table_Menu_QR.png"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
                  >
                    <Download className="h-3.5 w-3.5" /> Download QR
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print Sticker
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Staff Actions & Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-stone-950 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Mobile Test Scan</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Scan with your smartphone camera to verify the live guest menu experience.
                  </p>
                </div>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
                >
                  Open Live Menu <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="rounded-3xl border border-white/10 bg-stone-950 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Utensils className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Active Menu Items</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    {MENU_ITEMS.length} dishes across {CATEGORIES.length - 1} categories
                  </p>
                </div>
                <div className="text-xs font-semibold text-emerald-400">
                  All Systems Operational
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KITCHEN & MENU MANAGEMENT SECTION */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">
                Kitchen Inventory & Availability
              </h2>
              <p className="text-xs text-stone-400">
                Toggle dishes in stock or mark items sold out (86) in real-time
              </p>
            </div>

            {/* Search & Category Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes..."
                  className="w-48 rounded-xl border border-white/15 bg-stone-900 pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-white/15 bg-stone-900 px-3 py-1.5 text-xs text-stone-300 focus:border-amber-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dishes Table / List */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const isAvailable = availabilityState[item.id] ?? true;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between rounded-3xl border p-5 transition ${
                    isAvailable
                      ? "border-white/10 bg-stone-950"
                      : "border-rose-500/30 bg-rose-950/20"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-stone-900 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-amber-300">${item.price}</span>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {item.prepTimeMinutes} mins prep
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base">{item.name}</h4>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.dietary.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-stone-900 border border-white/10 px-1.5 py-0.5 text-[9px] uppercase text-stone-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${isAvailable ? "text-emerald-400" : "text-rose-400"}`}>
                      {isAvailable ? (
                        <>
                          <CheckCircle className="h-4 w-4" /> In Stock
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" /> 86 Sold Out
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition border ${
                        isAvailable
                          ? "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500 hover:text-white"
                          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500 hover:text-stone-950"
                      }`}
                    >
                      {isAvailable ? "Mark Sold Out (86)" : "Restock Item"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* QR Generator Modal */}
      <QRGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />
    </div>
  );
}
