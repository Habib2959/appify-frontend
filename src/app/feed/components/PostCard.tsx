"use client";

import { useState } from "react";
import { UPLOADS_URL } from "@/lib/config";
import PostDropdown from "./PostDropdown";
import { formatRelativeTime } from "@/lib/format-time";
import { useLikeToggle } from "../hooks/useLikeToggle";
import LikersModal from "./LikersModal";
import CommentsSection from "./CommentsSection";

export type FeedMedia = {
	url: string;
	type: "image" | "video";
};

export type FeedPost = {
	id: string;
	content: string;
	media: FeedMedia[] | null;
	isPublic: boolean;
	likeCount: number;
	commentCount: number;
	likedByMe: boolean;
	createdAt: string;
	author: {
		id: string;
		firstName: string;
		lastName: string;
	};
};

type PostCardProps = {
	post: FeedPost;
	initialCommentTotal?: number;
};

export default function PostCard({ post, initialCommentTotal }: PostCardProps) {
	const like = useLikeToggle(`/post-likes/posts/${post.id}`, {
		likeCount: post.likeCount,
		likedByMe: post.likedByMe,
	});
	const [likersOpen, setLikersOpen] = useState(false);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [commentTotal, setCommentTotal] = useState<number | null>(initialCommentTotal ?? null);

	return (
		<div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
			<div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
				<div className="_feed_inner_timeline_post_top">
					<div className="_feed_inner_timeline_post_box">
						<div className="_feed_inner_timeline_post_box_image">
							<img
								src="/assets/images/post_img.png"
								alt=""
								className="_post_img"
							/>
						</div>
						<div className="_feed_inner_timeline_post_box_txt">
							<h4 className="_feed_inner_timeline_post_box_title">
								{post.author.firstName} {post.author.lastName}
							</h4>
							<p className="_feed_inner_timeline_post_box_para">
								{formatRelativeTime(post.createdAt)} .{" "}
								<span>{post.isPublic ? "Public" : "Only me"}</span>
							</p>
						</div>
					</div>
					<PostDropdown />
				</div>
				<h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
				{post.media?.map((item) => (
					<div className="_feed_inner_timeline_image" key={item.url}>
						{item.type === "image" ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={`${UPLOADS_URL}${item.url}`}
								alt=""
								className="_time_img"
							/>
						) : (
							<video
								src={`${UPLOADS_URL}${item.url}`}
								className="_time_img"
								controls
							/>
						)}
					</div>
				))}
			</div>

			{(like.count > 0 || Boolean(commentTotal)) && (
				<div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
					<div className="_feed_inner_timeline_total_reacts_txt">
						{like.count > 0 && (
							<p className="_feed_inner_timeline_total_reacts_para1">
								<span onClick={() => setLikersOpen(true)}>
									{like.count} {like.count === 1 ? "like" : "likes"}
								</span>
							</p>
						)}
						{Boolean(commentTotal) && (
							<p className="_feed_inner_timeline_total_reacts_para2">
								<span onClick={() => setCommentsOpen(true)}>
									{commentTotal} {commentTotal === 1 ? "comment" : "comments"}
								</span>
							</p>
						)}
					</div>
				</div>
			)}

			<div className="_feed_inner_timeline_reaction">
				<button
					type="button"
					className={`_feed_inner_timeline_reaction_emoji _feed_reaction${like.liked ? " _feed_reaction_active" : ""}`}
					onClick={like.toggle}
				>
					<span className="_feed_inner_timeline_reaction_link">
						<span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
							</svg>
							{like.liked ? "Liked" : "Like"}
						</span>
					</span>
				</button>
				<button
					type="button"
					className="_feed_inner_timeline_reaction_comment _feed_reaction"
					onClick={() => setCommentsOpen((prev) => !prev)}
				>
					<span className="_feed_inner_timeline_reaction_link">
						<span>
							<svg
								className="_reaction_svg"
								xmlns="http://www.w3.org/2000/svg"
								width="21"
								height="21"
								fill="none"
								viewBox="0 0 21 21"
							>
								<path
									stroke="#000"
									d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
								/>
								<path
									stroke="#000"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6.938 9.313h7.125M10.5 14.063h3.563"
								/>
							</svg>
							Comment
						</span>
					</span>
				</button>
				<button className="_feed_inner_timeline_reaction_share _feed_reaction">
					<span className="_feed_inner_timeline_reaction_link">
						<span>
							<svg
								className="_reaction_svg"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="21"
								fill="none"
								viewBox="0 0 24 21"
							>
								<path
									stroke="#000"
									strokeLinejoin="round"
									d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
								/>
							</svg>
							Share
						</span>
					</span>
				</button>
			</div>

			<CommentsSection
				postId={post.id}
				open={commentsOpen}
				onTotalChange={setCommentTotal}
			/>

			<LikersModal
				open={likersOpen}
				onClose={() => setLikersOpen(false)}
				fetchUrl={`/post-likes/posts/${post.id}/likers`}
			/>
		</div>
	);
}
