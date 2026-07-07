"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import PostCard, { type FeedPost } from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";

const PAGE_SIZE = 10;

type FeedResponse = {
	items: FeedPost[];
	pagination: {
		offset: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
};

type PostsFeedProps = {
	createdPost?: FeedPost | null;
};

function mergeUniquePosts(current: FeedPost[], incoming: FeedPost[]) {
	const seen = new Set(current.map((post) => post.id));
	const next = [...current];

	for (const post of incoming) {
		if (seen.has(post.id)) continue;
		seen.add(post.id);
		next.push(post);
	}

	return next;
}

export default function PostsFeed({ createdPost }: PostsFeedProps) {
	const router = useRouter();
	const [posts, setPosts] = useState<FeedPost[]>([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const sentinelRef = useRef<HTMLDivElement>(null);

	const loadMore = useCallback(async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		setError("");
		try {
			const res = await api.get<FeedResponse>("/feed", {
				params: { offset, limit: PAGE_SIZE },
			});
			setPosts((prev) => mergeUniquePosts(prev, res.items));
			setOffset((prev) => prev + res.items.length);
			setHasMore(res.pagination.hasMore);
		} catch (err) {
			if (err instanceof ApiError && err.status === 401) {
				router.push("/login");
				return;
			}
			// stop the sentinel from re-triggering forever; user retries manually
			setHasMore(false);
			setError("Couldn't load posts.");
		} finally {
			setLoading(false);
		}
	}, [offset, loading, hasMore, router]);

	const retry = () => {
		setError("");
		setHasMore(true);
	};

	// sentinel starts inside the viewport (list is empty), so the observer
	// fires immediately and loads page 1 without a separate mount effect
	useEffect(() => {
		if (!createdPost) return;
		setPosts((prev) => {
			if (prev.some((post) => post.id === createdPost.id)) {
				return prev;
			}

			return [createdPost, ...prev];
		});
		setOffset((prev) => prev + 1);
		setHasMore(true);
	}, [createdPost]);

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ rootMargin: "300px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [loadMore]);

	return (
		<>
			{posts.map((post) => (
				<PostCard key={post.id} post={post} initialCommentTotal={post.commentCount} />
			))}
			{loading && (
				<>
					<PostCardSkeleton />
					<PostCardSkeleton />
					<PostCardSkeleton />
				</>
			)}
			<div ref={sentinelRef} />
			{error && (
				<p className="_form_error">
					{error}{" "}
					<button type="button" onClick={retry}>
						Retry
					</button>
				</p>
			)}
		</>
	);
}
