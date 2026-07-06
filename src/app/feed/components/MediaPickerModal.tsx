"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";

export type MediaType = "image" | "video";

export type SelectedFile = {
	file: File;
	type: MediaType;
	previewUrl: string;
};

export type UploadedMedia = {
	url: string;
	type: MediaType;
};

// mirrors the backend's upload.service.ts limits (src/upload/upload.service.ts)
const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/", "video/mp4", "video/webm", "video/quicktime"];

function isAcceptedType(file: File) {
	return ACCEPTED_TYPES.some((type) =>
		type.endsWith("/") ? file.type.startsWith(type) : file.type === type,
	);
}

type MediaPickerModalProps = {
	open: boolean;
	initialFiles: SelectedFile[];
	onClose: () => void;
	onConfirm: (files: SelectedFile[]) => void;
};

export default function MediaPickerModal({
	open,
	initialFiles,
	onClose,
	onConfirm,
}: MediaPickerModalProps) {
	const [files, setFiles] = useState<SelectedFile[]>(initialFiles);
	const [error, setError] = useState("");
	const [wasOpen, setWasOpen] = useState(open);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// resync with the composer's current attachments each time the modal opens
	if (open !== wasOpen) {
		setWasOpen(open);
		if (open) {
			setFiles(initialFiles);
			setError("");
		}
	}

	if (!open) return null;

	const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
		const picked = Array.from(event.target.files ?? []);
		event.target.value = "";
		if (picked.length === 0) return;

		if (files.length + picked.length > MAX_FILES) {
			setError(`You can attach up to ${MAX_FILES} files`);
			return;
		}

		const invalid = picked.find((f) => !isAcceptedType(f) || f.size > MAX_FILE_SIZE);
		if (invalid) {
			setError(
				!isAcceptedType(invalid)
					? "Only image and video files are allowed"
					: "Each file must be 50MB or smaller",
			);
			return;
		}

		setError("");
		setFiles((prev) => [
			...prev,
			...picked.map((file) => ({
				file,
				type: (file.type.startsWith("image/") ? "image" : "video") as MediaType,
				previewUrl: URL.createObjectURL(file),
			})),
		]);
	};

	const removeFile = (index: number) => {
		setFiles((prev) => {
			const target = prev[index];
			if (target && !initialFiles.includes(target)) {
				URL.revokeObjectURL(target.previewUrl);
			}
			return prev.filter((_, i) => i !== index);
		});
	};

	const handleClose = () => {
		files.forEach((f) => {
			if (!initialFiles.includes(f)) URL.revokeObjectURL(f.previewUrl);
		});
		onClose();
	};

	const handleConfirm = () => {
		onConfirm(files);
	};

	return createPortal(
		<div className="_create_post_modal_overlay" onClick={handleClose}>
			<div
				className="_create_post_modal_dialog"
				role="dialog"
				aria-modal="true"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24">
					<div className="_create_post_modal_header">
						<h4 className="_feed_inner_timeline_post_title">Add Photos/Videos</h4>
						<button
							type="button"
							className="_create_post_modal_close"
							onClick={handleClose}
							aria-label="Close"
						/>
					</div>

					{files.length > 0 && (
						<div className="_create_post_preview_grid">
							{files.map((f, index) => (
								<div className="_create_post_preview_item" key={f.previewUrl}>
									{f.type === "image" ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={f.previewUrl} alt="" />
									) : (
										<video src={f.previewUrl} muted />
									)}
									<button
										type="button"
										className="_create_post_preview_remove"
										onClick={() => removeFile(index)}
										aria-label="Remove"
									>
										&times;
									</button>
								</div>
							))}
						</div>
					)}
					{error && <span className="_form_error">{error}</span>}

					<input
						ref={fileInputRef}
						type="file"
						accept="image/*,video/mp4,video/webm,video/quicktime"
						multiple
						hidden
						onChange={handleFilesSelected}
					/>

					<div className="_feed_inner_text_area_bottom">
						<div className="_feed_inner_text_area_item">
							<div className="_feed_inner_text_area_bottom_photo _feed_common">
								<button
									type="button"
									className="_feed_inner_text_area_bottom_photo_link"
									onClick={() => fileInputRef.current?.click()}
								>
									<span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
											<path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
										</svg>
									</span>
									Choose Files
								</button>
							</div>
						</div>
						<div className="_feed_inner_text_area_btn">
							<button
								type="button"
								className="_feed_inner_text_area_btn_link"
								disabled={files.length === 0}
								onClick={handleConfirm}
							>
								<span>Attach</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
}
