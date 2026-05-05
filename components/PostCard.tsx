"use client";

import { useState } from "react";
import { deletePost } from "@/app/actions";

interface Post {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    display_name: string | null;
  } | null;
}

interface PostCardProps {
  post: Post;
  currentUserId: string;
  postUserId: string;
}

export default function PostCard({ post, currentUserId, postUserId }: PostCardProps) {
  const [deleting, setDeleting] = useState(false);
  const isOwner = currentUserId === postUserId;

  const displayName = post.profiles?.display_name || post.profiles?.username || "ユーザー";
  const username = post.profiles?.username || "unknown";

  const formattedDate = new Date(post.created_at).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  async function handleDelete() {
    if (!confirm("この投稿を削除しますか？")) return;
    setDeleting(true);
    await deletePost(post.id);
    setDeleting(false);
  }

  return (
    <article className="flex gap-3 border-b border-gray-800 px-4 py-3 hover:bg-white/[0.02] transition-colors">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
        {displayName.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="font-bold">{displayName}</span>
          <span className="text-gray-500">@{username}</span>
          <span className="text-gray-500">·</span>
          <span className="text-gray-500 text-sm">{formattedDate}</span>

          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto text-gray-500 hover:text-red-500 text-sm transition-colors disabled:opacity-50"
              aria-label="投稿を削除"
            >
              {deleting ? "削除中..." : "削除"}
            </button>
          )}
        </div>

        <p className="mt-1 whitespace-pre-wrap break-words">{post.content}</p>
      </div>
    </article>
  );
}
