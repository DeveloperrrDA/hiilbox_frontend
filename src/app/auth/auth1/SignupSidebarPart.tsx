"use client";

import { Icon } from "@iconify/react";

export default function SignupSidebarPart() {
  return (
    <div className="relative w-full h-full bg-[#021f12] overflow-hidden flex flex-col items-center justify-center">
      
      {/* Ambient Glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022A15] via-[#044A25] to-[#022A15] opacity-90 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#01A14B]/20 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        
        /* Realistic Typing Animations via Max-Width */
        @keyframes type-first {
          0%, 10% { max-width: 0; border-right-color: #01A14B; }
          16%, 95% { max-width: 50px; border-right-color: transparent; }
          100% { max-width: 0; border-right-color: transparent; }
        }
        @keyframes type-last {
          0%, 20% { max-width: 0; border-right-color: transparent; }
          21% { border-right-color: #01A14B; }
          27%, 95% { max-width: 40px; border-right-color: transparent; }
          100% { max-width: 0; border-right-color: transparent; }
        }
        @keyframes type-email {
          0%, 35% { max-width: 0; border-right-color: transparent; }
          36% { border-right-color: #01A14B; }
          48%, 95% { max-width: 170px; border-right-color: transparent; }
          100% { max-width: 0; border-right-color: transparent; }
        }
        @keyframes type-pass {
          0%, 55% { max-width: 0; border-right-color: transparent; }
          56% { border-right-color: #01A14B; }
          65%, 95% { max-width: 80px; border-right-color: transparent; }
          100% { max-width: 0; border-right-color: transparent; }
        }
        
        /* Cursor Swoop & Click */
        @keyframes cursorMove {
          0%, 65% { top: 60%; left: 110%; opacity: 0; }
          70% { top: 60%; left: 80%; opacity: 1; transform: scale(1); }
          75% { top: 88%; left: 50%; transform: scale(1); }
          78% { top: 88%; left: 50%; transform: scale(0.8); } /* Click Down */
          85%, 92% { top: 88%; left: 50%; transform: scale(1); opacity: 1; }
          96%, 100% { top: 110%; left: 50%; opacity: 0; }
        }

        /* Button Click Reaction */
        @keyframes buttonReact {
          0%, 76% { transform: scale(1); background-color: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
          78% { transform: scale(0.95); } /* Compress */
          81%, 94% { transform: scale(1); background-color: #01A14B; border-color: #01A14B; }
          100% { transform: scale(1); background-color: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        }
        @keyframes textSwapDefault {
          0%, 80% { opacity: 1; }
          81%, 94% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes textSwapSuccess {
          0%, 80% { opacity: 0; }
          81%, 94% { opacity: 1; }
          100% { opacity: 0; }
        }

        /* Data Stream Packets */
        @keyframes streamFlow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }

        .anim-float { animation: float 6s ease-in-out infinite; }
        .anim-cursor { animation: cursorMove 8s ease-in-out infinite; }
        .anim-btn { animation: buttonReact 8s ease-in-out infinite; }
        .anim-stream { animation: streamFlow 0.5s linear infinite; }
        
        .mock-input {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid transparent;
          vertical-align: bottom;
        }
      `}} />

      <div className="relative z-10 w-full max-w-[500px] h-[500px] flex items-center justify-center">
        
        {/* =========================================
            THE ROBOT / AI CORE
        ========================================= */}
        <div className="absolute top-[8%] right-[5%] anim-float z-30 flex flex-col items-center" style={{ animationDelay: '1s' }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#01A14B] to-teal-400 p-[2px] shadow-[0_0_30px_rgba(1,161,75,0.5)]">
            <div className="w-full h-full bg-[#021f12] rounded-[14px] flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-[#01A14B]/20 animate-pulse"></div>
              <Icon icon="solar:smart-speaker-minimalistic-bold-duotone" className="text-2xl text-green-400 relative z-10" />
            </div>
          </div>
          <div className="mt-2 bg-[#01A14B]/20 border border-[#01A14B]/50 px-2 py-0.5 rounded text-[8px] text-green-300 font-bold uppercase tracking-wider">
            Auto-Pilot
          </div>
        </div>

        {/* =========================================
            DATA STREAMS (AI to Form)
        ========================================= */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 500 500">
           <path d="M 420 90 Q 350 130 280 190" fill="none" stroke="#01A14B" strokeWidth="2" strokeDasharray="4 6" className="anim-stream opacity-60" />
           <path d="M 420 90 Q 380 220 280 280" fill="none" stroke="#01A14B" strokeWidth="2" strokeDasharray="4 6" className="anim-stream opacity-40" />
        </svg>

        {/* =========================================
            THE REALISTIC FORM CARD SIMULATION
        ========================================= */}
        <div className="relative w-[340px] bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-7 shadow-[0_30px_60px_rgba(0,0,0,0.5)] anim-float z-30">
          
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-tight">
              👋 Hi! Welcome to Hiilbox.
            </h3>
            <p className="text-md text-gray-400 mt-1 font-medium">Let's get started.</p>
          </div>

          {/* Simulated Inputs */}
          <div className="space-y-4 mb-8">
            
            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-md font-semibold text-gray-400 mb-1.5">First Name</label>
                <div className="h-9 w-full bg-black/20 rounded-lg border border-white/10 px-3 flex items-center text-sm font-medium text-white">
                   <span className="mock-input" style={{ animation: 'type-first 8s linear infinite' }}>John</span>
                </div>
              </div>
              <div>
                <label className="block text-md font-semibold text-gray-400 mb-1.5">Last Name</label>
                <div className="h-9 w-full bg-black/20 rounded-lg border border-white/10 px-3 flex items-center text-sm font-medium text-white">
                   <span className="mock-input" style={{ animation: 'type-last 8s linear infinite' }}>Doe</span>
                </div>
              </div>
            </div>

            {/* Row 2: Email */}
            <div>
              <label className="block text-md font-semibold text-gray-400 mb-1.5">Email</label>
              <div className="h-9 w-full bg-black/20 rounded-lg border border-white/10 px-3 flex items-center text-sm font-medium text-white">
                 <span className="mock-input" style={{ animation: 'type-email 8s linear infinite' }}>john.doe@example.com</span>
              </div>
            </div>

            {/* Row 3: Password */}
            <div>
              <label className="block text-md font-semibold text-gray-400 mb-1.5">Password</label>
              <div className="h-9 w-full bg-black/20 rounded-lg border border-white/10 px-3 flex items-center text-sm font-medium text-white">
                 <span className="mock-input tracking-widest" style={{ animation: 'type-pass 8s linear infinite' }}>••••••••</span>
              </div>
            </div>

          </div>

          {/* Simulated Submit Button */}
          <div className="relative w-full h-11 rounded-xl border flex items-center justify-center anim-btn transition-colors duration-200">
             
             {/* Default Text */}
             <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-[13px] tracking-wide" style={{ animation: 'textSwapDefault 8s infinite' }}>
               Sign Up
             </div>
             
             {/* Success Text */}
             <div className="absolute inset-0 flex items-center justify-center gap-2 font-bold text-white text-[13px]" style={{ animation: 'textSwapSuccess 8s infinite' }}>
               <Icon icon="solar:check-circle-bold" className="text-lg" />
               Account Created
             </div>

          </div>

        </div>

        {/* =========================================
            THE ANIMATED CURSOR
        ========================================= */}
        <div className="absolute z-40 anim-cursor pointer-events-none drop-shadow-2xl">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.10051 2.21356L20.8242 12.3338C22.0163 13.213 21.6508 15.084 20.1802 15.3338L15.394 16.1466L12.548 21.6662C11.8797 22.9622 9.94825 22.8687 9.40455 21.5034L3.08428 5.61719C2.55106 4.27787 3.86884 2.92383 5.21046 3.42878L7.10051 2.21356Z" fill="white" stroke="#01A14B" strokeWidth="1.5"/>
           </svg>
        </div>

      </div>

      {/* Motivational Text below the animation */}
      <div className="relative z-10 text-center mt-2">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Automated & Secure.</h2>
        <p className="text-[13px] text-green-200/70 mt-1 max-w-[280px]">Your connection is encrypted and your data is processed safely.</p>
      </div>

    </div>
  );
}