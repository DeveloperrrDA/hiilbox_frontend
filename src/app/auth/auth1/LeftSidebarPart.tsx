"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LeftSidebarPart() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flowDash {
          from { stroke-dashoffset: 40; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes float-soft {
          0%, 100% { transform: translateY(0px) translateX(-50%); }
          50% { transform: translateY(-12px) translateX(-50%); }
        }
        
        /* Accurately Aligned Particle Drops (Top to Vault) */
        @keyframes drop-t-1 {
          0% { top: 15%; left: 60%; opacity: 0; transform: scale(0.5) rotate(-15deg); }
          15% { top: 20%; left: 63%; opacity: 1; transform: scale(1) rotate(0deg); }
          85% { top: 40%; left: 72%; opacity: 1; transform: scale(1) rotate(15deg); }
          100% { top: 45%; left: 75%; opacity: 0; transform: scale(0.5) rotate(30deg) translateX(-50%); }
        }
        @keyframes drop-t-2 {
          0% { top: 15%; left: 90%; opacity: 0; transform: scale(0.5) rotate(15deg); }
          15% { top: 20%; left: 87%; opacity: 1; transform: scale(1) rotate(0deg); }
          85% { top: 40%; left: 78%; opacity: 1; transform: scale(1) rotate(-15deg); }
          100% { top: 45%; left: 75%; opacity: 0; transform: scale(0.5) rotate(-30deg) translateX(-50%); }
        }
        @keyframes drop-t-3 {
          0% { top: 20%; left: 75%; opacity: 0; transform: scale(0.5) rotate(0deg) translateX(-50%); }
          15% { top: 25%; left: 75%; opacity: 1; transform: scale(1) rotate(0deg) translateX(-50%); }
          85% { top: 42%; left: 75%; opacity: 1; transform: scale(1) rotate(0deg) translateX(-50%); }
          100% { top: 47%; left: 75%; opacity: 0; transform: scale(0.5) rotate(0deg) translateX(-50%); }
        }

        /* Accurately Aligned Particle Drops (Vault to Bottom) */
        @keyframes drop-b-1 {
          0% { top: 52%; left: 75%; opacity: 0; transform: scale(0.5) rotate(0deg) translateX(-50%); }
          15% { top: 60%; left: 72%; opacity: 1; transform: scale(1) rotate(-10deg); }
          85% { top: 80%; left: 63%; opacity: 1; transform: scale(1) rotate(-20deg); }
          100% { top: 85%; left: 60%; opacity: 0; transform: scale(0.5) rotate(-30deg) translateX(-50%); }
        }
        @keyframes drop-b-2 {
          0% { top: 52%; left: 75%; opacity: 0; transform: scale(0.5) rotate(0deg) translateX(-50%); }
          15% { top: 60%; left: 78%; opacity: 1; transform: scale(1) rotate(10deg); }
          85% { top: 80%; left: 87%; opacity: 1; transform: scale(1) rotate(20deg); }
          100% { top: 85%; left: 90%; opacity: 0; transform: scale(0.5) rotate(30deg) translateX(-50%); }
        }
        @keyframes drop-b-3 {
          0% { top: 55%; left: 75%; opacity: 0; transform: scale(0.5) rotate(0deg) translateX(-50%); }
          15% { top: 65%; left: 75%; opacity: 1; transform: scale(1) rotate(0deg) translateX(-50%); }
          85% { top: 85%; left: 75%; opacity: 1; transform: scale(1) rotate(0deg) translateX(-50%); }
          100% { top: 90%; left: 75%; opacity: 0; transform: scale(0.5) rotate(0deg) translateX(-50%); }
        }

        .anim-line { animation: flowDash 1s linear infinite; }
        .float-node { animation: float-soft 6s ease-in-out infinite; }
        
        .particle-t-1 { animation: drop-t-1 4s linear infinite 0s; }
        .particle-t-2 { animation: drop-t-2 4s linear infinite 1.2s; }
        .particle-t-3 { animation: drop-t-3 4s linear infinite 2.5s; }
        
        .particle-b-1 { animation: drop-b-1 4s linear infinite 0.5s; }
        .particle-b-2 { animation: drop-b-2 4s linear infinite 1.8s; }
        .particle-b-3 { animation: drop-b-3 4s linear infinite 3.1s; }
      `}} />

      <div className="absolute inset-0 z-10 overflow-hidden select-none">
        
        {/* =====================================
            HERO TYPOGRAPHY (ISOLATED ON LEFT)
        ====================================== */}
        <div className="absolute top-1/2 left-0 xl:left-8 z-40 transform -translate-y-1/2 w-full max-w-[50%]">
          <h1 className="text-[3rem] xl:text-[4rem] font-extrabold leading-[1.05] tracking-tight text-white mb-4">
            Small acts.<br />
            <span className="text-[#FBBF24]">Lasting impact.</span>
          </h1>
          <p className="text-base xl:text-lg text-white/90 font-medium max-w-sm mb-6">
            Your next act of kindness starts here. Discover campaigns changing lives.
          </p>
          <Button asChild className="rounded-full bg-[#01A14B] hover:bg-[#018b41] text-white shadow-none px-8 py-5 text-[15px] font-bold transition-transform hover:-translate-y-0.5">
            <Link href="/campaigns">Explore campaigns</Link>
          </Button>
        </div>

        {/* =====================================
            SVG DASHED FLOW LINES (STRICT ALIGNMENT)
        ====================================== */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          {/* Left Phone (60%) to Vault (75%) */}
          <path d="M 600 150 Q 750 250 750 450" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6 8" className="anim-line" />
          
          {/* Right Phone (90%) to Vault (75%) */}
          <path d="M 900 150 Q 750 250 750 450" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6 8" className="anim-line" />
          
          {/* Vault (75%) to Bottom Beneficiary (75%) */}
          <path d="M 750 550 L 750 900" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6 8" className="anim-line" />
          
          {/* Vault (75%) to Bottom Left Card (60%) */}
          <path d="M 750 550 Q 600 700 600 850" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6 8" className="anim-line" />
          
          {/* Vault (75%) to Bottom Right Card (90%) */}
          <path d="M 750 550 Q 900 700 900 850" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6 8" className="anim-line" />
        </svg>


        {/* =====================================
            1. PAYMENT SOURCES (ALIGNED 60% & 90%)
        ====================================== */}
        
        {/* Left Phone (Local Payments) - 60% */}
        <div className="absolute top-[8%] left-[60%] w-[140px] bg-[#1a232c] border border-gray-700/50 rounded-[20px] p-2 shadow-2xl z-20 -rotate-2 float-node transform -translate-x-1/2">
          <div className="w-full h-[100px] bg-[#0c141c] rounded-xl flex flex-col gap-1 p-1.5 border border-gray-800">
            <div className="bg-white rounded-lg p-1.5 flex items-center gap-2">
              <div className="w-5 h-5 bg-[#00b14f] rounded flex items-center justify-center text-white text-[7px] font-bold">ZAAD</div>
              <div className="leading-none"><p className="text-[8px] font-bold text-gray-800">ZAAD</p><p className="text-[6px] text-gray-500">Mobile Money</p></div>
            </div>
            <div className="bg-white rounded-lg p-1.5 flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[7px] font-bold italic">EVC</div>
              <div className="leading-none"><p className="text-[8px] font-bold text-gray-800">EVC Plus</p><p className="text-[6px] text-gray-500">Mobile Money</p></div>
            </div>
            <div className="bg-white rounded-lg p-1.5 flex items-center gap-2">
              <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center text-red-600 text-[7px] font-bold">eDahab</div>
              <div className="leading-none"><p className="text-[8px] font-bold text-gray-800">eDahab</p><p className="text-[6px] text-gray-500">Mobile Money</p></div>
            </div>
          </div>
        </div>

        {/* Right Phone (International Payments) - 90% */}
        <div className="absolute top-[6%] left-[90%] w-[140px] bg-[#1a232c] border border-gray-700/50 rounded-[20px] p-2 shadow-2xl z-20 rotate-3 float-node transform -translate-x-1/2" style={{ animationDelay: '1s' }}>
          <div className="w-full h-[100px] bg-[#0c141c] rounded-xl flex flex-col gap-1 p-1.5 border border-gray-800">
            <div className="bg-white rounded-lg p-1.5 flex items-center gap-2">
              <div className="w-5 h-5 border flex items-center justify-center text-blue-700 text-[8px] font-black italic">VISA</div>
              <div className="leading-none"><p className="text-[8px] font-bold text-gray-800">VISA</p><p className="text-[6px] text-gray-500">Visa Card</p></div>
            </div>
            <div className="bg-white rounded-lg p-1.5 flex items-center gap-2">
              <div className="w-5 h-5 border flex items-center justify-center relative overflow-hidden">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full absolute left-0.5 mix-blend-multiply"></div>
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full absolute right-0.5 mix-blend-multiply"></div>
              </div>
              <div className="leading-none"><p className="text-[8px] font-bold text-gray-800">Mastercard</p><p className="text-[6px] text-gray-500">Mastercard</p></div>
            </div>
            <div className="bg-white rounded-lg p-1.5 flex items-center gap-2">
              <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center text-green-700"><Icon icon="solar:bank-bold" className="text-[10px]" /></div>
              <div className="leading-none"><p className="text-[8px] font-bold text-gray-800">Bank Transfer</p><p className="text-[6px] text-gray-500">Intl & Local</p></div>
            </div>
          </div>
        </div>


        {/* =====================================
            2. FALLING DONATIONS (TOP TO VAULT)
        ====================================== */}
        <div className="absolute particle-t-1 z-30 flex flex-col items-center pointer-events-none transform -translate-x-1/2">
          <span className="text-yellow-400 font-black text-xs tracking-wide drop-shadow-md border border-yellow-500/50 px-1 rounded bg-yellow-900/40 mb-1">$10</span>
          <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-500 shadow-lg flex items-center justify-center">
             <div className="w-3 h-3 rounded-full border border-yellow-500/50"></div>
          </div>
        </div>

        <div className="absolute particle-t-2 z-30 flex flex-col items-center pointer-events-none transform -translate-x-1/2">
          <span className="text-green-300 font-black text-sm tracking-wide drop-shadow-md border border-green-400/50 px-1 rounded bg-green-900/40 mb-1">$100</span>
          <div className="w-10 h-5 bg-green-500/80 border border-green-300 rounded shadow-lg flex items-center justify-center">
             <Icon icon="solar:heart-bold" className="text-white text-[10px]" />
          </div>
        </div>

        <div className="absolute particle-t-3 z-30 flex flex-col items-center pointer-events-none transform -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-yellow-400 border-[3px] border-yellow-500 shadow-lg flex items-center justify-center mb-1">
             <div className="w-4 h-4 rounded-full border border-yellow-500/50"></div>
          </div>
          <span className="text-yellow-400 font-black text-xs tracking-wide drop-shadow-md border border-yellow-500/50 px-1 rounded bg-yellow-900/40">$50</span>
        </div>


        {/* =====================================
            3. HIILBOX 3D VAULT (CENTER - 75%)
        ====================================== */}
        <div className="absolute top-[48%] left-[80%] z-30 float-node transform -translate-x-1/2 -translate-y-1/2">
          <img 
            src="/images/front-pages/Crowdfunding 3d box - Hiilbox.webp" 
            alt="Hiilbox 3D Vault" 
            className="w-[240px] xl:w-[280px] h-auto drop-shadow-[0_20px_40px_rgba(1,161,75,0.4)] relative z-20"
          />
        </div>


        {/* =====================================
            4. FALLING WITHDRAWALS (VAULT TO USER)
        ====================================== */}
        <div className="absolute particle-b-1 z-30 flex flex-col items-center pointer-events-none transform -translate-x-1/2">
          <span className="text-yellow-400 font-black text-xs tracking-wide drop-shadow-md border border-yellow-500/50 px-1 rounded bg-yellow-900/40 mb-1">$10</span>
          <div className="w-8 h-8 rounded-full bg-yellow-400 border-[3px] border-yellow-500 shadow-lg flex items-center justify-center">
             <div className="w-4 h-4 rounded-full border border-yellow-500/50"></div>
          </div>
        </div>

        <div className="absolute particle-b-2 z-30 flex flex-col items-center pointer-events-none transform -translate-x-1/2">
          <span className="text-yellow-400 font-black text-xs tracking-wide drop-shadow-md border border-yellow-500/50 px-1 rounded bg-yellow-900/40 mb-1">$50</span>
          <div className="w-8 h-4 bg-green-500/80 border border-green-300 rounded shadow-lg flex items-center justify-center">
             <Icon icon="solar:heart-bold" className="text-white text-[8px]" />
          </div>
        </div>

        <div className="absolute particle-b-3 z-30 flex flex-col items-center pointer-events-none transform -translate-x-1/2">
          <span className="text-green-300 font-black text-lg tracking-wide drop-shadow-md border border-green-400/50 px-2 rounded bg-green-900/40 mb-2">$500</span>
          <div className="w-6 h-6 rounded-full bg-yellow-400 border-[3px] border-yellow-500 shadow-lg flex items-center justify-center">
             <div className="w-3 h-3 rounded-full border border-yellow-500/50"></div>
          </div>
        </div>


        {/* =====================================
            5. BENEFICIARY / USER (BOTTOM AXIS)
        ====================================== */}
        
        {/* Central User Avatar (75%) */}
        <div className="absolute bottom-[5%] left-[75%] z-20 transform -translate-x-1/2 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-t from-gray-800 to-gray-600 border-4 border-[#01A14B] shadow-[0_0_30px_rgba(1,161,75,0.3)] overflow-hidden">
             <img src="/images/profile/user-1.jpg" alt="Beneficiary" className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-12 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-xl z-30"></div>
        </div>

        {/* Left Glass Card (Withdrawal) - 60% */}
        <div className="absolute bottom-[10%] left-[60%] w-[140px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 shadow-2xl z-30 rotate-[-5deg] float-node transform -translate-x-1/2">
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-yellow-500 shadow-lg"></div>
          <div className="flex items-start gap-2">
             <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-md">
               <Icon icon="solar:check-read-bold" className="text-white text-[10px]" />
             </div>
             <div>
               <p className="text-white text-[9px] font-medium leading-tight">Withdrawal Received</p>
               <p className="text-green-400 text-base font-black leading-tight my-0.5">$1,200</p>
               <p className="text-gray-300 text-[7px]">In your bank account</p>
             </div>
          </div>
        </div>

        {/* Right Glass Card (Bank Deposit) - 90% */}
        <div className="absolute bottom-[12%] left-[90%] w-[110px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 shadow-2xl z-10 rotate-[3deg] float-node transform -translate-x-1/2" style={{ animationDelay: '1s' }}>
          <div className="w-full flex justify-center mb-1.5">
             <div className="w-8 h-8 bg-green-900/60 rounded-lg flex items-center justify-center border border-green-500/30">
               <Icon icon="tabler:building-bank" className="text-green-400 text-lg" />
             </div>
          </div>
          <p className="text-white text-[9px] font-bold text-center leading-tight">Funds Deposited<br/>to Your Account</p>
        </div>

      </div>
    </>
  );
}