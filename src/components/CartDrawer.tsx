"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MenuItem, UNIVERSAL_MENU_INFO } from "../data/menuData";
import { X, Trash2, Plus, Minus, ChefHat, CheckCircle2, QrCode, MapPin } from "lucide-react";

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  selectedOptions: Record<string, string>;
  specialNote: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  tableNumberInput: string;
  onTableNumberChange: (tableNo: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenScanner: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  tableNumberInput,
  onTableNumberChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenScanner,
}: CartDrawerProps) {
  const [orderStatus, setOrderStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [orderStep, setOrderStep] = useState(1);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, ci) => {
    let extra = 0;
    if (ci.item.options) {
      ci.item.options.forEach((opt) => {
        const choice = opt.choices.find((c) => c.label === ci.selectedOptions[opt.name]);
        if (choice?.extraPrice) extra += choice.extraPrice;
      });
    }
    return acc + (ci.item.price + extra) * ci.quantity;
  }, 0);

  const serviceFee = subtotal * 0.1; // 10% hospitality service
  const grandTotal = subtotal + serviceFee;

  const handlePlaceOrder = () => {
    setOrderStatus("submitting");
    setOrderStep(1);

    setTimeout(() => {
      setOrderStep(2); // Kitchen received
    }, 1500);

    setTimeout(() => {
      setOrderStep(3); // Kitchen preparing
      setOrderStatus("success");
    }, 3000);
  };

  const handleFinishOrderView = () => {
    onClearCart();
    setOrderStatus("idle");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-white/10 bg-stone-950 text-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="border-b border-white/10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <ChefHat className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold">Your Order Cart</h3>
                <p className="text-xs text-stone-400">Scanned via Universal Menu QR</p>
              </div>
            </div>
            <button onClick={onClose} className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Table / Room Number Input Banner */}
          <div className="bg-stone-900/90 border-b border-white/10 px-5 py-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Deliver To (Table / Room #)
              </label>
              <button
                onClick={onOpenScanner}
                className="text-[11px] font-semibold text-stone-400 hover:text-amber-300 flex items-center gap-1"
              >
                <QrCode className="h-3 w-3" /> View QR Code
              </button>
            </div>
            <input
              type="text"
              value={tableNumberInput}
              onChange={(e) => onTableNumberChange(e.target.value)}
              placeholder="e.g. Table 05 or Room 304"
              className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderStatus === "success" || orderStatus === "submitting" ? (
              /* Live Order Tracker */
              <div className="py-8 px-4 text-center space-y-6">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border-2 border-amber-500/40 shadow-xl">
                  {orderStep === 3 ? (
                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  ) : (
                    <ChefHat className="h-10 w-10 animate-bounce" />
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">
                    {orderStep === 3 ? "Order Sent to Kitchen!" : "Transmitting Order..."}
                  </h4>
                  <p className="text-xs text-stone-400">
                    Delivery Location: <strong className="text-amber-300">{tableNumberInput || "Table Service"}</strong>
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                  <div className="flex items-center gap-3">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${orderStep >= 1 ? "bg-amber-500 text-stone-950" : "bg-stone-800 text-stone-500"}`}>1</span>
                    <span className="text-xs text-stone-200">Universal Order Sent</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${orderStep >= 2 ? "bg-amber-500 text-stone-950" : "bg-stone-800 text-stone-500"}`}>2</span>
                    <span className="text-xs text-stone-200">Received by Chef & Kitchen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${orderStep >= 3 ? "bg-emerald-500 text-stone-950" : "bg-stone-800 text-stone-500"}`}>3</span>
                    <span className="text-xs text-stone-200">Preparing fresh (~15-20 min)</span>
                  </div>
                </div>

                {orderStep === 3 && (
                  <button
                    onClick={handleFinishOrderView}
                    className="w-full rounded-2xl bg-amber-500 py-3.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
                  >
                    Done & Return to Menu
                  </button>
                )}
              </div>
            ) : cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <ChefHat className="h-12 w-12 text-stone-600" />
                <p className="text-sm font-semibold text-stone-300">Your order cart is empty</p>
                <p className="text-xs text-stone-500 max-w-xs">
                  Tap any dish on the digital menu to customize and add it to your order.
                </p>
              </div>
            ) : (
              cart.map((ci) => (
                <div key={ci.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-stone-900 shrink-0">
                    <Image src={ci.item.image} alt={ci.item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">{ci.item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(ci.id)}
                        className="text-stone-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {Object.entries(ci.selectedOptions).length > 0 && (
                      <p className="text-[10px] text-amber-300 mt-0.5">
                        {Object.values(ci.selectedOptions).join(", ")}
                      </p>
                    )}

                    {ci.specialNote && (
                      <p className="text-[10px] italic text-stone-400 truncate mt-0.5">
                        Note: &quot;{ci.specialNote}&quot;
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs font-bold text-amber-400">${ci.item.price * ci.quantity}</p>
                      <div className="flex items-center gap-2 rounded-lg bg-stone-900 px-2 py-0.5 border border-white/10">
                        <button
                          onClick={() => onUpdateQuantity(ci.id, -1)}
                          className="text-stone-400 hover:text-white"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{ci.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(ci.id, 1)}
                          className="text-stone-400 hover:text-white"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && orderStatus === "idle" && (
            <div className="border-t border-white/10 bg-stone-900/90 p-5 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospitality Service (10%)</span>
                  <span className="font-semibold text-white">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold">
                  <span className="text-amber-300">Total Bill</span>
                  <span className="text-amber-300">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
              >
                Send Order to Kitchen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
