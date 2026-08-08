"use client";

import React, { useState, useEffect } from "react";
import { QrCode, X, Download, Printer, Check, Copy, Sparkles, ExternalLink } from "lucide-react";
import { UNIVERSAL_MENU_INFO } from "../data/menuData";

interface QRGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRGeneratorModal({ isOpen, onClose }: QRGeneratorModalProps) {
  const [hotelName, setHotelName] = useState(UNIVERSAL_MENU_INFO.venueName);
  const [copied, setCopied] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  // Uses the real live deployed URL (e.g. your-app.vercel.app)
  const encodedUrl = currentOrigin || UNIVERSAL_MENU_INFO.qrUrl;
  const qrImageApi = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(encodedUrl)}&color=0f172a&bgcolor=f8fafc`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(encodedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/20 bg-stone-950 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">Live Deploy QR Code</h3>
              <p className="text-xs text-stone-400">Scans directly to your live phone web app</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Hotel / Venue Title
            </label>
            <input
              type="text"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
              placeholder="Venue Name"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Universal QR Sticker Card */}
          <div className="relative flex flex-col items-center justify-center rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-6 text-center shadow-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-2">
              <Sparkles className="h-3 w-3" /> Live Phone Scan QR Code
            </div>

            <p className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-white">
              {hotelName}
            </p>
            <p className="text-xs text-stone-400 mt-1 mb-4">
              Scan with phone camera to open live digital menu on your phone
            </p>

            <div className="rounded-2xl border-4 border-amber-500/40 bg-white p-3 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageApi}
                alt="Live Menu QR Code"
                className="h-44 w-44 rounded-lg object-contain"
              />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-stone-300">
              <span className="truncate max-w-[220px] text-amber-300 font-medium">{encodedUrl}</span>
              <button
                onClick={handleCopyLink}
                className="ml-1 text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <a
              href={qrImageApi}
              download="Live_Mobile_Menu_QR.png"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3 text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
            >
              <Download className="h-4 w-4" /> Download Sticker
            </a>
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-3 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              <Printer className="h-4 w-4" /> Print Stickers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
