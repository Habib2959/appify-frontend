export default function PostCardSkeleton() {
	return (
		<div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
			<div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
				<div className="_skeleton_row">
					<div className="_skeleton _skeleton_avatar" />
					<div className="_skeleton_lines">
						<div className="_skeleton _skeleton_line _skeleton_line_short" />
						<div className="_skeleton _skeleton_line _skeleton_line_shorter" />
					</div>
				</div>
				<div className="_skeleton _skeleton_line _mar_t16" />
				<div className="_skeleton _skeleton_line _skeleton_line_short" />
				<div className="_skeleton _skeleton_image" />
			</div>
		</div>
	);
}
