"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { authFetch } from "@/lib/client-auth-fetch";
import type { CampaignComment } from "@/lib/campaigns";

interface CampaignCommentsProps {
  campaignId: number;
}

interface AuthUser {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

const WP_API_BASE = "https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1";

function formatCommentDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// Recursive component for nested replies with Load More functionality
function CommentItem({ comment, campaignId, level = 0 }: { comment: CampaignComment; campaignId: number; level?: number }) {
  const [showReplies, setShowReplies] = useState(false);
  
  // Local state for replies pagination
  const [localReplies, setLocalReplies] = useState<CampaignComment[]>(comment.replies?.results || []);
  const [replyPage, setReplyPage] = useState(comment.replies?.current_page || 1);
  const [hasMoreReplies, setHasMoreReplies] = useState(comment.replies?.has_more || false);
  const [loadingMore, setLoadingMore] = useState(false);

  const replyCount = comment.replies?.total || localReplies.length;
  const avatarSize = level === 0 ? "h-11 w-11 text-base" : level === 1 ? "h-9 w-9 text-[13px]" : "h-7 w-7 text-[11px]";

  const loadMoreReplies = async () => {
    setLoadingMore(true);
    try {
      const nextPage = replyPage + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        per_page: "5", // Load 5 more replies at a time
        comment_type: "comment",
        parent_id: String(comment.id)
      });
      const response = await fetch(`/api/campaigns/${campaignId}/comments?${params.toString()}`);
      const data: any = await response.json();
      if (data.success && data.data) {
        setLocalReplies((prev) => [...prev, ...(data.data.results || [])]);
        setReplyPage(nextPage);
        setHasMoreReplies(data.data.has_more);
      }
    } catch (err) {
      console.error("Failed to load more replies");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className={`py-4 ${level > 0 ? "border-t border-gray-100/50 dark:border-gray-800/50" : ""}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        {comment.author_image ? (
          <img src={comment.author_image} alt={comment.author_name || "User"} className={`${avatarSize} shrink-0 rounded-full object-cover shadow-sm`} />
        ) : (
          <div className={`flex ${avatarSize} shrink-0 items-center justify-center rounded-full bg-[#f3f5f7] dark:bg-gray-800 font-bold text-[#111c2d] dark:text-white shadow-sm`}>
            {(comment.author_name || "?").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-[14px] sm:text-[15px] font-bold text-[#111c2d] dark:text-white">{comment.author_name || "User"}</p>
              {comment.created_at && (
                <span className="text-[12px] font-medium text-[#5a6a85] dark:text-gray-400">{formatCommentDate(comment.created_at)}</span>
              )}
            </div>
            <p className="mt-1.5 whitespace-pre-line text-[14px] sm:text-[15px] leading-relaxed text-[#5a6a85] dark:text-gray-300">{comment.content}</p>
          </div>

          <div className="mt-2.5 flex items-center gap-5 pl-2">
            <button className="flex items-center gap-1.5 text-[13px] font-bold text-[#5a6a85] hover:text-[#111c2d] dark:text-gray-400 dark:hover:text-white transition-colors">
              <Icon icon="solar:pen-new-round-line-duotone" className="text-lg" />
              Reply
            </button>

            {replyCount > 0 && (
              <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5 text-[13px] font-bold text-[#01A14B] hover:text-[#017838] transition-colors">
                <Icon icon={showReplies ? "solar:alt-arrow-up-line-duotone" : "solar:chat-round-line-duotone"} className="text-lg" />
                {showReplies ? "Hide replies" : `${replyCount} ${replyCount === 1 ? "Reply" : "Replies"}`}
              </button>
            )}
          </div>

          {showReplies && localReplies.length > 0 && (
            <div className="mt-4 border-l-[3px] border-gray-100 dark:border-gray-700/60 pl-3 sm:pl-5 ml-2">
              {localReplies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} campaignId={campaignId} level={level + 1} />
              ))}
              
              {hasMoreReplies && (
                <button onClick={loadMoreReplies} disabled={loadingMore} className="mt-2 text-[13px] font-bold text-[#01A14B] hover:underline flex items-center gap-2">
                  {loadingMore ? <Icon icon="solar:spinner-broken" className="animate-spin text-base" /> : <Icon icon="solar:round-arrow-down-bold-duotone" className="text-base" />}
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

export default function CampaignComments({ campaignId }: CampaignCommentsProps) {
  const [comments, setComments] = useState<CampaignComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async (pageNum: number, signal?: AbortSignal) => {
    const params = new URLSearchParams({ page: String(pageNum), per_page: "3", comment_type: "comment" });
    const response = await fetch(`/api/campaigns/${campaignId}/comments?${params.toString()}`, { signal });
    const data: any = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Unable to load campaign comments.");
    return data.data; // Return full pagination object
  };

  const fetchUserSession = async (signal?: AbortSignal) => {
    try {
      const response = await authFetch(`${WP_API_BASE}/auth/me`, { method: "GET", signal });
      if (response.ok) {
        const data: any = await response.json();
        if (data.success && data.user_id) return data;
      }
    } catch { }
    return null;
  };

  useEffect(() => {
    const controller = new AbortController();
    async function initialize() {
      setLoading(true);
      try {
        const [commentsData, userSession] = await Promise.all([
          fetchComments(1, controller.signal),
          fetchUserSession(controller.signal)
        ]);
        if (!controller.signal.aborted) {
          setComments(commentsData?.results ?? []);
          setHasMore(commentsData?.has_more ?? false);
          setPage(1);
          setCurrentUser(userSession);
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load comments.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    initialize();
    return () => controller.abort();
  }, [campaignId]);

  const loadMoreComments = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchComments(nextPage);
      setComments((prev) => [...prev, ...(data?.results ?? [])]);
      setPage(nextPage);
      setHasMore(data?.has_more ?? false);
    } catch (err) {
      console.error("Failed to load more comments");
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !currentUser) return;
    setIsSubmitting(true);
    try {
      const response = await authFetch(`${WP_API_BASE}/campaign/update/comment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: campaignId, content: newComment, parent_id: 0, comment_type: "comment" }),
      });
      const data: any = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to post comment.");
      
      setNewComment("");
      const freshData = await fetchComments(1);
      setComments(freshData?.results ?? []);
      setHasMore(freshData?.has_more ?? false);
      setPage(1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="py-8 text-center text-[#5a6a85] dark:text-gray-400 flex items-center justify-center gap-2"><Icon icon="solar:spinner-broken" className="animate-spin text-xl text-[#01A14B]" /> Loading comments...</div>;
  if (error) return <div className="py-8 text-center font-medium text-red-500">{error}</div>;

  return (
    <div className="mt-2">
      {currentUser ? (
        <div className="mb-8 flex gap-3 sm:gap-4 rounded-2xl bg-white dark:bg-dark p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          {currentUser.avatar_url ? (
            <img src={currentUser.avatar_url} alt="You" className="h-11 w-11 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lightprimary dark:bg-primary/20 text-[#01A14B] font-bold">
              {currentUser.first_name?.charAt(0) || currentUser.username?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a public comment..."
              className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 text-[14px] text-[#111c2d] dark:text-white placeholder:text-gray-400 focus:border-[#01A14B] focus:outline-none focus:ring-1 focus:ring-[#01A14B] transition-shadow"
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <button onClick={handlePostComment} disabled={isSubmitting || !newComment.trim()} className="rounded-full bg-[#01A14B] px-6 py-2 text-[14px] font-bold text-white transition-colors hover:bg-[#017838] disabled:opacity-50">
                {isSubmitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl bg-[#FAFAFA] dark:bg-gray-800/30 p-6 text-center border border-gray-100 dark:border-gray-800">
          <Icon icon="solar:user-circle-bold-duotone" className="mx-auto mb-3 text-4xl text-gray-300 dark:text-gray-600" />
          <p className="text-[15px] font-medium text-[#5a6a85] dark:text-gray-300">
            <Link href="/login" className="text-[#01A14B] hover:underline font-bold transition-colors">Please sign in</Link> to your account to leave a comment.
          </p>
        </div>
      )}

      {comments.length === 0 ? (
        <div className="py-8 text-center font-medium text-[#5a6a85] dark:text-gray-400">No comments yet. Be the first to share your thoughts!</div>
      ) : (
        <>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} campaignId={campaignId} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-6 flex justify-center border-t border-gray-100 dark:border-gray-800 pt-6">
              <button onClick={loadMoreComments} disabled={loadingMore} className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 px-6 py-2.5 text-[14px] font-bold text-[#111c2d] dark:text-white transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                {loadingMore ? <Icon icon="solar:spinner-broken" className="animate-spin text-lg text-[#01A14B]" /> : <Icon icon="solar:round-arrow-down-bold-duotone" className="text-lg text-[#01A14B]" />}
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}