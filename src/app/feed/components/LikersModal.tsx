"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";

type Liker = {
	id: string;
	firstName: string;
	lastName: string;
};

type LikersResponse = {
	items: Liker[];
	pagination: {
		offset: number;
		limit: number;
		total: number;
		hasMore: boolean;
	};
};

const PAGE_SIZE = 20;

type LikersModalProps = {
	open: boolean;
	onClose: () => void;
	fetchUrl: string;
};

export default function LikersModal({
	open,
	onClose,
	fetchUrl,
}: LikersModalProps) {
	const [likers, setLikers] = useState<Liker[]>([]);
	const [offset, setOffset] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const [wasOpen, setWasOpen] = useState(open);
	const sentinelRef = useRef<HTMLDivElement>(null);

	if (open !== wasOpen) {
		setWasOpen(open);
		if (open) {
			setLikers([]);
			setOffset(0);
			setHasMore(true);
		}
	}

	const loadMore = useCallback(async () => {
		if (!open || loading || !hasMore) return;
		setLoading(true);
		try {
			const res = await api.get<LikersResponse>(fetchUrl, {
				params: { offset, limit: PAGE_SIZE },
			});
			setLikers((prev) => [...prev, ...res.items]);
			setOffset(offset + res.items.length);
			setHasMore(res.pagination.hasMore);
		} catch {
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	}, [fetchUrl, offset, loading, hasMore, open]);

	useEffect(() => {
		if (!open) return;
		const el = sentinelRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) loadMore();
			},
			{ rootMargin: "200px" },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [loadMore, open]);

	if (!open) return null;

	return createPortal(
		<div className="_create_post_modal_overlay" onClick={onClose}>
			<div
				className="_create_post_modal_dialog"
				role="dialog"
				aria-modal="true"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24">
					<div className="_create_post_modal_header">
						<h4 className="_feed_inner_timeline_post_title">Likes</h4>
						<button
							type="button"
							className="_create_post_modal_close"
							onClick={onClose}
							aria-label="Close"
						/>
					</div>

					<div className="_likers_list">
						{likers.map((liker) => (
							<div className="_likers_item" key={liker.id}>
								<img
									src="/assets/images/post_img.png"
									alt=""
									className="_comment_img"
								/>
								<span>
									{liker.firstName} {liker.lastName}
								</span>
							</div>
						))}
					</div>
					<div ref={sentinelRef} />
					{loading && <p className="_likers_status">Loading...</p>}
					{!loading && likers.length === 0 && (
						<p className="_likers_status">No likes yet</p>
					)}
				</div>
			</div>
		</div>,
		document.body,
	);
}
