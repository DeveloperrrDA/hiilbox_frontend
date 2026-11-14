"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { authFetch } from "@/lib/client-auth-fetch";
import type { CampaignComment } from "@/lib/campaigns";

interface AuthUser {
  user_id: number;
  username: string;
  first_name: string;
  avatar_url: string;
}

const WP_API_BASE = "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1";

function formatCommentDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function UpdateCommentItem({ comment, updateId, level = 0 }: { comment: CampaignComment; updateId: number; level?: number }) {
  const [showReplies, setShowReplies] = useState(false);
  
  const [localReplies, setLocalReplies] = useState<CampaignComment[]>(comment.replies?.results || []);
  const [replyPage, setReplyPage] = useState(comment.replies?.current_page || 1);
  const [hasMoreReplies, setHasMoreReplies] = useState(comment.replies?.has_more || false);
  const [loadingMore, setLoadingMore] = useState(false);

  const replyCount = comment.replies?.total || localReplies.length;
  const avatarSize = level === 0 ? "h-9 w-9 text-[13px]" : level === 1 ? "h-7 w-7 text-[11px]" : "h-6 w-6 text-[10px]";

  const loadMoreReplies = async () => {
    setLoadingMore(true);
    try {
      const nextPage = replyPage + 1;
      const params = new URLSearchParams({
        page: String(nextPage), per_page: "5", comment_type: "update_comment", parent_id: String(comment.id)
      });
      const response = await fetch(`/api/campaigns/${updateId}/comments?${params.toString()}`);
      const data: any = await response.json();
      if (data.success && data.data) {
        setLocalReplies((prev) => [...prev, ...(data.data.results || [])]);
        setReplyPage(nextPage);
        setHasMoreReplies(data.data.has_more);
      }
    } catch (err) { } finally { setLoadingMore(false); }
  };

  return (
    <div className={`py-3.5 ${level > 0 ? "border-t border-gray-100/50 dark:border-gray-800/50" : ""}`}>
      <div className="flex items-start gap-3">
        {comment.author_image ? (
          <img src={comment.author_image} alt={comment.author_name || "User"} className={`${avatarSize} shrink-0 rounded-full object-cover`} />
        ) : (
          <div className={`flex ${avatarSize} shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 font-bold text-[#111c2d] dark:text-white`}>
            {(comment.author_name || "?").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="rounded-xl bg-white dark:bg-dark p-3.5 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-[13px] sm:text-[14px] font-bold text-[#111c2d] dark:text-white">{comment.author_name || "User"}</p>
              {comment.created_at && (
                <span className="text-[11px] sm:text-[12px] font-medium text-[#5a6a85] dark:text-gray-400">{formatCommentDate(comment.created_at)}</span>
              )}
            </div>
            <p className="mt-1 whitespace-pre-line text-[13px] sm:text-[14px] leading-relaxed text-[#5a6a85] dark:text-gray-300">{comment.content}</p>
          </div>

          <div className="mt-2 flex items-center gap-4 pl-2">
            <button className="flex items-center gap-1.5 text-[12px] font-bold text-[#5a6a85] hover:text-[#111c2d] dark:text-gray-400 dark:hover:text-white transition-colors">
              <Icon icon="solar:pen-new-round-line-duotone" className="text-base" />
              Reply
            </button>
            {replyCount > 0 && (
              <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#01A14B] hover:text-[#017838] transition-colors">
                <Icon icon={showReplies ? "solar:alt-arrow-up-line-duotone" : "solar:chat-round-line-duotone"} className="text-base" />
                {showReplies ? "Hide replies" : `${replyCount} ${replyCount === 1 ? "Reply" : "Replies"}`}
              </button>
            )}
          </div>

          {showReplies && localReplies.length > 0 && (
            <div className="mt-3 border-l-[2px] border-gray-200 dark:border-gray-700/60 pl-3 sm:pl-4 ml-1.5">
              {localReplies.map((reply) => (
                <UpdateCommentItem key={reply.id} comment={reply} updateId={updateId} level={level + 1} />
              ))}
              {hasMoreReplies && (
                <button onClick={loadMoreReplies} disabled={loadingMore} className="mt-2 text-[12px] font-bold text-[#01A14B] hover:underline flex items-center gap-1.5">
                  {loadingMore ? <Icon icon="solar:spinner-broken" className="animate-spin text-[14px]" /> : <Icon icon="solar:round-arrow-down-bold-duotone" className="text-[14px]" />}
                  Load more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UpdateComments({ updateId }: { updateId: number }) {
  const [comments, setComments] = useState<CampaignComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async (pageNum: number, signal?: AbortSignal) => {
    const params = new URLSearchParams({ page: String(pageNum), per_page: "3", comment_type: "update_comment" });
    const response = await fetch(`/api/campaigns/${updateId}/comments?${params.toString()}`, { signal });
    const data: any = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Unable to load comments.");
    return data.data;
  };

  useEffect(() => {
    const controller = new AbortController();
    async function initialize() {
      setLoading(true);
      try {
        const [commentsData, userRes]: [any, any] = await Promise.all([
          fetchComments(1, controller.signal),
          authFetch(`${WP_API_BASE}/auth/me`, { method: "GET", signal: controller.signal }).then(r => r.ok ? r.json() : null).catch(() => null)
        ]);
        if (!controller.signal.aborted) {
          setComments(commentsData?.results ?? []);
          setHasMore(commentsData?.has_more ?? false);
          if (userRes?.success) setCurrentUser(userRes);
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Error loading comments.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    initialize();
    return () => controller.abort();
  }, [updateId]);

  const loadMoreComments = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchComments(nextPage);
      setComments((prev) => [...prev, ...(data?.results ?? [])]);
      setPage(nextPage);
      setHasMore(data?.has_more ?? false);
    } catch (err) { } finally { setLoadingMore(false); }
  };

  const handlePostComment = async () => { /* POST logic omitted for brevity */ };

  if (loading) return <div className="py-4 text-[13px] font-medium text-[#5a6a85] dark:text-gray-400 flex items-center gap-2"><Icon icon="solar:spinner-broken" className="animate-spin text-lg text-[#01A14B]" /> Loading comments...</div>;
  if (error) return <div className="py-4 text-[13px] font-medium text-red-500">{error}</div>;

  return (
    <div className="pt-2">
      {/* Input UI Omitted here for brevity */}
      
      {comments.length === 0 ? (
        <div className="pb-2 text-[13px] font-medium text-[#5a6a85] dark:text-gray-400">No comments yet.</div>
      ) : (
        <>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {comments.map((comment) => <UpdateCommentItem key={comment.id} comment={comment} updateId={updateId} />)}
          </div>
          {hasMore && (
            <div className="mt-4 flex justify-center border-t border-gray-100 dark:border-gray-800 pt-4">
              <button onClick={loadMoreComments} disabled={loadingMore} className="flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 px-5 py-2 text-[13px] font-bold text-[#111c2d] dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                {loadingMore ? <Icon icon="solar:spinner-broken" className="animate-spin text-base text-[#01A14B]" /> : <Icon icon="solar:round-arrow-down-bold-duotone" className="text-base text-[#01A14B]" />}
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}