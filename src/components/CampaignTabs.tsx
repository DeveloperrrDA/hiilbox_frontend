"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import CampaignComments from "./CampaignComments";
import UpdateComments from "./UpdateComments";

export default function CampaignTabs({ 
  campaign,
  campaignUpdates,
  hideStoryTab = false 
}: { 
  campaign: any;
  campaignUpdates: any[];
  hideStoryTab?: boolean;
}) {
  const [activeTab, setActiveTab] = useState(hideStoryTab ? "updates" : "story");
  
  const [expandedUpdates, setExpandedUpdates] = useState<Record<number, boolean>>({});
  
  // Slice state for limiting updates on initial load
  const [visibleUpdatesCount, setVisibleUpdatesCount] = useState(3);
  const visibleUpdates = campaignUpdates?.slice(0, visibleUpdatesCount) || [];
  const hasMoreUpdates = campaignUpdates?.length > visibleUpdatesCount;

  const toggleUpdateComments = (id: number) => {
    setExpandedUpdates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full">
      {/* --- TABS NAVIGATION --- */}
      <div className="grid grid-cols-2 gap-3 pb-6 pt-4 md:flex md:flex-row md:flex-wrap md:gap-4 md:pb-14">
        
        {!hideStoryTab && (
          <button type="button" onClick={() => setActiveTab("story")} className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${activeTab === "story" ? "bg-primary text-white shadow-elevation3 dark:bg-primary" : "bg-white text-dark dark:bg-dark dark:text-white"}`}>
            <Icon icon="material-symbols:article-outline-rounded" className="text-base md:text-[22px]" /> Story
          </button>
        )}

        <button type="button" onClick={() => setActiveTab("updates")} className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${activeTab === "updates" ? "bg-primary text-white shadow-elevation3 dark:bg-primary" : "bg-white text-dark dark:bg-dark dark:text-white"}`}>
          <Icon icon="material-symbols:campaign-outline-rounded" className="text-base md:text-[22px]" /> Updates
        </button>

        <button type="button" onClick={() => setActiveTab("comments")} className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${activeTab === "comments" ? "bg-primary text-white shadow-elevation3 dark:bg-primary" : "bg-white text-dark dark:bg-dark dark:text-white"}`}>
          <Icon icon="material-symbols:chat-bubble-outline-rounded" className="text-base md:text-[22px]" /> Comments
        </button>
        
        <button type="button" onClick={() => setActiveTab("faqs")} className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${activeTab === "faqs" ? "bg-primary text-white shadow-elevation3 dark:bg-primary" : "bg-white text-dark dark:bg-dark dark:text-white"}`}>
          <Icon icon="material-symbols:help-outline-rounded" className="text-base md:text-[22px]" /> FAQs
        </button>
      </div>

      {/* --- TABS CONTENT --- */}
      <div className="w-full">
        
        {/* STORY TAB */}
        {activeTab === "story" && !hideStoryTab && (
          <div className="w-full border-t border-[#e0e6eb] pt-6 dark:border-gray-800 animate-in fade-in duration-300">
            <p className="whitespace-pre-line break-words text-base leading-8 text-[#5a6a85] dark:text-gray-400">
              {campaign.story || "No story available."}
            </p>
          </div>
        )}
        
        {/* UPDATES TAB */}
        {activeTab === "updates" && (
          <div className="w-full animate-in fade-in duration-300">
            <div className="mb-8 flex items-center gap-3 border-t border-[#e0e6eb] pt-8 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-[#111c2d] dark:text-white">Updates</h2>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">{campaignUpdates?.length || 0}</span>
            </div>
            
            <div className="space-y-12">
              {visibleUpdates.map((update) => (
                <div key={update.id} className="flex w-full flex-col max-w-full">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      {update.created_by_image ? (
                        <img src={update.created_by_image} alt={update.created_by_name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-bold uppercase text-gray-500">{update.created_by_name?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-dark dark:text-white">{new Date(update.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="truncate text-sm text-[#5a6a85] dark:text-gray-400">
                        {update.created_by_name} <span className="mx-1">•</span> {update.created_by_role === "growfund_fundraiser" ? "Fundraiser" : update.created_by_role}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="mb-3 break-words text-lg font-bold text-[#111c2d] dark:text-white">{update.title}</h3>
                  <div className="w-full text-base leading-8 text-[#5a6a85] dark:text-gray-400">
                    <p className="line-clamp-4 break-words whitespace-pre-line">{update.description}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <button 
                      onClick={() => toggleUpdateComments(update.id)} 
                      className="flex items-center gap-2 text-[14px] font-bold text-[#5a6a85] dark:text-gray-400 hover:text-[#01A14B] dark:hover:text-[#01A14B] transition-colors"
                    >
                      <Icon icon={expandedUpdates[update.id] ? "solar:chat-round-line-bold" : "solar:chat-round-line-duotone"} className="text-xl" />
                      {update.comments || 0} {update.comments === 1 ? "Comment" : "Comments"}
                    </button>
                  </div>

                  {expandedUpdates[update.id] && (
                    <div className="mt-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-800">
                      <UpdateComments updateId={update.id} />
                    </div>
                  )}
                </div>
              ))}
              
              {(!campaignUpdates || campaignUpdates.length === 0) && <p className="pt-4 text-[#5a6a85] dark:text-gray-400">No updates posted yet.</p>}
            </div>

            {hasMoreUpdates && (
              <div className="mt-12 flex justify-center border-t border-gray-100 dark:border-gray-800 pt-8">
                <button 
                  onClick={() => setVisibleUpdatesCount(prev => prev + 5)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-6 py-3 text-[15px] font-bold text-[#111c2d] dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Icon icon="solar:round-arrow-down-bold-duotone" className="text-xl text-[#01A14B]" />
                  Load more
                </button>
              </div>
            )}
          </div>
        )}

        {/* COMMENTS TAB */}
        {activeTab === "comments" && (
          <div className="w-full border-t border-[#e0e6eb] pt-6 dark:border-gray-800 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-[#111c2d] dark:text-white">Comments</h2>
            <CampaignComments campaignId={campaign.id} />
          </div>
        )}

        {/* FAQS TAB */}
        {activeTab === "faqs" && (
          <div className="w-full border-t border-[#e0e6eb] pt-6 dark:border-gray-800 animate-in fade-in duration-300">
            {campaign.faqs && campaign.faqs.length > 0 ? (
              <div className="space-y-6">
                {campaign.faqs.map((faq: { question: string; answer: string }, index: number) => (
                  <div key={index} className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                    <h3 className="mb-2 text-lg font-bold text-[#111c2d] dark:text-white flex items-start gap-2">
                      <Icon icon="solar:question-circle-bold" className="text-[#01A14B] mt-1 shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#5a6a85] dark:text-gray-300 ml-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#5a6a85] dark:text-gray-400">No frequently asked questions available for this campaign.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}