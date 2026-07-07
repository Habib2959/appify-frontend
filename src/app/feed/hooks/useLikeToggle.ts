"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type LikeSummary = {
	likeCount: number;
	likedByMe: boolean;
};

export function useLikeToggle(url: string, initial: LikeSummary) {
	const [liked, setLiked] = useState(initial.likedByMe);
	const [count, setCount] = useState(initial.likeCount);
	const [pending, setPending] = useState(false);

	const toggle = async () => {
		if (pending) return;
		const nextLiked = !liked;

		setPending(true);
		setLiked(nextLiked);
		setCount((prev) => prev + (nextLiked ? 1 : -1));

		try {
			const result = nextLiked
				? await api.post<LikeSummary>(url)
				: await api.delete<LikeSummary>(url);
			setLiked(result.likedByMe);
			setCount(result.likeCount);
		} catch {
			setLiked(!nextLiked);
			setCount((prev) => prev + (nextLiked ? -1 : 1));
		} finally {
			setPending(false);
		}
	};

	return { liked, count, pending, toggle };
}
