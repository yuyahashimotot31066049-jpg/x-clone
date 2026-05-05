import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions";
import PostComposer from "@/components/PostComposer";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .single();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, content, created_at, user_id, profiles(username, display_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  const displayName = profile?.display_name || profile?.username || user.email || "ユーザー";

  return (
    <div className="mx-auto max-w-xl min-h-screen border-x border-gray-800">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 bg-black/80 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <h1 className="font-bold text-lg">ホーム</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">@{profile?.username}</span>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border border-gray-700 px-4 py-1.5 text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              ログアウト
            </button>
          </form>
        </div>
      </header>

      <PostComposer userDisplayName={displayName} />

      <main>
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            const profiles = Array.isArray(post.profiles)
              ? post.profiles[0] ?? null
              : post.profiles ?? null;
            return (
              <PostCard
                key={post.id}
                post={{ ...post, profiles }}
                currentUserId={user.id}
                postUserId={post.user_id}
              />
            );
          })
        ) : (
          <div className="py-16 text-center text-gray-500">
            まだ投稿がありません。最初のポストをしてみましょう！
          </div>
        )}
      </main>
    </div>
  );
}
