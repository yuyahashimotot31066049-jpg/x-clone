"use client";

import { useState, useRef } from "react";
import { createPost } from "@/app/actions";

interface PostComposerProps {
  userDisplayName: string;
}

export default function PostComposer({ userDisplayName }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const remaining = 280 - content.length;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createPost(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setContent("");
    }
    setLoading(false);
  }

  return (
    <div className="border-b border-gray-800 px-4 py-3">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-bold text-white">
          {userDisplayName.charAt(0).toUpperCase()}
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex-1">
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="いまどうしてる？"
            rows={3}
            maxLength={280}
            className="w-full resize-none bg-transparent text-xl placeholder-gray-500 focus:outline-none"
          />

          {error && (
            <p className="mb-2 text-sm text-red-400">{error}</p>
          )}

          <div className="flex items-center justify-between border-t border-gray-800 pt-3">
            <span className={`text-sm ${remaining < 20 ? (remaining < 0 ? "text-red-500" : "text-yellow-500") : "text-gray-500"}`}>
              {remaining}
            </span>
            <button
              type="submit"
              disabled={!content.trim() || loading || remaining < 0}
              className="rounded-full bg-sky-500 px-5 py-2 font-bold text-white hover:bg-sky-400 disabled:opacity-50 transition-colors"
            >
              {loading ? "投稿中..." : "ポスト"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
