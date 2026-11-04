"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/client-auth-fetch";
import type { CampaignComment } from "@/lib/campaigns";

interface CampaignCommentsProps {
  campaignId: number;
}

interface CommentsApiResponse {
  success: boolean;
  data?: {
    results?: CampaignComment[];
    total?: number;
    count?: number;
    per_page?: number;
    current_page?: number;
    has_more?: boolean;
    overall?: number;
  };
  message?: string;
}

function formatCommentDate(value: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CampaignComments({
  campaignId,
}: CampaignCommentsProps) {
  const [comments, setComments] = useState<CampaignComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: "1",
          post_id: String(campaignId),
          parent_id: "0",
          comment_type: "comment",
        });

        const response = await authFetch(
  `https://cms.hiilbox.com/wp-json/growfund-currency-manager/v1/campaign/update/comments/paginated?${params.toString()}`,
  {
    method: "GET",
  }
);

        const data: CommentsApiResponse = await response.json();

        console.log(
          "CAMPAIGN COMMENTS CLIENT DEBUG:",
          campaignId,
          data
        );

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load campaign comments."
          );
        }

        if (!cancelled) {
          setComments(data.data?.results ?? []);
        }
      } catch (err) {
        console.error("Unable to load campaign comments:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load campaign comments."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  if (loading) {
    return (
      <div className="border-t border-[#e0e6eb] py-6">
        <p className="text-sm text-[#5a6a85]">
          Loading comments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-t border-[#e0e6eb] py-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="border-t border-[#e0e6eb] py-6">
        <p className="text-sm text-[#5a6a85]">
          No comments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-[#e0e6eb]">
      <div className="py-5">
        <h3 className="text-lg font-semibold text-[#2a3547]">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="divide-y divide-[#e0e6eb]">
        {comments.map((comment) => (
          <div key={comment.id} className="py-5">
            <div className="flex items-start gap-3">
              {comment.author_image ? (
                <img
                  src={comment.author_image}
                  alt={comment.author_name || "Comment author"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2f6] text-sm font-semibold text-[#5a6a85]">
                  {(comment.author_name || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-semibold text-[#2a3547]">
                    {comment.author_name || "User"}
                  </p>

                  {comment.created_at && (
                    <span className="text-xs text-[#7c8fac]">
                      {formatCommentDate(comment.created_at)}
                    </span>
                  )}
                </div>

                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5a6a85]">
                  {comment.content}
                </p>

                {comment.replies?.results &&
                  comment.replies.results.length > 0 && (
                    <div className="mt-4 space-y-4 border-l-2 border-[#e0e6eb] pl-4">
                      {comment.replies.results.map((reply) => (
                        <div key={reply.id}>
                          <div className="flex flex-wrap items-center gap-x-2">
                            <span className="text-sm font-semibold text-[#2a3547]">
                              {reply.author_name || "User"}
                            </span>

                            {reply.created_at && (
                              <span className="text-xs text-[#7c8fac]">
                                {formatCommentDate(reply.created_at)}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#5a6a85]">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}