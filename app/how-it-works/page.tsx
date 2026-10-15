"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import ThemeShell from "@/components/theme/ThemeShell";

const faqs = {
  general: [
    { q: "What is HiilBox?", a: "HiilBox is a trusted crowdfunding and donation platform that helps individuals, families, and organizations raise funds for personal, community, and humanitarian causes. We make it easy, secure, and transparent to create campaigns and receive support from around the world." },
    { q: "How do I start a fundraising campaign?", a: "Starting a campaign is simple. Click on the 'Start a Campaign' button, create an account, and follow the step-by-step guide. You'll need to set a funding goal, write a compelling story explaining why you are raising funds, and add a cover photo or video to your campaign. Once submitted, our team will review it before it goes live." },
    { q: "Is it free to create a campaign?", a: "Yes, creating a campaign on HiilBox is completely free. We do not charge any upfront fees to start your fundraiser. A small platform and payment processing fee is only deducted from each donation you receive to help cover the costs of securely maintaining the platform." },
    { q: "What types of campaigns can I create?", a: "You can create campaigns for a wide variety of causes, including medical expenses, education and scholarships, emergency relief, community development projects, non-profit initiatives, religious causes like mosque construction, and environmental protection efforts. All campaigns must comply with our terms of service." },
    { q: "How do donors make donations?", a: "Donors can easily contribute by visiting a campaign page and clicking the 'Donate' button. They can choose to donate securely using local mobile money options (like ZAAD, EVC Plus, Sahal) or international credit/debit cards. The process is quick, secure, and mobile-friendly." },
    { q: "What payment methods are available?", a: "HiilBox supports a wide range of payment methods to accommodate both local and global donors. We accept major international credit and debit cards (Visa, Mastercard) as well as popular local mobile money services in the region, such as ZAAD, EVC Plus, and Sahal." },
    { q: "How and when can I receive the funds?", a: "Once your campaign starts receiving donations and your identity and payout information are fully verified, you can request a withdrawal from your HiilBox dashboard. Funds are typically transferred directly to your registered bank account or mobile money wallet within a few business days after the request is approved." },
  ],
  fundraisers: [
    { q: "Who can create a fundraising campaign?", a: "Anyone over the age of 18 with a valid government-issued ID and a supported bank account or mobile money wallet can create a campaign. Organizations, charities, and NGOs can also create campaigns by providing their official registration documents." },
    { q: "What documents do I need to verify my identity?", a: "To ensure the security and trust of our platform, you will need to provide a clear copy of a government-issued ID (such as a Passport or National ID card) and a proof of address. Depending on your withdrawal method and region, additional verification may be required." },
    { q: "Can I edit my campaign after it has been published?", a: "Yes, you can update your campaign story, add new photos or videos, and post updates to keep your donors informed about your progress. However, for security and transparency reasons, changing the main fundraising goal or beneficiary details after funds have been raised may require a quick review by our support team." },
    { q: "How do I post an update to my donors?", a: "You can easily post updates from your campaign dashboard. Navigate to 'Manage Campaign', click on the 'Updates' tab, and write your message. You can include photos or videos to show the impact of the donations. This update will be published on your campaign page and an email notification will be sent to your donors." },
    { q: "Are there any deadlines for my campaign?", a: "You have the flexibility to set a specific deadline for your campaign if it is time-sensitive (like emergency medical care), or you can leave it open-ended. If you set a deadline, you can still withdraw the funds you've raised even if the deadline passes and you haven't reached your initial goal." },
    { q: "What happens if I don't reach my fundraising goal?", a: "HiilBox operates on a 'keep what you raise' model. This means you get to keep all the funds you have raised (minus standard transaction fees), even if you don't meet your full target. We believe every single donation counts toward making a positive difference." },
  ],
  donors: [
    { q: "Is my donation secure?", a: "Yes, absolutely. We use industry-standard encryption to protect your personal and payment information. All transactions are processed through trusted local and international payment gateways, and we never store your credit card details or mobile money PINs on our servers." },
    { q: "Can I make a donation anonymously?", a: "Yes! When you go through the checkout process to make a donation, you will see a checkbox option to hide your name and donation amount from the public campaign page. The campaign organizer will still be able to securely see your details for their records." },
    { q: "Will I receive a receipt for my donation?", a: "Yes. As soon as your donation is successfully processed, an automated receipt will be sent to the email address or phone number you provided during checkout. You can keep this receipt for your personal records." },
    { q: "Are my donations tax-deductible?", a: "This depends on the campaign. Donations made to personal campaigns are generally not tax-deductible. However, if you are donating to a campaign run by a registered charity or non-profit organization (NGO), they may issue you a tax receipt directly. HiilBox itself does not issue tax receipts." },
    { q: "What happens if a campaign doesn't hit its goal?", a: "HiilBox allows organizers to keep whatever funds they raise, even if they fall short of their overall target. Your donation will still be transferred to the campaign organizer to help them advance their cause, regardless of whether the final goal is met." },
  ],
  payments: [
    { q: "What payment methods does HiilBox accept?", a: "We accept major international credit and debit cards (Visa, Mastercard) as well as popular local mobile money solutions such as ZAAD, EVC Plus, eDahab, and Sahal. This ensures that anyone, anywhere, can easily support your cause." },
    { q: "Are there any transaction fees for donations?", a: "Yes, a standard third-party processing fee is deducted by the payment providers (like banks or mobile networks) for each donation. HiilBox also deducts a small platform fee to maintain secure and reliable services. Donors are sometimes given the option to cover these fees so 100% of their intended donation goes to the cause." },
    { q: "What currencies are supported on the platform?", a: "While campaigns are typically displayed in major currencies like USD to ensure global readability, donors can contribute using their local currency. Our payment processors automatically handle the currency conversion at standard bank rates at the time of checkout." },
    { q: "Why was my payment declined?", a: "Payments can be declined for several reasons, such as insufficient funds, incorrect card details, or anti-fraud blocks by your bank. If using mobile money, ensure you have sufficient balance and have entered the correct PIN when prompted on your device. Contact your bank or provider if the issue persists." },
    { q: "Can I get a refund if I made a mistake?", a: "Yes, refunds can be requested within a short window after the donation is made, provided the funds haven't already been withdrawn by the campaign organizer. Please contact our support team immediately with your receipt details to request a refund." },
  ],
  withdrawals: [
    { q: "How long does it take to receive a withdrawal?", a: "Withdrawal requests are typically processed within 1-3 business days. Once processed, funds sent via mobile money (like ZAAD, EVC Plus) usually arrive almost instantly, while bank transfers may take an additional 2-5 business days depending on your bank." },
    { q: "Are there fees for withdrawing funds?", a: "HiilBox does not charge a fee for standard withdrawals. However, your bank or mobile money provider may apply standard receiving or transfer fees depending on their specific policies and your location." },
    { q: "How do I request a withdrawal?", a: "Log into your HiilBox account, navigate to your Campaign Dashboard, and click on 'Wallet' or 'Withdraw Funds'. Enter the amount you wish to withdraw, select your pre-approved bank account or mobile money number, and submit your request." },
    { q: "What is the minimum amount I can withdraw?", a: "The minimum withdrawal amount depends on the payout method selected. For local mobile money, the minimum is generally very low (e.g., $10). For international bank transfers, the minimum threshold may be higher due to banking network requirements." },
    { q: "Can I withdraw funds before my campaign ends?", a: "Yes! You don't have to wait for your campaign to reach its goal or pass its deadline. You can request a withdrawal of any cleared funds currently available in your campaign balance at any time." },
  ],
  security: [
    { q: "How does HiilBox keep my personal information secure?", a: "We use advanced encryption protocols (SSL/TLS) to secure all data transmitted between your device and our servers. We strictly comply with data protection standards and never sell or share your private personal information with unauthorized third parties." },
    { q: "How do you verify the legitimacy of a campaign?", a: "Trust is our top priority. We require campaign organizers to undergo a Know Your Customer (KYC) process, which involves verifying their identity using government-issued IDs and proof of address before any funds can be withdrawn from the platform." },
    { q: "Are my payment details safe when donating?", a: "Yes. We partner with PCI-compliant payment gateways and trusted mobile money operators (like ZAAD, EVC Plus, and Sahal). HiilBox does not store your credit card numbers or mobile money PINs on our servers at any time." },
    { q: "What happens if I suspect a campaign is fraudulent?", a: "If you spot anything suspicious, you can easily use the 'Report Campaign' link found on every campaign page. Our dedicated Trust and Safety team investigates all reports immediately and will pause withdrawals until the issue is thoroughly resolved." },
    { q: "Does HiilBox have a refund policy for fraud?", a: "In the rare event that a campaign is proven to be fraudulent and the funds have not yet been disbursed to the organizer, we will initiate refunds back to the donors. We are committed to ensuring your donations are protected." },
  ],
};

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof faqs>("general");
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabClick = (tab: keyof typeof faqs) => {
    setActiveTab(tab);
    setOpenAccordion(0);
  };

  const handleAccordionClick = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const displayedFaqs = faqs[activeTab].filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeShell>
      {/* Ambient background blobs for glass refraction */}
      <div className="fixed left-0 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[#01A14B] opacity-10 blur-[120px] pointer-events-none dark:opacity-20"></div>
      <div className="fixed bottom-0 right-0 -z-10 h-[600px] w-[600px] translate-x-1/3 translate-y-1/3 rounded-full bg-[#8BD3A8] opacity-20 blur-[120px] pointer-events-none dark:opacity-10"></div>

      <main className="mx-auto max-w-7xl px-4 pb-24 md:px-8 relative z-10">
        
        {/* =========================================
            HERO SECTION
        ========================================= */}
        <section className="mx-auto max-w-3xl py-16 items-center text-center">
          <div className="flex items-center justify-center"> 
            <div className="mb-4 rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary dark:text-lightprimary">
              HOW HIILBOX WORKS
            </div>
          </div>
          
          
          <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-[#0F1F17] dark:text-white md:text-5xl lg:text-[3.5rem]">
            Turn Your Cause Into Support<br/>
            <span className="text-primary">in Six Simple Steps</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-[#687280] dark:text-gray-300">
            From creating your account to receiving your funds, HiilBox makes fundraising easy, secure, and transparent — all in one trusted platform.
          </p>
        </section>

        {/* =========================================
            6 STEPS GRID (GLASSMORPHISM)
        ========================================= */}
        <section id="steps" className="mb-24 grid grid-cols-1 gap-6 lg:grid-cols-2">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10 sm:flex-row sm:p-8">
            <div className="w-full sm:w-[45%]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/50 text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                <Icon icon="solar:user-bold" className="text-xl" />
              </div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#01A14B] dark:text-[#8BD3A8]">STEP 01</div>
              <h3 className="mb-2 text-xl font-bold leading-tight text-[#0F1F17] dark:text-white">Create Your<br/>HiilBox Account</h3>
              <p className="text-base leading-relaxed text-[#687280] dark:text-gray-400">Sign up and set up your fundraiser profile to get started.</p>
            </div>
            <div className="relative flex h-48 w-full items-center justify-center sm:w-[55%]">
              <div className="relative z-10 w-48 rounded-xl border border-white/60 bg-white/80 p-4 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div className="mb-4 space-y-2">
                  <div className="flex h-7 items-center gap-2 rounded border border-gray-100 bg-gray-50/50 px-2 text-gray-400 dark:border-gray-700 dark:bg-gray-800/50">
                    <Icon icon="solar:user-rounded-bold" className="text-[10px]" /> <span className="text-[9px]">Full Name</span>
                  </div>
                  <div className="flex h-7 items-center gap-2 rounded border border-gray-100 bg-gray-50/50 px-2 text-gray-400 dark:border-gray-700 dark:bg-gray-800/50">
                    <Icon icon="solar:letter-bold" className="text-[10px]" /> <span className="text-[9px]">Email Address</span>
                  </div>
                  <div className="flex h-7 items-center gap-2 rounded border border-gray-100 bg-gray-50/50 px-2 text-gray-400 dark:border-gray-700 dark:bg-gray-800/50">
                    <Icon icon="solar:lock-keyhole-bold" className="text-[10px]" /> <span className="text-[9px]">Password</span>
                  </div>
                </div>
                <div className="flex h-7 items-center justify-center rounded bg-[#01A14B] text-[10px] font-bold text-white shadow-sm">Create Account</div>
              </div>
              <div className="absolute right-0 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white/80 bg-[#E6F4EB] shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-[#01A14B]/20">
                <Icon icon="solar:user-circle-bold" className="text-2xl text-[#01A14B] dark:text-[#8BD3A8]" />
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10 sm:flex-row sm:p-8">
            <div className="w-full sm:w-[45%]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/50 text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                <Icon icon="solar:pen-bold" className="text-xl" />
              </div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#01A14B] dark:text-[#8BD3A8]">STEP 02</div>
              <h3 className="mb-2 text-xl font-bold leading-tight text-[#0F1F17] dark:text-white">Tell Your Story</h3>
              <p className="text-base leading-relaxed text-[#687280] dark:text-gray-400">Set your goal, add photos or videos, and explain how the funds will help.</p>
            </div>
            <div className="relative flex h-48 w-full items-center justify-center sm:w-[55%]">
              <div className="relative z-10 flex w-56 gap-3 rounded-xl border border-white/60 bg-white/80 p-3 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="relative flex h-24 w-1/2 items-center justify-center overflow-hidden rounded-lg border border-white/40 bg-[#E6F4EB]/50 text-[#01A14B] dark:border-[#01A14B]/20 dark:bg-[#01A14B]/10 dark:text-[#8BD3A8]">
                  <Icon icon="solar:gallery-bold" className="text-2xl opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                    <Icon icon="solar:play-circle-bold" className="text-3xl text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="flex w-1/2 flex-col justify-center">
                  <div className="mb-1 text-[9px] font-bold text-gray-500 dark:text-gray-400">Fundraising Goal</div>
                  <div className="mb-2 text-lg font-black text-[#0F1F17] dark:text-white">$5,000</div>
                  <div className="flex gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded border border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-700 dark:bg-gray-800/50"><Icon icon="solar:gallery-bold" className="text-[10px]" /></div>
                    <div className="flex h-6 w-6 items-center justify-center rounded border border-gray-100 bg-gray-50/50 text-gray-400 dark:border-gray-700 dark:bg-gray-800/50"><Icon icon="solar:videocamera-bold" className="text-[10px]" /></div>
                    <div className="flex h-6 w-6 items-center justify-center rounded border border-dashed border-gray-300 text-gray-400 dark:border-gray-600"><Icon icon="solar:add-circle-bold" className="text-[10px]" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10 sm:flex-row sm:p-8">
            <div className="w-full sm:w-[45%]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/50 text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                <Icon icon="solar:shield-check-bold" className="text-xl" />
              </div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#01A14B] dark:text-[#8BD3A8]">STEP 03</div>
              <h3 className="mb-2 text-xl font-bold leading-tight text-[#0F1F17] dark:text-white">Verification<br/>and Review</h3>
              <p className="text-base leading-relaxed text-[#687280] dark:text-gray-400">Submit required documents and get your campaign reviewed and approved.</p>
            </div>
            <div className="relative flex h-48 w-full items-center justify-center sm:w-[55%]">
              <div className="relative z-10 w-48 rounded-xl border border-white/60 bg-white/80 p-4 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-3 text-[10px] font-bold text-[#0F1F17] dark:text-white">Identity Verification</div>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/50 p-1.5 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-600 dark:text-gray-300"><Icon icon="solar:id-card-bold" className="text-[#01A14B] dark:text-[#8BD3A8]" /> Government ID</div>
                    <Icon icon="solar:check-circle-bold" className="text-[#01A14B] dark:text-[#8BD3A8]" />
                  </div>
                  <div className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/50 p-1.5 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-600 dark:text-gray-300"><Icon icon="solar:document-bold" className="text-[#01A14B] dark:text-[#8BD3A8]" /> Proof of Address</div>
                    <Icon icon="solar:check-circle-bold" className="text-[#01A14B] dark:text-[#8BD3A8]" />
                  </div>
                  <div className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/50 p-1.5 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-600 dark:text-gray-300"><Icon icon="solar:list-bold" className="text-[#01A14B] dark:text-[#8BD3A8]" /> Campaign Details</div>
                    <Icon icon="solar:check-circle-bold" className="text-[#01A14B] dark:text-[#8BD3A8]" />
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white/80 bg-[#01A14B] shadow-lg backdrop-blur-md dark:border-white/20">
                <Icon icon="solar:check-read-bold" className="text-lg text-white" />
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10 sm:flex-row sm:p-8">
            <div className="w-full sm:w-[45%]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/50 text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                <Icon icon="solar:share-bold" className="text-xl" />
              </div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#01A14B] dark:text-[#8BD3A8]">STEP 04</div>
              <h3 className="mb-2 text-xl font-bold leading-tight text-[#0F1F17] dark:text-white">Share Your<br/>Campaign</h3>
              <p className="text-base leading-relaxed text-[#687280] dark:text-gray-400">Share your campaign link with friends, family, and supporters worldwide.</p>
            </div>
            <div className="relative flex h-48 w-full items-center justify-center sm:w-[55%]">
              <div className="relative z-10 flex w-56 flex-col items-center rounded-xl border border-white/60 bg-white/80 p-4 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-4 flex h-8 w-full items-center justify-between rounded border border-gray-200 bg-gray-50/50 px-2 dark:border-gray-700 dark:bg-gray-800/50">
                  <span className="w-4/5 truncate text-[9px] text-gray-500">https://hiilbox.com/campaign/v...</span>
                  <Icon icon="solar:copy-bold" className="cursor-pointer text-[#01A14B] dark:text-[#8BD3A8]" />
                </div>
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm"><Icon icon="fa-brands:whatsapp" className="text-lg" /></div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm"><Icon icon="fa-brands:facebook-f" className="text-lg" /></div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white shadow-sm"><Icon icon="fa-brands:x-twitter" className="text-sm" /></div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-gray-100/50 text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300"><Icon icon="solar:share-bold" className="text-sm" /></div>
                </div>
              </div>
              <Icon icon="solar:plain-bold" className="absolute right-8 top-4 -rotate-12 transform text-3xl text-[#01A14B] opacity-40 dark:text-[#8BD3A8]" />
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10 sm:flex-row sm:p-8">
            <div className="w-full sm:w-[45%]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/50 text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                <Icon icon="solar:wallet-bold" className="text-xl" />
              </div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#01A14B] dark:text-[#8BD3A8]">STEP 05</div>
              <h3 className="mb-2 text-xl font-bold leading-tight text-[#0F1F17] dark:text-white">Receive Donations</h3>
              <p className="text-base leading-relaxed text-[#687280] dark:text-gray-400">Get donations through multiple secure payment methods.</p>
            </div>
            <div className="relative flex h-48 w-full items-center justify-center sm:w-[55%]">
              <div className="relative z-10 w-48 rounded-xl border border-white/60 bg-white/80 p-4 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-3 text-[10px] font-bold text-[#01A14B] dark:text-[#8BD3A8]">Payment Methods</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/50 p-1.5 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#0F1F17] dark:text-gray-200"><span className="rounded bg-[#00A651] px-1 py-0.5 text-[7px] text-white">ZAAD</span> Zaad</div>
                    <div className="relative h-3 w-6 rounded-full bg-[#01A14B]"><div className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white"></div></div>
                  </div>
                  <div className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/50 p-1.5 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#0F1F17] dark:text-gray-200"><span className="rounded bg-[#00529B] px-1 py-0.5 text-[7px] text-white">EVC</span> EVC Plus</div>
                    <div className="relative h-3 w-6 rounded-full bg-[#01A14B]"><div className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white"></div></div>
                  </div>
                  <div className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/50 p-1.5 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#0F1F17] dark:text-gray-200"><span className="rounded bg-[#E31837] px-1 py-0.5 text-[7px] text-white">S</span> Sahal</div>
                    <div className="relative h-3 w-6 rounded-full bg-[#01A14B]"><div className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white"></div></div>
                  </div>
                  <div className="flex items-center justify-between rounded border border-gray-100 bg-gray-50/50 p-1.5 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#0F1F17] dark:text-gray-200"><Icon icon="solar:card-bold" className="text-gray-500" /> Card</div>
                    <div className="relative h-3 w-6 rounded-full bg-[#01A14B]"><div className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10 sm:flex-row sm:p-8">
            <div className="w-full sm:w-[45%]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/50 bg-white/50 text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                <Icon icon="solar:bank-bold" className="text-xl" />
              </div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#01A14B] dark:text-[#8BD3A8]">STEP 06</div>
              <h3 className="mb-2 text-xl font-bold leading-tight text-[#0F1F17] dark:text-white">Request Your Payout</h3>
              <p className="text-base leading-relaxed text-[#687280] dark:text-gray-400">When funds are ready, submit a payout request to your bank account.</p>
            </div>
            <div className="relative flex h-48 w-full items-center justify-center sm:w-[55%]">
              <div className="relative z-10 mr-8 w-40 rounded-xl border border-white/60 bg-white/80 p-3 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-2 text-[9px] font-bold text-[#0F1F17] dark:text-white">Request Withdrawal</div>
                <div className="mb-2 h-6 rounded border border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50"></div>
                <div className="mb-3 h-6 w-3/4 rounded border border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/50"></div>
                <div className="flex h-6 w-full items-center justify-center rounded bg-[#01A14B] text-[9px] font-bold text-white shadow-sm">Submit Request</div>
              </div>
              <div className="absolute right-0 top-1/2 z-20 flex w-28 -translate-y-1/2 flex-col items-center rounded-lg border border-white/80 bg-white/60 p-2 text-center shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-white/10">
                <Icon icon="solar:bank-bold" className="mb-1 text-2xl text-[#01A14B] dark:text-[#8BD3A8]" />
                <div className="mb-0.5 text-[8px] font-bold text-[#0F1F17] dark:text-white">Funds Transferred</div>
                <div className="text-[6px] text-gray-500 dark:text-gray-400">to your bank account</div>
                <div className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-[#01A14B] text-white shadow-sm dark:border-dark">
                  <Icon icon="solar:check-read-bold" className="text-[8px]" />
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* =========================================
            PLATFORM FEATURES (GLASSMORPHISM)
        ========================================= */}
        <section className="mb-24 relative z-10">
          <div className="mb-16 flex flex-col items-center text-center">
            <div className="flex items-center justify-center"> 
              <div className="mb-4 rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary dark:text-lightprimary">
                PLATFORM FEATURES
              </div>
            </div>
            
            <h2 className="mb-6 max-w-3xl text-3xl font-black leading-tight tracking-tight text-[#0F1F17] dark:text-white md:text-4xl lg:text-[2.75rem]">
              A Simple and Powerful System<br/><span className="text-[#01A14B]">for Your Fundraising Journey</span>
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-[#687280] dark:text-gray-300">
              HiilBox gives you easy-to-use tools to create, manage, and grow your campaigns while keeping your donations secure and transparent.
            </p>
          </div>

          {/* Top Row */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            {/* Dashboard Analytics */}
            <div className="flex flex-col rounded-[2rem] border border-white/60 bg-lightprimary dark:bg-primary/30p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10 md:p-8">
              <div className="absolute right-[15%] top-10 z-0 hidden h-16 w-16 text-[#8BD3A8]/50 dark:text-[#8BD3A8]/20 md:block">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
                  <pattern id="dots-hero-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.5"></circle></pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-hero-1)"></rect>
                </svg>
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-white text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                  <Icon icon="solar:chart-square-bold" className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#01A14B] dark:text-[#8BD3A8]">Dashboard Analytics</h3>
              </div>
              <p className="mb-8 pr-4 text-base text-[#687280] dark:text-gray-400">
                Get a clear overview of your campaign performance, track donations, and see key statistics in real time.
              </p>
              
              <div className="mt-auto rounded-xl border border-white/60 bg-white p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-5 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#0F1F17] dark:text-white">Overview</h4>
                  <div className="flex cursor-pointer items-center gap-1 rounded border border-gray-200 bg-white/50 px-2 py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-800">
                    <Icon icon="solar:calendar-bold" /> Last 30 days <Icon icon="solar:alt-arrow-down-bold" className="ml-1" />
                  </div>
                </div>
                <div className="mb-6 grid grid-cols-4 gap-3">
                  <div className="rounded-lg bg-[#F0F9FF]/80 p-3 dark:bg-blue-900/20">
                    <div className="mb-1 text-[9px] text-gray-500 dark:text-gray-400">Total Donation</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#0369A1] dark:text-blue-400">$9,250 <Icon icon="solar:graph-up-bold" className="text-[10px] text-[#0EA5E9]" /></div>
                  </div>
                  <div className="rounded-lg bg-[#F0FDF4]/80 p-3 dark:bg-green-900/20">
                    <div className="mb-1 text-[9px] text-gray-500 dark:text-gray-400">Net Donation</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#166534] dark:text-green-400">$8,420 <Icon icon="solar:graph-up-bold" className="text-[10px] text-[#22C55E]" /></div>
                  </div>
                  <div className="rounded-lg bg-[#FAF5FF]/80 p-3 dark:bg-purple-900/20">
                    <div className="mb-1 text-[9px] text-gray-500 dark:text-gray-400">Average Donation</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#6B21A8] dark:text-purple-400">$12.50 <Icon icon="solar:graph-down-bold" className="text-[10px] text-[#A855F7]" /></div>
                  </div>
                  <div className="rounded-lg bg-[#FFF7ED]/80 p-3 dark:bg-orange-900/20">
                    <div className="mb-1 text-[9px] text-gray-500 dark:text-gray-400">Total Donors</div>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#9A3412] dark:text-orange-400">320 <Icon icon="solar:graph-up-bold" className="text-[10px] text-[#F97316]" /></div>
                  </div>
                </div>
                <div className="mb-3 text-[11px] font-bold text-gray-700 dark:text-gray-300">Revenue for Period</div>
                <div className="relative flex h-28 w-full flex-col justify-end">
                  <div className="absolute left-0 top-0 flex h-full flex-col justify-between pb-5 text-[8px] text-gray-400">
                    <span>8</span><span>6</span><span>4</span><span>2</span><span>0</span>
                  </div>
                  <div className="relative ml-5 h-full w-[calc(100%-1.25rem)]">
                    <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#01A14B" stopOpacity="0.25"></stop>
                          <stop offset="100%" stopColor="#01A14B" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                      <path d="M0,40 L0,38 C10,38 20,32 30,30 C35,29 45,5 50,5 C55,5 65,29 70,30 C80,32 90,38 100,38 L100,40 Z" fill="url(#chartGrad)"></path>
                      <path d="M0,38 C10,38 20,32 30,30 C35,29 45,5 50,5 C55,5 65,29 70,30 C80,32 90,38 100,38" fill="none" stroke="#01A14B" strokeWidth="1.5"></path>
                      <circle cx="50" cy="5" r="1.5" fill="#01A14B"></circle>
                    </svg>
                    <div className="absolute bottom-[-16px] mt-2 flex w-full justify-between text-[7px] text-gray-400">
                      <span>Sep 9</span><span>Sep 12</span><span>Sep 15</span><span>Sep 18</span><span>Sep 21</span><span>Sep 24</span><span>Sep 27</span><span>Sep 30</span><span>Oct 3</span><span>Oct 6</span><span>Oct 9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Campaign Easily */}
            <div className="flex flex-col rounded-[2rem] border border-white/60 bg-lightprimary dark:bg-primary/30  p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10 md:p-8">
              <div className="absolute right-[15%] top-10 z-0 hidden h-16 w-16 text-[#8BD3A8]/50 dark:text-[#8BD3A8]/20 md:block">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
                  <pattern id="dots-hero-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.5"></circle></pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-hero-1)"></rect>
                </svg>
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-white text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                  <Icon icon="solar:pen-bold" className="text-2xl" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-[#01A14B] dark:text-[#8BD3A8]">Create a Campaign Easily</h3>
              </div>
              <p className="mb-8 pr-4 text-base text-[#687280] dark:text-gray-400">
                Set your goal, tell your story, upload photos or videos, and launch your campaign in just a few minutes.
              </p>
              
              <div className="mt-auto rounded-xl border border-white/60 bg-white p-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 text-[11px] font-bold text-gray-400 dark:border-gray-800">
                  <span className="text-[#0F1F17] dark:text-white">Edit Campaign</span>
                  <div className="flex gap-4">
                    <span className="mb-[-13px] flex items-center gap-1 border-b-2 border-[#01A14B] pb-[11px] text-[#01A14B] dark:text-[#8BD3A8] dark:border-[#8BD3A8]"><Icon icon="solar:pen-bold" className="text-sm" /> Basic</span>
                    <span className="flex cursor-pointer items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300"><Icon icon="solar:wad-of-money-bold" className="text-sm" /> Goal</span>
                    <span className="flex cursor-pointer items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300"><Icon icon="solar:settings-bold" className="text-sm" /> Options</span>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-1/2 space-y-3">
                    <div>
                      <div className="mb-1 text-[10px] font-medium text-gray-500">Title</div>
                      <div className="rounded border border-gray-200 bg-white/50 px-2 py-1.5 text-[10px] text-[#0F1F17] dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-200">Help Provide Clean Water for Our Community</div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] font-medium text-gray-500">Description</div>
                      <div className="h-16 align-top rounded border border-gray-200 bg-white/50 px-2 py-1.5 text-[10px] text-gray-400 dark:border-gray-700 dark:bg-gray-800/50">e.g. Help us build a clean water well for families in need.</div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] font-medium text-gray-500">Images</div>
                      <div className="flex h-[4.5rem] cursor-pointer flex-col items-center justify-center gap-0.5 rounded border border-dashed border-gray-300 bg-white/50 text-[9px] text-gray-400 transition-colors hover:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
                        <span className="flex items-center gap-1 font-medium text-[#0F1F17] dark:text-white"><Icon icon="solar:upload-bold" className="text-sm" /> Upload images</span>
                        Drag and drop, or upload images
                      </div>
                    </div>
                  </div>
                  <div className="w-1/2 space-y-3">
                    <div>
                      <div className="mb-1 text-[10px] font-medium text-gray-500">Video</div>
                      <div className="flex h-[5.5rem] cursor-pointer flex-col items-center justify-center gap-0.5 rounded border border-dashed border-gray-300 bg-white/50 text-[9px] text-gray-400 transition-colors hover:bg-white dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800">
                        <Icon icon="solar:videocamera-bold" className="mb-0.5 text-lg text-gray-500" />
                        <span className="text-[10px] font-medium text-[#0F1F17] dark:text-white">Upload video</span>
                        Drag and drop, or upload video
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] font-medium text-gray-500">Category</div>
                      <div className="flex cursor-pointer items-center justify-between rounded border border-gray-200 bg-white/50 px-2 py-1.5 text-[10px] text-gray-400 dark:border-gray-700 dark:bg-gray-800/50">
                        Select an option <Icon icon="solar:alt-arrow-down-bold" className="text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] font-medium text-gray-500">Location</div>
                      <div className="flex cursor-pointer items-center justify-between rounded border border-gray-200 bg-white/50 px-2 py-1.5 text-[10px] text-gray-400 dark:border-gray-700 dark:bg-gray-800/50">
                        Select an option <Icon icon="solar:alt-arrow-down-bold" className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* Bottom Row */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            
            {/* Manage Donations */}
            <div className="flex flex-col rounded-[2rem] border border-white/60 bg-lightprimary dark:bg-primary/30 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
              <div className="absolute right-[15%] top-10 z-0 hidden h-16 w-16 text-[#8BD3A8]/50 dark:text-[#8BD3A8]/20 md:block">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
                  <pattern id="dots-hero-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.5"></circle></pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-hero-1)"></rect>
                </svg>
              </div>
              <div className="mb-3 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-white text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                  <Icon icon="solar:hand-heart-bold" className="text-xl" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[#01A14B] dark:text-[#8BD3A8]">Manage Donations</h3>
              </div>
              <p className="mb-6 pr-2 text-base leading-relaxed text-[#687280] dark:text-gray-400">
                View and manage all donations in one place. Track donor details, payment status, and campaign progress easily.
              </p>
              
              <div className="mt-auto rounded-xl border border-white/60 bg-white p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-3 text-xs font-bold text-[#0F1F17] dark:text-white">Donations</div>
                <div className="mb-3 flex gap-2">
                  <div className="flex cursor-pointer items-center gap-1 rounded border border-gray-200 bg-white/50 px-2 py-1 text-[8px] text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">All Campaigns <Icon icon="solar:alt-arrow-down-bold" /></div>
                  <div className="flex cursor-pointer items-center gap-1 rounded border border-gray-200 bg-white/50 px-2 py-1 text-[8px] text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">Completed <Icon icon="solar:alt-arrow-down-bold" /></div>
                  <div className="ml-auto flex items-center gap-1 rounded border border-gray-200 bg-white/50 px-2 py-1 text-[8px] text-gray-400 dark:border-gray-700 dark:bg-gray-800/50"><Icon icon="solar:magnifer-bold" /> Search...</div>
                </div>
                
                <div className="w-full">
                  <div className="mb-1.5 flex border-b border-gray-100 pb-1.5 text-[8px] font-bold text-gray-400 dark:border-gray-800">
                    <div className="w-[12%]">ID</div><div className="w-[18%]">Amount</div><div className="w-[35%]">Campaign</div><div className="w-[15%]">Date</div><div className="w-[20%] text-right">Status</div>
                  </div>
                  <div className="flex items-center border-b border-gray-50 py-1.5 text-[8px] text-gray-600 dark:border-gray-800/50 dark:text-gray-400">
                    <div className="w-[12%]">#173</div><div className="w-[18%] font-bold text-[#01A14B] dark:text-[#8BD3A8]">$1.00</div><div className="w-[35%] truncate pr-1 text-[#0F1F17] dark:text-gray-300">Clean Water Project</div><div className="w-[15%]">9/28/2026</div><div className="w-[20%] text-right"><span className="inline-block rounded border border-white/50 bg-[#E6F4EB]/80 px-1.5 py-0.5 text-[7px] font-bold text-[#01A14B] shadow-sm backdrop-blur-sm dark:border-[#01A14B]/20 dark:bg-[#01A14B]/10 dark:text-[#8BD3A8]">Completed</span></div>
                  </div>
                  <div className="flex items-center border-b border-gray-50 py-1.5 text-[8px] text-gray-600 dark:border-gray-800/50 dark:text-gray-400">
                    <div className="w-[12%]">#170</div><div className="w-[18%] font-bold text-[#01A14B] dark:text-[#8BD3A8]">$5.00</div><div className="w-[35%] truncate pr-1 text-[#0F1F17] dark:text-gray-300">Education Support</div><div className="w-[15%]">9/26/2026</div><div className="w-[20%] text-right"><span className="inline-block rounded border border-white/50 bg-[#E6F4EB]/80 px-1.5 py-0.5 text-[7px] font-bold text-[#01A14B] shadow-sm backdrop-blur-sm dark:border-[#01A14B]/20 dark:bg-[#01A14B]/10 dark:text-[#8BD3A8]">Completed</span></div>
                  </div>
                  <div className="flex items-center py-1.5 text-[8px] text-gray-600 dark:text-gray-400">
                    <div className="w-[12%]">#169</div><div className="w-[18%] font-bold text-[#01A14B] dark:text-[#8BD3A8]">$1.00</div><div className="w-[35%] truncate pr-1 text-[#0F1F17] dark:text-gray-300">Community Health</div><div className="w-[15%]">9/26/2026</div><div className="w-[20%] text-right"><span className="inline-block rounded border border-white/50 bg-[#E6F4EB]/80 px-1.5 py-0.5 text-[7px] font-bold text-[#01A14B] shadow-sm backdrop-blur-sm dark:border-[#01A14B]/20 dark:bg-[#01A14B]/10 dark:text-[#8BD3A8]">Completed</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Manage Donors */}
            <div className="flex flex-col rounded-[2rem] border border-white/60 bg-lightprimary dark:bg-primary/30 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
              <div className="">
                <div className="absolute right-[15%] top-10 z-0 hidden h-16 w-16 text-[#8BD3A8]/50 dark:text-[#8BD3A8]/20 md:block">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
                    <pattern id="dots-hero-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.5"></circle></pattern>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-hero-1)"></rect>
                  </svg>
                </div>
                <div className="mb-3 flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-white text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                    <Icon icon="solar:users-group-two-rounded-bold" className="text-xl" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-[#01A14B] dark:text-[#8BD3A8]">Manage Your Donors</h3>
                </div>
                <p className="mb-6 pr-2 text-base leading-relaxed text-[#687280] dark:text-gray-400">
                  See the list of your donors, their total contributions, and latest donations in one place.
                </p>
                
                <div className="mt-auto rounded-xl border border-white/60 bg-white p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                  <div className="mb-3 text-xs font-bold text-[#0F1F17] dark:text-white">Donors</div>
                  <div className="mb-3 flex gap-2">
                    <div className="flex w-full max-w-[120px] cursor-pointer items-center justify-between rounded border border-gray-200 bg-white/50 px-2 py-1 text-[8px] text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">All Campaigns <Icon icon="solar:alt-arrow-down-bold" /></div>
                    <div className="ml-auto flex w-full max-w-[100px] items-center gap-1 rounded border border-gray-200 bg-white/50 px-2 py-1 text-[8px] text-gray-400 dark:border-gray-700 dark:bg-gray-800/50"><Icon icon="solar:magnifer-bold" /> Search...</div>
                  </div>
                  
                  <div className="w-full">
                    <div className="mb-1.5 flex border-b border-gray-100 pb-1.5 text-[7px] font-bold text-gray-400 dark:border-gray-800">
                      <div className="w-[35%]">Donor Details</div><div className="w-[20%] text-center">Donations</div><div className="w-[20%]">Total Given</div><div className="w-[25%] text-right">Latest Donation</div>
                    </div>
                    <div className="flex items-center border-b border-gray-50 py-1.5 text-[8px] text-gray-600 dark:border-gray-800/50 dark:text-gray-400">
                      <div className="flex w-[35%] items-center gap-1.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[7px] font-bold text-gray-500 dark:bg-gray-800">TU</div>
                        <span className="truncate text-[8px]">Test User2</span>
                      </div>
                      <div className="w-[20%] text-center">2</div>
                      <div className="w-[20%] font-medium text-[#01A14B] dark:text-[#8BD3A8]">$6.00</div>
                      <div className="w-[25%] text-right text-[7px]">09/26/2026</div>
                    </div>
                    <div className="flex items-center border-b border-gray-50 py-1.5 text-[8px] text-gray-600 dark:border-gray-800/50 dark:text-gray-400">
                      <div className="flex w-[35%] items-center gap-1.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[7px] font-bold text-gray-500 dark:bg-gray-800">SA</div>
                        <span className="truncate text-[8px]">Saeed Abdilahi</span>
                      </div>
                      <div className="w-[20%] text-center">1</div>
                      <div className="w-[20%] font-medium text-[#01A14B] dark:text-[#8BD3A8]">$50.00</div>
                      <div className="w-[25%] text-right text-[7px]">06/11/2026</div>
                    </div>
                    <div className="flex items-center py-1.5 text-[8px] text-gray-600 dark:text-gray-400">
                      <div className="flex w-[35%] items-center gap-1.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[7px] font-bold text-gray-500 dark:bg-gray-800">RA</div>
                        <span className="truncate text-[8px]">Ridwan Ahmed</span>
                      </div>
                      <div className="w-[20%] text-center">3</div>
                      <div className="w-[20%] font-medium text-[#01A14B] dark:text-[#8BD3A8]">$102.00</div>
                      <div className="w-[25%] text-right text-[7px]">09/26/2026</div>
                    </div>
                  </div>
                </div>
               </div> 
            </div>

            {/* Withdraw Funds */}
            <div className="flex flex-col rounded-[2rem] border border-white/60 bg-lightprimary dark:bg-primary/30 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-300 hover:border-white/80 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:hover:border-white/20 dark:hover:bg-white/10">
              <div className="absolute right-[15%] top-10 z-0 hidden h-16 w-16 text-[#8BD3A8]/50 dark:text-[#8BD3A8]/20 md:block">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
                  <pattern id="dots-hero-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.5"></circle></pattern>
                  <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-hero-1)"></rect>
                </svg>
              </div>
              <div className="mb-3 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-white text-[#01A14B] shadow-sm backdrop-blur-md dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20 dark:text-[#8BD3A8]">
                  <Icon icon="solar:wallet-bold" className="text-xl" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[#01A14B] dark:text-[#8BD3A8]">Withdraw Your Funds</h3>
              </div>
              <p className="mb-6 pr-2 text-base leading-relaxed text-[#687280] dark:text-gray-400">
                Request a withdrawal and receive your funds directly to your bank account through our secure process.
              </p>
              
              <div className="mt-auto rounded-xl border border-white/60 bg-white p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-dark/80">
                <div className="mb-1 text-xs font-bold text-[#0F1F17] dark:text-white">Wallet</div>
                <div className="mb-4 flex items-end justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
                  <div>
                    <div className="text-xl font-black text-[#0F1F17] dark:text-white">$58.90</div>
                    <div className="text-[8px] text-gray-500">Available to withdraw</div>
                  </div>
                  <div className="cursor-pointer rounded bg-[#01A14B] px-3 py-1.5 text-[8px] font-bold text-white shadow-sm transition-colors hover:bg-[#006B30]">Request Withdrawal</div>
                </div>
                
                <div className="mb-4 flex gap-4 border-b border-gray-50 pb-3 text-[8px] dark:border-gray-800/50">
                  <div>
                    <div className="mb-0.5 text-gray-500">Net Balance</div>
                    <div className="text-gray-400 dark:text-gray-300">$170.00</div>
                  </div>
                  <div>
                    <div className="mb-0.5 text-gray-500">Pending Payouts</div>
                    <div className="font-bold text-yellow-600 dark:text-yellow-500">$111.10</div>
                  </div>
                  <div>
                    <div className="mb-0.5 text-gray-500">Total Withdrawal</div>
                    <div className="text-gray-400 dark:text-gray-300">$87.13</div>
                  </div>
                </div>
                
                <div className="mb-2 text-[9px] font-bold text-[#0F1F17] dark:text-white">All Withdrawals</div>
                <div className="w-full">
                  <div className="mb-1.5 flex border-b border-gray-100 pb-1.5 text-[8px] font-bold text-gray-400 dark:border-gray-800">
                    <div className="w-[25%]">Date</div><div className="w-[20%]">Amount</div><div className="w-[25%]">Status</div><div className="w-[30%] text-right">Method</div>
                  </div>
                  <div className="flex items-center border-b border-gray-50 py-1 text-[8px] text-gray-600 dark:border-gray-800/50 dark:text-gray-400">
                    <div className="w-[25%]">Sep 19, 2026</div><div className="w-[20%]">$9.00</div>
                    <div className="flex w-[25%] items-center gap-1 font-medium text-[#01A14B] dark:text-[#8BD3A8]"><Icon icon="solar:check-circle-bold" /> Completed</div>
                    <div className="w-[30%] text-right text-[7px]">Bank Transfer</div>
                  </div>
                  <div className="flex items-center py-1 text-[8px] text-gray-600 dark:text-gray-400">
                    <div className="w-[25%]">Sep 17, 2026</div><div className="w-[20%] font-bold">$10.00</div>
                    <div className="flex w-[25%] items-center gap-1 font-medium text-yellow-500"><Icon icon="solar:clock-circle-bold" /> Pending</div>
                    <div className="w-[30%] text-right text-[7px]">Bank Transfer</div>
                  </div>
                </div>
              </div>
            </div>

            

          </div>
        </section>

        {/* =========================================
            MAKE A DIFFERENCE CTA
        ========================================= */}
        <section className="mt-24 flex w-full flex-col items-center justify-between gap-16 py-16 lg:flex-row relative z-10">
          <div className="relative z-10 flex w-full flex-col items-start lg:w-1/2">
            <div className="flex items-center justify-center"> 
              <div className="mb-4 rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary dark:text-lightprimary">
                MAKE A DIFFERENCE TODAY
              </div>
            </div>

            <h2 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-[#0F1F17] dark:text-white md:text-5xl lg:text-[3.5rem]">
              Start Your Campaign<br/>
              <span className="text-[#01A14B]">and Make a Real Impact</span>
            </h2>
            
            <p className="mb-10 max-w-lg text-lg leading-relaxed text-[#687280] dark:text-gray-300">
              Whether you're supporting a family, a community project, or a life-changing initiative, HiilBox gives you the tools to raise funds easily, securely, and transparently.
            </p>

            <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:w-auto">
              <Link href="/create-campaign" className="group inline-flex w-full items-center justify-center space-x-2 rounded-full bg-[#01A14B] px-8 py-4 text-[15px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(1,161,75,0.6)] transition hover:bg-[#006B30] dark:shadow-none sm:w-auto">
                <Icon icon="solar:add-circle-bold" className="text-lg" />
                <span>Start Your Campaign</span>
                <Icon icon="solar:arrow-right-bold" className="ml-2 transform transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/campaigns" className="group inline-flex w-full items-center justify-center space-x-2 rounded-full border-2 border-[#01A14B] bg-transparent px-8 py-4 text-[15px] font-bold text-[#0F1F17] transition hover:bg-white/50 dark:border-gray-700 dark:text-white dark:hover:border-[#01A14B] dark:hover:bg-white/5 dark:hover:text-[#01A14B] sm:w-auto">
                <Icon icon="solar:magnifer-bold" className="text-lg" />
                <span>Explore Campaigns</span>
                <Icon icon="solar:arrow-right-bold" className="ml-2 transform transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-10 flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
            <div className="absolute inset-0 z-0 scale-105 rotate-3 transform rounded-[4rem] bg-[#E6F4EB] blur-sm dark:bg-[#01A14B]/10"></div>
            <div className="absolute inset-0 z-0 scale-95 -rotate-2 transform rounded-[3rem] bg-[#01A14B]/20"></div>
            
            <div className="absolute -left-4 -top-8 z-20 text-[#01A14B] dark:text-[#8BD3A8]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
            </div>
            <div className="absolute -bottom-4 right-10 z-20 text-[#01A14B] dark:text-[#8BD3A8]">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"><path d="M10,50 Q30,10 50,50 T90,50"/></svg>
            </div>
            
            <div className="relative z-10 w-full max-w-[450px] -rotate-2 transform rounded-3xl border border-white/60 bg-white/40 p-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl transition-transform duration-500 hover:rotate-0 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <img src="https://hiilbox.com/about/fundraising_campaigns_in_action.png" alt="Make a Real Impact" className="h-auto w-full rounded-2xl object-cover" />
              <div className="absolute -right-4 -top-4 flex h-12 w-12 rotate-12 transform items-center justify-center rounded-xl border border-yellow-200/50 bg-[#FFF9C4]/80 shadow-md backdrop-blur-md dark:border-yellow-700/50 dark:bg-yellow-900/50">
                <Icon icon="solar:heart-bold" className="text-xl text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            FAQ SECTION
        ========================================= */}
        <section className="mx-auto mt-24 max-w-4xl relative z-10">
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center"> 
              <div className="mb-4 rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary dark:text-lightprimary">
                FAQS
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[#0F1F17] dark:text-white md:text-4xl lg:text-[2.75rem]">
              Got Questions? <span className="text-[#01A14B]">We're Here to Help</span>
            </h2>
            <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-[#687280] dark:text-gray-300">
              Find quick answers to the most common questions about fundraising, donations, payments, and campaign management on HiilBox.
            </p>
          </div>

          <div className="mb-8 flex w-full items-center rounded-full border border-white/60 bg-white/60 p-1.5 shadow-sm backdrop-blur-md transition-shadow duration-300 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div className="pl-4 text-gray-400">
              <Icon icon="solar:magnifer-bold" className="text-lg" />
            </div>
            <input 
              type="text" 
              placeholder="Search for questions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm text-[#0F1F17] placeholder-gray-400 focus:outline-none dark:text-white" 
            />
            <button className="shrink-0 whitespace-nowrap rounded-full bg-[#01A14B] px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#006B30]">
              Search
            </button>
          </div>

          <div className="mb-4 flex w-full items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { id: "general", icon: "solar:chat-round-line-bold", label: "General" },
              { id: "fundraisers", icon: "solar:users-group-two-rounded-bold", label: "For Fundraisers" },
              { id: "donors", icon: "solar:heart-bold", label: "For Donors" },
              { id: "payments", icon: "solar:card-bold", label: "Payments" },
              { id: "withdrawals", icon: "solar:bank-bold", label: "Withdrawals" },
              { id: "security", icon: "solar:shield-check-bold", label: "Security" },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => handleTabClick(tab.id as keyof typeof faqs)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  activeTab === tab.id 
                    ? "bg-[#01A14B] text-white" 
                    : "border border-white/60 bg-white/40 text-gray-600 backdrop-blur-md hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              >
                <Icon icon={tab.icon} className="text-lg" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="w-full space-y-3">
            {displayedFaqs.length > 0 ? (
              displayedFaqs.map((faq, index) => {
                const isOpen = openAccordion === index;
                return (
                  <div key={index} className={`overflow-hidden rounded-xl border backdrop-blur-xl transition-all duration-300 ${
                    isOpen 
                      ? "border-[#8BD3A8]/30 bg-[#E6F4EB]/80 dark:border-[#01A14B]/30 dark:bg-[#01A14B]/20" 
                      : "border-white/60 bg-white/40 hover:border-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                  }`}>
                    <button 
                      onClick={() => handleAccordionClick(index)}
                      className="group flex w-full items-center justify-between px-5 py-4 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                          isOpen 
                            ? "border-transparent bg-[#8BD3A8]/40 text-[#006B30] dark:bg-[#01A14B]/40 dark:text-[#8BD3A8]" 
                            : "border-white/50 bg-white/50 text-gray-500 group-hover:bg-[#E6F4EB] group-hover:text-[#01A14B] dark:border-white/10 dark:bg-white/10 dark:text-gray-400 dark:group-hover:bg-[#01A14B]/20"
                        }`}>
                          {index + 1}
                        </div>
                        <span className={`text-[15px] font-bold transition-colors ${
                          isOpen ? "text-[#01A14B] dark:text-[#8BD3A8]" : "text-[#0F1F17] group-hover:text-[#01A14B] dark:text-white dark:group-hover:text-[#8BD3A8]"
                        }`}>
                          {faq.q}
                        </span>
                      </div>
                      <Icon 
                        icon={isOpen ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"} 
                        className={`shrink-0 transition-transform duration-300 ${
                          isOpen ? "text-[#01A14B] dark:text-[#8BD3A8]" : "text-gray-400 group-hover:text-[#01A14B] dark:group-hover:text-[#8BD3A8]"
                        }`} 
                      />
                    </button>
                    {isOpen && (
                      <div className="block px-5 pb-5 pl-[3.25rem] text-[14px] leading-relaxed text-[#687280] dark:text-gray-300">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No FAQs found matching "{searchQuery}"
              </div>
            )}
          </div>
        </section>

      </main>
    </ThemeShell>
  );
}