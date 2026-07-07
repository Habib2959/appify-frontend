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

export default function PostsFeed() {
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
			setPosts((prev) => [...prev, ...res.items]);
			setOffset(offset + res.items.length);
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
