"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

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

  return (
    <div className="w-full">
      {/* --- TABS NAVIGATION --- */}
      <div className="grid grid-cols-2 gap-3 pb-6 pt-4 md:flex md:flex-row md:flex-wrap md:gap-4 md:pb-14">
        
        {!hideStoryTab && (
          <button
            type="button"
            onClick={() => setActiveTab("story")}
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${
              activeTab === "story"
                ? "bg-primary text-white shadow-elevation3 dark:bg-primary"
                : "bg-white text-dark dark:bg-dark dark:text-white"
            }`}
          >
            <Icon icon="material-symbols:article-outline-rounded" className="text-base md:text-[22px]" /> Story
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab("updates")}
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${
            activeTab === "updates"
              ? "bg-primary text-white shadow-elevation3 dark:bg-primary"
              : "bg-white text-dark dark:bg-dark dark:text-white"
          }`}
        >
          <Icon icon="material-symbols:campaign-outline-rounded" className="text-base md:text-[22px]" /> Updates
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("comments")}
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${
            activeTab === "comments"
              ? "bg-primary text-white shadow-elevation3 dark:bg-primary"
              : "bg-white text-dark dark:bg-dark dark:text-white"
          }`}
        >
          <Icon icon="material-symbols:chat-bubble-outline-rounded" className="text-base md:text-[22px]" /> Comments
        </button>
        
        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[13px] font-semibold transition-colors sm:text-sm md:flex-1 md:gap-2 md:px-6 md:py-4 md:text-base md:hover:bg-lightprimary shadow-elevation2 ${
            activeTab === "faqs"
              ? "bg-primary text-white shadow-elevation3 dark:bg-primary"
              : "bg-white text-dark dark:bg-dark dark:text-white"
          }`}
        >
          <Icon icon="material-symbols:help-outline-rounded" className="text-base md:text-[22px]" /> FAQs
        </button>
      </div>

      {/* --- TABS CONTENT --- */}
      <div className="w-full">
        {activeTab === "story" && !hideStoryTab && (
          <div className="w-full border-t border-[#e0e6eb] pt-6 dark:border-gray-800 animate-in fade-in duration-300">
            <p className="whitespace-pre-line break-words text-base leading-8 text-[#5a6a85] dark:text-gray-400">{campaign.story || "No story available."}</p>
          </div>
        )}
        
        {activeTab === "updates" && (
          <div className="w-full animate-in fade-in duration-300">
            <div className="mb-8 flex items-center gap-3 border-t border-[#e0e6eb] pt-8 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-dark dark:text-white">Updates</h2>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">{campaignUpdates?.length || 0}</span>
            </div>
            <div className="space-y-12">
              {campaignUpdates?.map((update) => (
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
                       {(() => {
                          const createdTime = new Date(update.created_at).getTime();
                          const isNew = Number.isFinite(createdTime) && createdTime <= Date.now() && Date.now() - createdTime < 7 * 24 * 60 * 60 * 1000;
                          return isNew ? <span className="rounded bg-[#dcfce7] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-green-700 uppercase">New</span> : null;
                        })()}
                      </div>
                      <div className="truncate text-sm text-[#5a6a85] dark:text-gray-400">{update.created_by_name} <span className="mx-1">•</span> {update.created_by_role}</div>
                    </div>
                  </div>
                  <h3 className="mb-3 break-words text-lg font-bold text-dark dark:text-white">{update.title}</h3>
                  <div className="w-full text-base leading-8 text-[#5a6a85] dark:text-gray-400">
                    <p className="line-clamp-4 break-words whitespace-pre-line">{update.description}</p>
                  </div>
                  <button className="mt-3 w-max text-left font-medium text-dark underline underline-offset-4 hover:text-primary dark:text-white">Read more</button>
                </div>
              ))}
              {(!campaignUpdates || campaignUpdates.length === 0) && <p className="pt-4 text-[#5a6a85] dark:text-gray-400">No updates posted yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="w-full border-t border-[#e0e6eb] pt-6 dark:border-gray-800 animate-in fade-in duration-300">
            {/* <CampaignComments campaignId={campaign.id} /> */}
            <p className="text-[#5a6a85] dark:text-gray-400">Comments coming soon.</p>
          </div>
        )}

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