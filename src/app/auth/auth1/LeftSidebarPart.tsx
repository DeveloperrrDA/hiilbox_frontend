"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function LeftSidebarPart() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flowDash {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes progressFill {
          0%, 15% { width: 10%; }
          30%, 45% { width: 55%; }
          60%, 80% { width: 100%; }
          90%, 100% { width: 10%; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px 0px rgba(1, 161, 75, 0.15); }
          50% { box-shadow: 0 0 40px 10px rgba(1, 161, 75, 0.35); }
        }
        /* Mobile Payment to Center */
        @keyframes travelPath1 {
          0% { transform: translate(-180px, -150px) scale(0.5); opacity: 0; }
          20% { transform: translate(-140px, -120px) scale(1); opacity: 1; }
          80% { transform: translate(-40px, -40px) scale(1); opacity: 1; }
          100% { transform: translate(0px, 0px) scale(0.5); opacity: 0; }
        }
        /* Card Payment to Center */
        @keyframes travelPath2 {
          0% { transform: translate(-200px, 20px) scale(0.5); opacity: 0; }
          20% { transform: translate(-160px, 15px) scale(1); opacity: 1; }
          80% { transform: translate(-40px, 5px) scale(1); opacity: 1; }
          100% { transform: translate(0px, 0px) scale(0.5); opacity: 0; }
        }
        /* Center to Beneficiary */
        @keyframes travelPath3 {
          0% { transform: translate(0px, 0px) scale(0.5); opacity: 0; }
          20% { transform: translate(40px, 40px) scale(1); opacity: 1; }
          80% { transform: translate(140px, 120px) scale(1); opacity: 1; }
          100% { transform: translate(180px, 150px) scale(0.5); opacity: 0; }
        }
        
        .anim-flow { animation: flowDash 2s linear infinite; }
        .anim-progress { animation: progressFill 10s ease-in-out infinite; }
        .anim-pulse { animation: glowPulse 4s ease-in-out infinite; }
        
        .anim-packet-1 { animation: travelPath1 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 0s; }
        .anim-packet-2 { animation: travelPath2 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 2s; }
        .anim-packet-3 { animation: travelPath3 4s cubic-bezier(0.4, 0, 0.2, 1) infinite 4s; }
      `}} />

      {/* Deep Ambient Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#01A14B]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-[#01A14B]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between p-12 xl:p-16">
        
        {/* Header */}
        <div className="shrink-0">
          <img
            src="https://cdn.hiilbox.com/2026/05/Hiilbox-logo-1.webp"
            alt="Hiilbox"
            className="h-10 xl:h-12 w-auto object-contain brightness-0 invert opacity-90"
          />
        </div>

        {/* Full-Scale Ecosystem Canvas */}
        <div className="relative flex-1 w-full flex items-center justify-center min-h-[500px] my-4">
          
          {/* SVG Connection Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
            
            {/* Path 1: Mobile (Top Left) to Center */}
            <path d="M 220 200 C 300 200, 320 280, 400 300" fill="none" stroke="rgba(1,161,75,0.15)" strokeWidth="2" />
            <path d="M 220 200 C 300 200, 320 280, 400 300" fill="none" stroke="#01A14B" strokeWidth="3" strokeDasharray="10 15" className="anim-flow" />

            {/* Path 2: Cards (Mid Left) to Center */}
            <path d="M 200 320 C 280 320, 320 310, 400 300" fill="none" stroke="rgba(1,161,75,0.15)" strokeWidth="2" />
            <path d="M 200 320 C 280 320, 320 310, 400 300" fill="none" stroke="#01A14B" strokeWidth="3" strokeDasharray="10 15" className="anim-flow" style={{ animationDelay: '-1s' }} />

            {/* Path 3: Center to Beneficiary (Bottom Right) */}
            <path d="M 400 300 C 480 290, 500 400, 580 400" fill="none" stroke="rgba(1,161,75,0.15)" strokeWidth="2" />
            <path d="M 400 300 C 480 290, 500 400, 580 400" fill="none" stroke="#01A14B" strokeWidth="3" strokeDasharray="10 15" className="anim-flow" style={{ animationDelay: '-2s' }} />
          </svg>

          {/* =========================================
              NODE 1: Mobile Payments (Top Left)
             ========================================= */}
          <div className="absolute top-[30%] left-[10%] xl:left-[15%] -translate-y-1/2 z-20">
            <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-[240px]">
              <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-[#0A192F] flex items-center justify-center text-[#01A14B] shrink-0 shadow-md">
                <Icon icon="solar:smartphone-bold-duotone" className="text-2xl" />
              </div>
              <div>
                <h5 className="text-white font-bold text-sm">Mobile Money</h5>
                <p className="text-gray-400 text-xs mt-0.5">ZAAD, eDahab</p>
              </div>
            </div>
          </div>

          {/* =========================================
              NODE 2: Card Payments (Mid Left)
             ========================================= */}
          <div className="absolute top-[55%] left-[8%] xl:left-[12%] -translate-y-1/2 z-20">
            <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-[240px]">
              <div className="w-12 h-12 rounded-full bg-gray-800 border-2 border-[#0A192F] flex items-center justify-center text-[#01A14B] shrink-0 shadow-md">
                <Icon icon="solar:card-bold-duotone" className="text-2xl" />
              </div>
              <div>
                <h5 className="text-white font-bold text-sm">Cards & Bank</h5>
                <p className="text-gray-400 text-xs mt-0.5">Visa, Mastercard</p>
              </div>
            </div>
          </div>

          {/* Animated Donations (Traveling Paths) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            
            {/* Packet 1 (From Mobile) */}
            <div className="absolute anim-packet-1">
              <span className="px-4 py-1.5 bg-[#01A14B] text-white text-xs font-extrabold rounded-full shadow-[0_5px_15px_rgba(1,161,75,0.4)] whitespace-nowrap">+$150</span>
            </div>
            
            {/* Packet 2 (From Cards) */}
            <div className="absolute anim-packet-2">
              <span className="px-4 py-1.5 bg-white text-[#0A192F] border border-[#01A14B] text-xs font-extrabold rounded-full shadow-[0_5px_15px_rgba(255,255,255,0.1)] whitespace-nowrap">+$25</span>
            </div>

            {/* Packet 3 (To Beneficiary) */}
            <div className="absolute anim-packet-3 flex items-center gap-2 bg-[#01A14B]/20 backdrop-blur-md border border-[#01A14B] pl-2 pr-4 py-1.5 rounded-full shadow-[0_5px_20px_rgba(1,161,75,0.3)] whitespace-nowrap">
              <div className="w-6 h-6 rounded-full bg-[#01A14B] flex items-center justify-center">
                 <Icon icon="solar:check-circle-bold" className="text-white text-xs" />
              </div>
              <span className="text-white text-xs font-bold">Funds Sent</span>
            </div>

          </div>

          {/* =========================================
              NODE 3: HIILBOX CORE (Center)
             ========================================= */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[380px] anim-pulse rounded-2xl">
            <div className="bg-[#0A192F]/90 backdrop-blur-2xl border border-[#01A14B]/40 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#01A14B]/10 border border-[#01A14B]/30 flex items-center justify-center shrink-0">
                  <Icon icon="solar:shield-check-bold-duotone" className="text-3xl text-[#01A14B]" />
                </div>
                <div>
                  <h4 className="text-white font-extrabold text-lg">Hiilbox Processing</h4>
                  <p className="text-gray-400 text-xs font-medium mt-0.5">Secure, Encrypted & Transparent</p>
                </div>
              </div>
              
              {/* Campaign Progress Display */}
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Campaign Goal</span>
                  <span className="text-[#01A14B] text-sm font-extrabold">Filling...</span>
                </div>
                {/* Active Animated Progress Bar */}
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#01A14B] anim-progress rounded-full shadow-[0_0_12px_#01A14B]" />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              NODE 4: Beneficiary (Bottom Right)
             ========================================= */}
          <div className="absolute top-[65%] right-[10%] xl:right-[15%] -translate-y-1/2 z-20">
            <div className="bg-[#0A192F]/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-xl flex items-center gap-4 w-[240px]">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-gray-600 flex items-center justify-center shrink-0 text-white shadow-md">
                <Icon icon="solar:bank-bold-duotone" className="text-2xl" />
              </div>
              <div>
                <h5 className="text-white font-bold text-sm">Beneficiary</h5>
                <p className="text-gray-400 text-xs mt-0.5">Impact safely delivered.</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer Copy */}
        <div className="shrink-0 max-w-[460px] relative z-20">
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white tracking-tight">
            Accelerating<br />Global Support.
          </h2>
          <p className="my-5 text-[15px] font-medium text-gray-400 leading-relaxed">
            Follow fundraising targets, organize events, and protect connections across modern campaigns.
          </p>
          <Button asChild className="rounded-full bg-[#01A14B] hover:bg-[#018b41] text-white shadow-none px-8 py-6 text-[15px] font-bold transition-transform hover:-translate-y-0.5">
            <Link href="/campaigns">Explore campaigns</Link>
          </Button>
        </div>

      </div>
    </>
  );
}