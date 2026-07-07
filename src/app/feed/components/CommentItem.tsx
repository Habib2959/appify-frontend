"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { formatRelativeTime } from "@/lib/format-time";
import { useLikeToggle } from "../hooks/useLikeToggle";
import LikersModal from "./LikersModal";
import CommentComposer from "./CommentComposer";

export type Comment = {
	id: string;
	postId: string;
	content: string;
	parentCommentId: string | null;
	rootCommentId: string | null;
	likeCount: number;
	replyCount: number;
	likedByMe: boolean;
	createdAt: string;
	author: {
		id: string;
		firstName: string;
		lastName: string;
	};
};

type RepliesResponse = {
	items: Comment[];
	pagination: {
		offset: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
};

type CommentItemProps = {
	comment: Comment;
	replyTargetId: string;
};

export default function CommentItem({
	comment,
	replyTargetId,
}: CommentItemProps) {
	const like = useLikeToggle(`/comments/${comment.id}/like`, {
		likeCount: comment.likeCount,
		likedByMe: comment.likedByMe,
	});
	const [likersOpen, setLikersOpen] = useState(false);
	const [replying, setReplying] = useState(false);
	const [repliesOpen, setRepliesOpen] = useState(false);
	const [replies, setReplies] = useState<Comment[]>([]);
	const [repliesOffset, setRepliesOffset] = useState(0);
	const [repliesHasMore, setRepliesHasMore] = useState(true);
	const [repliesLoading, setRepliesLoading] = useState(false);

	const loadReplies = async () => {
		if (repliesLoading || !repliesHasMore) return;
		setRepliesLoading(true);
		try {
			const res = await api.get<RepliesResponse>(
				`/comments/${comment.id}/replies`,
				{
					params: { offset: repliesOffset, limit: 20 },
				},
			);
			setReplies((prev) => [...prev, ...res.items]);
			setRepliesOffset(repliesOffset + res.items.length);
			setRepliesHasMore(res.pagination.hasMore);
		} catch {
			setRepliesHasMore(false);
		} finally {
			setRepliesLoading(false);
		}
	};

	const toggleReplies = () => {
		const next = !repliesOpen;
		setRepliesOpen(next);
		if (next && replies.length === 0) loadReplies();
	};

	return (
		<div className="_comment_main">
			<div className="_comment_image">
				<img
					src="/assets/images/txt_img.png"
					alt=""
					className="_comment_img1"
				/>
			</div>
			<div className="_comment_area">
				<div className="_comment_details">
					<div className="_comment_details_top">
						<div className="_comment_name">
							<h4 className="_comment_name_title">
								{comment.author.firstName} {comment.author.lastName}
							</h4>
						</div>
					</div>
					<div className="_comment_status">
						<p className="_comment_status_text">
							<span>{comment.content}</span>
						</p>
					</div>
					<div className="_comment_reply">
						<div className="_comment_reply_num">
							<ul className="_comment_reply_list">
								<li>
									<span
										className={like.liked ? "_reply_active" : undefined}
										onClick={like.toggle}
									>
										{like.liked ? "Liked" : "Like"}
									</span>
								</li>
								<li>
									<span onClick={() => setReplying((prev) => !prev)}>
										Reply
									</span>
								</li>
								{like.count > 0 && (
									<li>
										<span onClick={() => setLikersOpen(true)}>
											{like.count} {like.count === 1 ? "like" : "likes"}
										</span>
									</li>
								)}
								<li>
									<span className="_time_link">
										{formatRelativeTime(comment.createdAt)}
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{replying && (
					<CommentComposer
						url={`/comments/${replyTargetId}/replies`}
						placeholder="Write a reply"
						onCreated={(reply) => {
							setReplies((prev) => [reply, ...prev]);
							setRepliesOpen(true);
							setReplying(false);
						}}
					/>
				)}

				{comment.replyCount > 0 && !repliesOpen && (
					<button
						type="button"
						className="_previous_comment_txt"
						onClick={toggleReplies}
					>
						View {comment.replyCount}{" "}
						{comment.replyCount === 1 ? "reply" : "replies"}
					</button>
				)}

				{repliesOpen && (
					<div className="_comment_reply_thread">
						{replies.map((reply) => (
							<CommentItem
								key={reply.id}
								comment={reply}
								replyTargetId={replyTargetId}
							/>
						))}
						{repliesHasMore && (
							<button
								type="button"
								className="_previous_comment_txt"
								onClick={loadReplies}
								disabled={repliesLoading}
							>
								{repliesLoading ? "Loading..." : "View more replies"}
							</button>
						)}
					</div>
				)}
			</div>

			<LikersModal
				open={likersOpen}
				onClose={() => setLikersOpen(false)}
				fetchUrl={`/comments/${comment.id}/likers`}
			/>
		</div>
	);
}
