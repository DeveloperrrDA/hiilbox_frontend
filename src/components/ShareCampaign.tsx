"use client";

import { useState } from "react";

interface ShareCampaignProps {
  title: string;
  variant?: "default" | "sidebar";
}

export default function ShareCampaign({ title, variant = "default" }: ShareCampaignProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function open(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=650,height=560");
  }

  function shareFacebook() {
    open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
  }

  function shareX() {
    open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`);
  }

  function shareWhatsApp() {
    open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${window.location.href}`)}`);
  }

  if (variant === "sidebar") {
    return (
      <div className="mt-3">
        <button
          type="button"
          onClick={copyLink}
          className="w-full rounded-full border border-[#cdd6df] bg-white px-6 py-3.5 text-sm font-semibold text-[#17324d] transition hover:bg-[#f7f9fb]"
        >
          {copied ? "Campaign link copied" : "Share campaign"}
        </button>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button type="button" onClick={shareFacebook} aria-label="Share on Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0e6eb] bg-white text-sm font-bold">f</button>
          <button type="button" onClick={shareWhatsApp} aria-label="Share on WhatsApp" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0e6eb] bg-white text-sm font-bold">W</button>
          <button type="button" onClick={shareX} aria-label="Share on X" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0e6eb] bg-white text-sm font-bold">𝕏</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <p className="text-base font-semibold text-gray-900">Share this campaign</p>
      <div className="flex items-center gap-3">
        <button type="button" onClick={shareFacebook} aria-label="Share on Facebook" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-sm font-bold text-gray-700  transition hover:bg-gray-50">f</button>
        <button type="button" onClick={shareX} aria-label="Share on X" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-sm font-bold text-gray-700  transition hover:bg-gray-50">𝕏</button>
        <button type="button" onClick={shareWhatsApp} aria-label="Share on WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-100 bg-white text-sm font-bold text-gray-700  transition hover:bg-gray-50">W</button>
        <button type="button" onClick={copyLink} aria-label="Copy campaign link" className="rounded-full border border-gray-100 bg-white px-4 py-2.5 text-sm font-medium text-gray-700  transition hover:bg-gray-50">{copied ? "Copied!" : "Copy link"}</button>
      </div>
    </div>
  );
}
