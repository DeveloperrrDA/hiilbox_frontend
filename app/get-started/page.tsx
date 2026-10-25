"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import ThemeShell from "@/components/theme/ThemeShell";

export default function GetStartedPage() {
  return (
    <ThemeShell>
      {/* Ambient background blobs for glass refraction */}
      <div className="fixed left-0 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[#01A14B] opacity-10 blur-[120px] pointer-events-none dark:opacity-20"></div>
      <div className="fixed bottom-0 right-0 -z-10 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#8BD3A8] opacity-20 blur-[120px] pointer-events-none dark:opacity-10"></div>

      <main className="mx-auto max-w-full px-6 pb-24 pt-16 md:px-8 relative z-10 dark:bg-darkgray">
        
        {/* =========================================
            HEADER SECTION
        ========================================= */}
        <div className="mb-16 container-1218 text-center dark:bg-darkgray">
          

          <div className="flex items-center justify-center"> 
            <div className="mb-4 rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary dark:text-primary">
              GET STARTED
            </div>
          </div>
          
          <h1 className="mb-4 text-4xl font-black leading-[1.1] tracking-tight text-dark dark:text-white md:text-5xl lg:text-[3.5rem]">
            Get Started with <span className="text-primary">HiilBox</span>
          </h1>
          
          <h2 className="mb-4 text-xl font-bold text-dark dark:text-white md:text-2xl">
            Everything You Need to Start Fundraising
          </h2>
          
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-dark dark:text-gray-400">
            Follow these simple steps to prepare your documents, register, and create your campaign.
            We'll guide you through the process from start to finish.
          </p>
        </div>

        {/* =========================================
            3-COLUMN GRID SECTION
        ========================================= */}
        <div className="grid grid-cols-1 container-1218 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: Check Your Eligibility */}
          <div className="group flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
            
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-white shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold leading-tight text-dark dark:text-white">
                Check Your Eligibility
              </h3>
            </div>
            
            <ul className="mb-8 space-y-4 text-[14px] leading-relaxed text-[#687280] dark:text-gray-300">
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>You must be 18 years old or above to register for a HiilBox account.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Make sure you can provide valid identification documents.</span>
              </li>
            </ul>

            <div className="mt-auto relative flex h-32 w-full items-end justify-end pb-2 pr-2">
              <div className="absolute bottom-6 right-6 z-10 flex h-28 w-40 flex-col justify-center rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded bg-primary text-white flex items-center justify-center dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]"><Icon icon="solar:user-bold" className="text-2xl" /></div>
                  <div className="flex flex-1 flex-col justify-center gap-1.5">
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600"></div>
                    <div className="h-2 w-3/4 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700"></div>
              </div>
              <div className="absolute right-0 top-2 z-20 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-primary text-lg font-black text-white shadow-md dark:border-dark">
                18+
              </div>
              <div className="absolute bottom-0 right-2 z-30 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-md dark:border-dark">
                <Icon icon="solar:check-bold" className="text-sm" />
              </div>
            </div>
          </div>

          {/* Card 2: Prepare Your Identification */}
          <div className="group flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-white shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold leading-tight text-dark dark:text-white">
                Prepare Your Identification
              </h3>
            </div>
            
            <ul className="mb-8 space-y-4 text-[14px] leading-relaxed text-[#687280] dark:text-gray-300">
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Have a valid national ID card or passport ready.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Your identification is required for verification.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Make sure your name and information match your registration details.</span>
              </li>
            </ul>

            <div className="mt-auto relative flex h-32 w-full items-end justify-end">
              {/* Passport */}
              <div className="absolute bottom-2 right-12 z-10 flex h-[110px] w-[80px] -rotate-12 flex-col items-center justify-center rounded bg-[#006B30] p-2 shadow-lg dark:bg-[#003D1B]">
                <Icon icon="solar:global-outline" className="mb-2 text-3xl text-[#8BD3A8]/50" />
                <div className="h-1 w-10 rounded-full bg-[#8BD3A8]/50"></div>
                <div className="mt-1 h-1 w-6 rounded-full bg-[#8BD3A8]/50"></div>
              </div>
              {/* ID Card */}
              <div className="absolute bottom-4 right-0 z-20 flex h-[70px] w-[110px] items-center gap-2 rounded-lg border border-gray-100 bg-[#E0F2FE] p-2.5 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                <div className="h-10 w-8 rounded bg-white dark:bg-gray-700 flex items-center justify-center"><Icon icon="solar:user-bold" className="text-gray-300 dark:text-gray-500" /></div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="h-1.5 w-full rounded-full bg-[#0284C7]/40 dark:bg-gray-600"></div>
                  <div className="h-1.5 w-full rounded-full bg-[#0284C7]/40 dark:bg-gray-600"></div>
                  <div className="h-1.5 w-2/3 rounded-full bg-[#0284C7]/40 dark:bg-gray-600"></div>
                </div>
              </div>
              <Icon icon="solar:plain-bold" className="absolute right-10 top-0 -rotate-12 text-2xl text-[#01A14B]/40 dark:text-[#8BD3A8]/40" />
            </div>
          </div>

          {/* Card 3: Verify Your Email */}
          <div className="group flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-white shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold leading-tight text-dark dark:text-white">
                Verify Your Email
              </h3>
            </div>
            
            <ul className="mb-8 space-y-4 text-[14px] leading-relaxed text-[#687280] dark:text-gray-300">
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Use an active email address that you can access.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>We will send a verification link to your email.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Click the link to confirm your email address.</span>
              </li>
            </ul>

            <div className="mt-auto relative flex h-32 w-full items-end justify-end pb-2 pr-4">
              <div className="absolute bottom-10 right-8 z-10 flex h-20 w-28 flex-col gap-2 rounded-t-lg bg-white p-3 shadow-sm dark:bg-gray-800">
                <div className="h-1.5 w-1/2 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div className="h-1.5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-600"></div>
              </div>
              <div className="absolute bottom-2 right-4 z-20 flex h-16 w-36 items-center justify-center overflow-hidden rounded-md bg-primary shadow-lg dark:bg-[#006B30]">
                <div className="absolute -top-10 h-0 w-0 border-l-[72px] border-r-[72px] border-t-[60px] border-l-transparent border-r-transparent border-t-[#006B30] dark:border-t-[#003D1B] opacity-40"></div>
              </div>
              <div className="absolute bottom-6 -right-2 z-30 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-primary shadow-lg dark:border-dark dark:bg-[#8BD3A8]">
                <Icon icon="solar:check-bold" className="text-2xl text-white dark:text-dark" />
              </div>
            </div>
          </div>

          {/* Card 4: Choose Your Fundraising Type */}
          <div className="group flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-white shadow-md">
                4
              </div>
              <h3 className="text-xl font-bold leading-tight text-dark dark:text-white">
                Choose Your<br/>Fundraising Type
              </h3>
            </div>
            
            <ul className="mb-8 space-y-4 text-[14px] leading-relaxed text-[#687280] dark:text-gray-300">
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Fundraise for myself.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Fundraise for someone else.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Fundraise for a charity or organization.</span>
              </li>
            </ul>

            <div className="mt-auto relative flex w-full flex-col gap-2 pt-2">
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:user-bold" className="text-xl text-primary dark:text-[#8BD3A8]" />
                  <span className="text-xs font-bold text-[#0F1F17] dark:text-white">For Myself</span>
                </div>
                <Icon icon="solar:alt-arrow-right-outline" className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:users-group-two-rounded-bold" className="text-xl text-primary dark:text-[#8BD3A8]" />
                  <span className="text-xs font-bold text-[#0F1F17] dark:text-white">For Someone Else</span>
                </div>
                <Icon icon="solar:alt-arrow-right-outline" className="text-gray-400" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:buildings-bold" className="text-xl text-primary dark:text-[#8BD3A8]" />
                  <span className="text-xs font-bold text-[#0F1F17] dark:text-white">For an Organization</span>
                </div>
                <Icon icon="solar:alt-arrow-right-outline" className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Card 5: Prepare Your Bank Details */}
          <div className="group flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-white shadow-md">
                5
              </div>
              <h3 className="text-xl font-bold leading-tight text-[#0F1F17] dark:text-white">
                Prepare Your<br/>Bank Details
              </h3>
            </div>
            
            <ul className="mb-8 space-y-4 text-[14px] leading-relaxed text-[#687280] dark:text-gray-300">
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Provide the bank account details of the verified recipient.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>The bank account holder's name must match the verified recipient's name.</span>
              </li>
            </ul>

            <div className="mt-auto relative flex h-32 w-full items-end justify-end">
              <div className="absolute  right-2 z-10 w-48 rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2">
                  <div className="mb-1 text-[8px] font-bold text-[#01A14B] dark:text-[#8BD3A8]">Account Holder Name</div>
                  <div className="h-6 w-full rounded border border-gray-100 bg-gray-50 flex items-center px-2 text-[9px] text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">Your Name</div>
                </div>
                <div className="mb-2">
                  <div className="mb-1 text-[8px] font-bold text-[#01A14B] dark:text-[#8BD3A8]">Bank Name</div>
                  <div className="h-6 w-full rounded border border-gray-100 bg-gray-50 flex items-center px-2 text-[9px] text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">e.g. My Bank</div>
                </div>
                <div>
                  <div className="mb-1 text-[8px] font-bold text-[#01A14B] dark:text-[#8BD3A8]">Account Number</div>
                  <div className="h-6 w-full rounded border border-gray-100 bg-gray-50 flex items-center px-2 text-[9px] text-gray-400 tracking-widest dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">1234 5678 9012</div>
                </div>
              </div>
              <div className="absolute left-6 top-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#01A14B] shadow-md dark:border-dark">
                <Icon icon="tabler:building-bank" className="text-2xl text-white" />
              </div>
            </div>
          </div>

          {/* Card 6: Wait for Admin Verification */}
          <div className="group flex flex-col rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-black text-white shadow-md">
                6
              </div>
              <h3 className="text-xl font-bold leading-tight text-dark dark:text-white">
                Wait for Admin<br/>Verification
              </h3>
            </div>
            
            <ul className="mb-8 space-y-4 text-[14px] leading-relaxed text-[#687280] dark:text-gray-300">
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>Submit your account information and required documents for review.</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon icon="solar:check-circle-bold" className="mt-0.5 shrink-0 text-[20px] text-primary dark:text-[#8BD3A8]" />
                <span>HiilBox aims to complete the review within one business day.</span>
              </li>
            </ul>

            <div className="mt-auto relative flex h-32 w-full items-end justify-end pb-2 pr-2">
              <div className="absolute bottom-2 right-6 z-10 w-48 rounded-xl border border-gray-100 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center gap-2 rounded bg-gray-50 p-2 dark:bg-gray-700">
                  <Icon icon="solar:check-circle-bold" className="text-primary dark:text-[#8BD3A8]" />
                  <span className="text-[10px] text-[#0F1F17] dark:text-gray-300">Submitted</span>
                </div>
                <div className="mb-2 flex items-center gap-2 rounded border border-[#01A14B]/30 bg-[#E6F4EB] p-2 dark:border-[#8BD3A8]/30 dark:bg-[#01A14B]/20">
                  <Icon icon="solar:clock-circle-bold" className="text-primary dark:text-[#8BD3A8]" />
                  <span className="text-[10px] font-bold text-primary dark:text-[#8BD3A8]">Under Review</span>
                </div>
                <div className="flex items-center gap-2 rounded bg-gray-50 p-2 dark:bg-gray-700">
                  <Icon icon="solar:check-circle-linear" className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">Approved</span>
                </div>
              </div>
              <div className="absolute right-0 top-0 z-20 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-yellow-400 shadow-md dark:border-dark">
                <Icon icon="solar:clock-circle-bold" className="text-3xl text-white" />
              </div>
            </div>
          </div>

        </div>

        {/* =========================================
            BOTTOM CTA (New Design)
        ========================================= */}
        <section className="mt-24 flex container-1218 flex-col items-center justify-between gap-12 rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] lg:flex-row lg:p-16">
          
          {/* LEFT COLUMN: Text & Buttons */}
          <div className="flex w-full flex-col items-start lg:w-1/2 p-10">
            <div className="flex items-center justify-center"> 
                <div className="mb-4 rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary dark:text-primary">
                READY TO GET STARTED?
                </div>
            </div>
            <h2 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-dark dark:text-white md:text-5xl">
              Create Your <br className="hidden sm:block" />
              <span className="text-primary">HiilBox</span> Account Today
            </h2>
            <p className="mb-8 max-w-md text-lg leading-relaxed text-[#687280] dark:text-gray-300">
              Prepare your documents and take the first step toward turning your cause into meaningful impact.
            </p>
            
            <Link href="/signup?type=fundraiser" className="group mb-6 inline-flex w-full items-center justify-center space-x-2 rounded-xl bg-primary px-8 py-4 text-[15px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(1,161,75,0.6)] transition hover:bg-[#006B30] dark:shadow-none sm:w-auto">
              <span>Create Your HiilBox Account</span>
              <Icon icon="solar:arrow-right-line-duotone" className="text-lg transform transition-transform group-hover:translate-x-1" />
            </Link>
            
            
          </div>

          {/* RIGHT COLUMN: Illustration Graphic */}
          <div className="relative mt-10 flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end p-10">
            
            {/* Background Light Green Blob */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-72 w-96 rounded-full bg-[#E6F4EB] opacity-90 blur-3xl dark:bg-[#01A14B]/20"></div>

            {/* Paper plane & dashed path */}
            <div className="absolute -top-6 right-0 z-0 opacity-60 dark:opacity-40">
               <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                 <path d="M10,90 Q40,10 90,20" stroke="#01A14B" strokeWidth="2" strokeDasharray="4 4" fill="none" />
               </svg>
               <Icon icon="solar:plain-bold" className="absolute top-0 right-0 text-4xl text-[#01A14B] -rotate-12 dark:text-[#8BD3A8]" />
            </div>

            {/* Leaves */}
            <Icon icon="solar:leaf-bold" className="absolute -left-6 bottom-4 z-10 text-7xl text-[#01A14B] -rotate-45 opacity-90 dark:text-[#8BD3A8]" />
            <Icon icon="solar:leaf-bold" className="absolute -right-4 bottom-10 z-10 text-6xl text-[#006B30] rotate-45 opacity-80" />

            {/* Laptop Base */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Laptop Screen */}
              <div className="relative flex h-56 w-80 flex-col overflow-hidden rounded-t-xl border-[5px] border-gray-800 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:w-96">
                {/* Top Bar */}
                <div className="flex h-5 w-full items-center gap-1.5 bg-[#01A14B] px-3 dark:bg-[#006B30]">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50"></div>
                </div>
                {/* Screen Content */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#01A14B] text-white">
                      <Icon icon="solar:box-bold" className="text-xl" />
                    </div>
                    <span className="text-2xl font-black text-[#0F1F17] dark:text-white">HiilBox</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:check-circle-bold" className="text-2xl text-[#01A14B] dark:text-[#8BD3A8]" />
                      <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:check-circle-bold" className="text-2xl text-[#01A14B] dark:text-[#8BD3A8]" />
                      <div className="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Icon icon="solar:check-circle-bold" className="text-2xl text-[#01A14B] dark:text-[#8BD3A8]" />
                      <div className="h-2 w-40 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Laptop Keyboard / Base */}
              <div className="h-3 w-[22rem] rounded-b-xl bg-gray-300 shadow-md dark:bg-gray-600 sm:w-[26rem]"></div>
              <div className="h-1.5 w-24 rounded-b-md bg-gray-400 dark:bg-gray-500"></div>
            </div>

            {/* Floating Image Card */}
            <div className="absolute -left-8 bottom-12 z-20 flex h-28 w-28 -rotate-12 items-center justify-center rounded-2xl border border-white/60 bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:border-gray-600 dark:bg-gray-800">
               <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-[#E0F2FE] dark:bg-[#0284C7]/20">
                  <Icon icon="solar:gallery-bold" className="text-[3rem] text-[#38BDF8]" />
               </div>
            </div>

            {/* Floating Users Card */}
            <div className="absolute -right-10 bottom-6 z-20 flex h-28 w-28 items-center justify-center rounded-full border border-white/60 bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:border-gray-600 dark:bg-gray-800">
               <Icon icon="solar:users-group-two-rounded-bold" className="text-[4rem] text-[#01A14B] dark:text-[#8BD3A8]" />
            </div>
            
            {/* Inner Screen Floating Heart (To replicate the graphic perfectly) */}
            <div className="absolute bottom-16 right-10 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F4EB] shadow-sm dark:bg-[#01A14B]/20 sm:right-16">
              <Icon icon="solar:heart-bold" className="text-3xl text-[#01A14B] dark:text-[#8BD3A8]" />
            </div>

          </div>
        </section>

      </main>
    </ThemeShell>
  );
}