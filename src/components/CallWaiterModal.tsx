"use client";

import React, { useState } from "react";
import { Bell, X, Droplet, Utensils, CreditCard, MessageSquare, CheckCircle2, MapPin } from "lucide-react";

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumberInput: string;
}

export default function CallWaiterModal({ isOpen, onClose, tableNumberInput }: CallWaiterModalProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [customNote, setCustomNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const REQUEST_OPTIONS = [
    { id: "water", label: "Water Refill", icon: Droplet, desc: "Still or Sparkling water for table" },
    { id: "cutlery", label: "Need Cutlery / Napkins", icon: Utensils, desc: "Extra plates, forks, or napkins" },
    { id: "bill", label: "Request Bill / Check", icon: CreditCard, desc: "Card terminal or cash payment" },
    { id: "assistance", label: "Staff Assistance", icon: MessageSquare, desc: "Speak with server or manager" },
  ];

  const handleSubmitRequest = () => {
    if (!selectedRequest) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedRequest(null);
      setCustomNote("");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/20 bg-stone-950 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Bell className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold">Call Waiter</h3>
              <p className="text-xs text-stone-400">Dispatch request to staff</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">Request Dispatched!</h4>
              <p className="text-xs text-stone-300">
                A server has been notified for <strong className="text-amber-400">{tableNumberInput || "your table"}</strong>.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <div className="flex-1 text-xs">
                  <span className="text-stone-400">Location: </span>
                  <strong className="text-white">{tableNumberInput || "Table Service (Universal QR)"}</strong>
                </div>
              </div>

              <p className="text-xs uppercase tracking-wider text-stone-400 font-medium pt-1">Select request type:</p>
              <div className="grid gap-2.5">
                {REQUEST_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedRequest === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedRequest(opt.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                        isSelected
                          ? "border-amber-500 bg-amber-500/15 text-white"
                          : "border-white/10 bg-white/5 text-stone-300 hover:border-white/20"
                      }`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isSelected ? "bg-amber-500 text-stone-950" : "bg-stone-900 text-amber-400"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{opt.label}</p>
                        <p className="text-[11px] text-stone-400">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 mb-1.5 uppercase">
                  Additional Note (Optional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Extra ice or warm water"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSubmitRequest}
                disabled={!selectedRequest}
                className={`w-full rounded-2xl py-3.5 text-xs font-bold transition shadow-lg ${
                  selectedRequest
                    ? "bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-amber-500/20"
                    : "bg-stone-800 text-stone-500 cursor-not-allowed"
                }`}
              >
                Send Waiter Bell Alert
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
