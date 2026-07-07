"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import CommentComposer from "./CommentComposer";
import CommentItem, { type Comment } from "./CommentItem";

type CommentsResponse = {
	items: Comment[];
	pagination: {
		offset: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
};

type CommentsSectionProps = {
	postId: string;
	open: boolean;
	onTotalChange?: (total: number) => void;
};

export default function CommentsSection({
	postId,
	open,
	onTotalChange,
}: CommentsSectionProps) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const loadMore = async () => {
		if (loading || !hasMore) return;
		setLoading(true);
		try {
			const res = await api.get<CommentsResponse>(`/comments/posts/${postId}`, {
				params: { offset, limit: 20 },
			});
			setComments((prev) => [...prev, ...res.items]);
			setOffset(offset + res.items.length);
			setHasMore(res.pagination.hasMore);
			onTotalChange?.(res.pagination.total);
		} catch {
			setHasMore(false);
		} finally {
			setLoading(false);
			setLoaded(true);
		}
	};

	useEffect(() => {
		if (!open || loaded || loading) return;
		// deferred a tick so the fetch isn't kicked off synchronously inside the effect
		queueMicrotask(loadMore);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	if (!open) return null;

	return (
		<div className="_timline_comment_main">
			<CommentComposer
				url="/comments"
				body={{ postId }}
				onCreated={(comment) => {
					setComments((prev) => [comment, ...prev]);
					onTotalChange?.(comments.length + 1);
				}}
			/>

			{comments.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					replyTargetId={comment.id}
				/>
			))}

			{loading && !loaded && (
				<p className="_likers_status">Loading comments...</p>
			)}

			{loaded && hasMore && (
				<button
					type="button"
					className="_previous_comment_txt"
					onClick={loadMore}
					disabled={loading}
				>
					{loading ? "Loading..." : "View more comments"}
				</button>
			)}
		</div>
	);
}
