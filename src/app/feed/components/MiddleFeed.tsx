"use client";

import { useState } from "react";
import PostsFeed from "./PostsFeed";
import MediaPickerModal, {
  type SelectedFile,
  type UploadedMedia,
} from "./MediaPickerModal";
import { api, ApiError } from "@/lib/api";
import { createPostSchema, getFieldErrors } from "@/lib/validation";

export default function MiddleFeed() {
  const [content, setContent] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<SelectedFile[]>([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [posting, setPosting] = useState(false);

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handlePost = async () => {
    const result = createPostSchema.safeParse({ content });
    if (!result.success) {
      setErrors(getFieldErrors(result.error));
      return;
    }

    setErrors({});
    setPosting(true);
    try {
      let media: UploadedMedia[] = [];
      if (attachedFiles.length > 0) {
        const formData = new FormData();
        attachedFiles.forEach(({ file }) => formData.append("media", file));
        const uploaded = await api.post<{ media: UploadedMedia[] }>(
          "/upload/media",
          formData,
        );
        media = uploaded.media;
      }

      await api.post("/feed/posts", {
        content: result.data.content,
        media,
        isPublic,
      });

      attachedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      setContent("");
      setAttachedFiles([]);
      setIsPublic(true);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      setErrors({ form: message });
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
      <div className="_layout_middle_wrap">
        <div className="_layout_middle_inner">

          <div className="_feed_inner_ppl_card _mar_b16">
            <div className="_feed_inner_story_arrow">
              <button type="button" className="_feed_inner_story_arrow_btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                  <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                </svg>
              </button>
            </div>
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                <div className="_feed_inner_profile_story _b_radious6 ">
                  <div className="_feed_inner_profile_story_image">
                    <img src="/assets/images/card_ppl1.png" alt="Image" className="_profile_story_img" />
                    <div className="_feed_inner_story_txt">
                      <div className="_feed_inner_story_btn">
                        <button className="_feed_inner_story_btn_link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                            <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                          </svg>
                        </button>
                      </div>
                      <p className="_feed_inner_story_para">Your Story</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                <div className="_feed_inner_public_story _b_radious6">
                  <div className="_feed_inner_public_story_image">
                    <img src="/assets/images/card_ppl2.png" alt="Image" className="_public_story_img" />
                    <div className="_feed_inner_pulic_story_txt">
                      <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                    </div>
                    <div className="_feed_inner_public_mini">
                      <img src="/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_mobile_none">
                <div className="_feed_inner_public_story _b_radious6">
                  <div className="_feed_inner_public_story_image">
                    <img src="/assets/images/card_ppl3.png" alt="Image" className="_public_story_img" />
                    <div className="_feed_inner_pulic_story_txt">
                      <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                    </div>
                    <div className="_feed_inner_public_mini">
                      <img src="/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_none">
                <div className="_feed_inner_public_story _b_radious6">
                  <div className="_feed_inner_public_story_image">
                    <img src="/assets/images/card_ppl4.png" alt="Image" className="_public_story_img" />
                    <div className="_feed_inner_pulic_story_txt">
                      <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                    </div>
                    <div className="_feed_inner_public_mini">
                      <img src="/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="_feed_inner_ppl_card_mobile _mar_b16">
            <div className="_feed_inner_ppl_card_area">
              <ul className="_feed_inner_ppl_card_area_list">
                <li className="_feed_inner_ppl_card_area_item">
                  <a href="#0" className="_feed_inner_ppl_card_area_link">
                    <div className="_feed_inner_ppl_card_area_story">
                      <img src="/assets/images/mobile_story_img.png" alt="Image" className="_card_story_img" />
                      <div className="_feed_inner_ppl_btn">
                        <span className="_feed_inner_ppl_btn_link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                            <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
                  </a>
                </li>
                <li className="_feed_inner_ppl_card_area_item">
                  <a href="#0" className="_feed_inner_ppl_card_area_link">
                    <div className="_feed_inner_ppl_card_area_story_active">
                      <img src="/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                  </a>
                </li>
                <li className="_feed_inner_ppl_card_area_item">
                  <a href="#0" className="_feed_inner_ppl_card_area_link">
                    <div className="_feed_inner_ppl_card_area_story_inactive">
                      <img src="/assets/images/mobile_story_img2.png" alt="Image" className="_card_story_img1" />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                  </a>
                </li>
                <li className="_feed_inner_ppl_card_area_item">
                  <a href="#0" className="_feed_inner_ppl_card_area_link">
                    <div className="_feed_inner_ppl_card_area_story_active">
                      <img src="/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                  </a>
                </li>
                <li className="_feed_inner_ppl_card_area_item">
                  <a href="#0" className="_feed_inner_ppl_card_area_link">
                    <div className="_feed_inner_ppl_card_area_story_inactive">
                      <img src="/assets/images/mobile_story_img2.png" alt="Image" className="_card_story_img1" />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                  </a>
                </li>
                <li className="_feed_inner_ppl_card_area_item">
                  <a href="#0" className="_feed_inner_ppl_card_area_link">
                    <div className="_feed_inner_ppl_card_area_story_active">
                      <img src="/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                  </a>
                </li>

                <li className="_feed_inner_ppl_card_area_item">
                  <a href="#0" className="_feed_inner_ppl_card_area_link">
                    <div className="_feed_inner_ppl_card_area_story">
                      <img src="/assets/images/mobile_story_img.png" alt="Image" className="_card_story_img" />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                  </a>
                </li>
                <li className="_feed_inner_ppl_card_area_item">
                  <a href="#0" className="_feed_inner_ppl_card_area_link">
                    <div className="_feed_inner_ppl_card_area_story_active">
                      <img src="/assets/images/mobile_story_img1.png" alt="Image" className="_card_story_img1" />
                    </div>
                    <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="_feed_inner_text_area  _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
            <div className="_feed_inner_text_area_box">
              <div className="_feed_inner_text_area_box_image">
                <img src="/assets/images/txt_img.png" alt="Image" className="_txt_img" />
              </div>
              <div className="form-floating _feed_inner_text_area_box_form ">
                <textarea
                  className="form-control _textarea"
                  placeholder="Write something ..."
                  id="floatingTextarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <label className="_feed_textarea_label" htmlFor="floatingTextarea">Write something ...
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" fill="none" viewBox="0 0 23 24">
                    <path fill="#666" d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z" />
                  </svg>
                </label>
              </div>
            </div>
            {errors.content && <span className="_form_error">{errors.content}</span>}

            {attachedFiles.length > 0 && (
              <div className="_create_post_preview_grid">
                {attachedFiles.map((f, index) => (
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
                      onClick={() => removeAttachedFile(index)}
                      aria-label="Remove"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.form && <span className="_form_error">{errors.form}</span>}

            <div className="_create_post_visibility">
              <label className="_create_post_visibility_label" htmlFor="postVisibility">
                <input
                  type="checkbox"
                  id="postVisibility"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                {isPublic ? "Public" : "Only me"}
              </label>
            </div>

            <div className="_feed_inner_text_area_bottom">
              <div className="_feed_inner_text_area_item">
                <div className="_feed_inner_text_area_bottom_photo _feed_common">
                  <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={() => setMediaModalOpen(true)}> <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
                    </svg></span>
                    Photo</button>
                </div>
                <div className="_feed_inner_text_area_bottom_video _feed_common">
                  <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={() => setMediaModalOpen(true)}> <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                    <path fill="#666" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z" />
                  </svg>
                  </span>
                    Video</button>
                </div>
              </div>
              <div className="_feed_inner_text_area_btn">
                <button
                  type="button"
                  className="_feed_inner_text_area_btn_link"
                  disabled={posting}
                  onClick={handlePost}
                >
                  <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
                    <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
                  </svg> <span>{posting ? "Posting..." : "Post"}</span>
                </button>
              </div>
            </div>


            <div className="_feed_inner_text_area_bottom_mobile">
              <div className="_feed_inner_text_mobile">
                <div className="_feed_inner_text_area_item">
                  <div className="_feed_inner_text_area_bottom_photo _feed_common">
                    <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={() => setMediaModalOpen(true)}> <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                      <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
                      </svg></span>
                    </button>
                  </div>
                  <div className="_feed_inner_text_area_bottom_video _feed_common">
                    <button type="button" className="_feed_inner_text_area_bottom_photo_link" onClick={() => setMediaModalOpen(true)}>
                      <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                          <path fill="#666" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="_feed_inner_text_area_btn">
                  <button
                    type="button"
                    className="_feed_inner_text_area_btn_link"
                    disabled={posting}
                    onClick={handlePost}
                  >
                    <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
                      <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" />
                    </svg> <span>{posting ? "Posting..." : "Post"}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
          <PostsFeed />

          <MediaPickerModal
            open={mediaModalOpen}
            initialFiles={attachedFiles}
            onClose={() => setMediaModalOpen(false)}
            onConfirm={(files) => {
              setAttachedFiles(files);
              setMediaModalOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
