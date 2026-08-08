"use client";

import React, { useState, useEffect } from "react";
import { QrCode, Camera, Upload, CheckCircle2, X, RefreshCw, Smartphone } from "lucide-react";
import { UNIVERSAL_MENU_INFO } from "../data/menuData";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMenuScan: () => void;
}

export default function QRScannerModal({ isOpen, onClose, onConfirmMenuScan }: QRScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"scan" | "camera" | "upload">("scan");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);
  const [currentOrigin, setCurrentOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  if (!isOpen) return null;

  const targetUrl = currentOrigin || UNIVERSAL_MENU_INFO.qrUrl;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScannedSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setScannedSuccess(true);
    }, 1500);
  };

  const handleConfirm = () => {
    onConfirmMenuScan();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-500/20 bg-stone-950 text-white shadow-[0_25px_70px_rgba(0,0,0,0.8)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold">Scan Universal Menu QR</h3>
              <p className="text-xs text-stone-400">One single QR code for all tables</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-stone-900/60 p-1.5">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition ${
              activeTab === "scan"
                ? "bg-amber-500 text-stone-950 shadow-md font-semibold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <QrCode className="h-4 w-4" /> Quick Connect
          </button>
          <button
            onClick={() => {
              setActiveTab("camera");
              handleSimulateScan();
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition ${
              activeTab === "camera"
                ? "bg-amber-500 text-stone-950 shadow-md font-semibold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Camera className="h-4 w-4" /> Live Camera
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition ${
              activeTab === "upload"
                ? "bg-amber-500 text-stone-950 shadow-md font-semibold"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Upload className="h-4 w-4" /> Upload Photo
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === "scan" && (
            <div className="space-y-5 text-center">
              <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900 to-black p-6 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Smartphone className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-amber-400 font-bold">Universal Table QR</p>
                  <h4 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-white mt-1">
                    {UNIVERSAL_MENU_INFO.venueName}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Scan with any smartphone camera to open the menu directly on your mobile device.
                  </p>
                </div>

                <div className="inline-block rounded-2xl border-4 border-amber-500/40 bg-white p-3 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(targetUrl)}&color=0f172a&bgcolor=f8fafc`}
                    alt="Universal Menu QR Code"
                    className="h-36 w-36 rounded-lg object-contain"
                  />
                </div>
                
                <p className="text-[11px] text-amber-300 font-medium truncate max-w-[280px] mx-auto">
                  {targetUrl}
                </p>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full rounded-2xl bg-amber-500 py-3.5 text-xs font-bold text-stone-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
              >
                Scan & Open Digital Menu
              </button>
            </div>
          )}

          {activeTab === "camera" && (
            <div className="space-y-4 text-center">
              <div className="relative mx-auto flex h-64 w-64 flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-amber-500/60 bg-black/60 shadow-inner">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="h-10 w-10 animate-spin text-amber-400" />
                    <p className="text-sm font-medium text-amber-300">Scanning Table QR Code...</p>
                    <div className="h-1 w-32 overflow-hidden rounded-full bg-stone-800">
                      <div className="h-full bg-amber-400 animate-pulse w-full" />
                    </div>
                  </div>
                ) : scannedSuccess ? (
                  <div className="flex flex-col items-center gap-3 p-4">
                    <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                    <p className="font-semibold text-emerald-300">Universal QR Code Verified!</p>
                    <p className="text-xs text-stone-300">{UNIVERSAL_MENU_INFO.venueName}</p>
                    <button
                      onClick={handleConfirm}
                      className="mt-2 rounded-full bg-emerald-500 px-5 py-2 text-xs font-bold text-stone-950 hover:bg-emerald-400"
                    >
                      Connect Digital Menu
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-4">
                    <Camera className="h-12 w-12 text-amber-400/80" />
                    <p className="text-xs text-stone-400">Point your camera at the table QR code</p>
                    <button
                      onClick={handleSimulateScan}
                      className="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400"
                    >
                      Start Camera Scan
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="space-y-4 text-center">
              <label className="flex flex-col items-center justify-center h-52 rounded-3xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-amber-500/50 cursor-pointer transition p-6">
                <Upload className="h-10 w-10 text-amber-400 mb-3" />
                <p className="text-sm font-semibold text-white">Upload Universal QR Image</p>
                <p className="text-xs text-stone-400 mt-1">Upload QR photo from gallery</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => {
                    handleSimulateScan();
                    setActiveTab("camera");
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
