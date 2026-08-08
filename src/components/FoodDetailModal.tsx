"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem } from "../data/menuData";
import { X, Star, Clock, Flame, Plus, Minus, AlertCircle, Sparkles, Check } from "lucide-react";

interface FoodDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, selectedOptions: Record<string, string>, specialNote: string) => void;
}

export default function FoodDetailModal({ item, isOpen, onClose, onAddToCart }: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [specialNote, setSpecialNote] = useState("");
  const [addedToast, setAddedToast] = useState(false);

  if (!isOpen || !item) return null;

  // Initialize options defaults if present
  const handleOptionSelect = (optionName: string, choiceLabel: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: choiceLabel }));
  };

  // Calculate extra price from options
  let extraCost = 0;
  if (item.options) {
    item.options.forEach((opt) => {
      const selectedChoiceLabel = selectedOptions[opt.name];
      const choiceObj = opt.choices.find((c) => c.label === selectedChoiceLabel);
      if (choiceObj?.extraPrice) {
        extraCost += choiceObj.extraPrice;
      }
    });
  }

  const totalPrice = (item.price + extraCost) * quantity;

  const handleAdd = () => {
    onAddToCart(item, quantity, selectedOptions, specialNote);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      onClose();
      // Reset state
      setQuantity(1);
      setSelectedOptions({});
      setSpecialNote("");
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto overflow-hidden rounded-3xl border border-amber-500/20 bg-stone-950 text-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-stone-900/80 text-stone-300 backdrop-blur-md transition hover:bg-stone-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

          {/* Badges overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-stone-950 backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-stone-950" /> {item.rating} ({item.reviewsCount})
              </span>
              <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-stone-200 border border-white/10 backdrop-blur-md">
                <Clock className="h-3.5 w-3.5 text-amber-400" /> {item.prepTimeMinutes} mins
              </span>
              <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-stone-200 border border-white/10 backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 text-orange-400" /> {item.calories} kcal
              </span>
            </div>
            <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-amber-300">
              ${item.price}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {item.dietary.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-amber-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">
              {item.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-300">
              {item.longDescription}
            </p>
          </div>

          {/* Ingredients list */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Key Ingredients
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {item.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="rounded-lg bg-stone-900 border border-white/10 px-2.5 py-1 text-xs text-stone-300"
                >
                  {ing}
                </span>
              ))}
            </div>

            {item.allergens.length > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-rose-300 pt-2 border-t border-white/5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Contains Allergens: <strong>{item.allergens.join(", ")}</strong></span>
              </div>
            )}
          </div>

          {/* Customizable options */}
          {item.options && item.options.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                Customize Dish
              </h4>
              {item.options.map((option) => (
                <div key={option.name} className="space-y-2">
                  <p className="text-xs font-medium text-stone-400">{option.name}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {option.choices.map((choice) => {
                      const isSelected = selectedOptions[option.name] === choice.label;
                      return (
                        <button
                          key={choice.label}
                          type="button"
                          onClick={() => handleOptionSelect(option.name, choice.label)}
                          className={`flex items-center justify-between rounded-xl border p-3 text-xs text-left transition ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/15 text-white font-semibold"
                              : "border-white/10 bg-white/5 text-stone-300 hover:border-white/20"
                          }`}
                        >
                          <span>{choice.label}</span>
                          {choice.extraPrice && (
                            <span className="text-amber-400 font-bold">+${choice.extraPrice}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special instructions */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
              Special Instructions to Chef
            </label>
            <textarea
              rows={2}
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Sauce on the side, extra napkins, allergies..."
              className="w-full rounded-2xl border border-white/15 bg-white/5 p-3 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 bg-stone-900/90 p-4 sm:p-5">
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-stone-950 px-3 py-1.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full text-stone-300 hover:bg-white/10 hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-white">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-stone-300 hover:bg-white/10 hover:text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={addedToast}
            className={`flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold transition shadow-lg ${
              addedToast
                ? "bg-emerald-500 text-stone-950"
                : "bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-amber-500/20"
            }`}
          >
            {addedToast ? (
              <>
                <Check className="h-4 w-4" /> Added to Order!
              </>
            ) : (
              <>
                Add to Table Order • ${totalPrice.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
