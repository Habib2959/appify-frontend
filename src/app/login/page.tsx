"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFieldErrors, loginSchema } from "@/lib/validation";
import { api, ApiError } from "@/lib/api";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(true);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const result = loginSchema.safeParse({ email, password, remember });
		if (!result.success) {
			setErrors(getFieldErrors(result.error));
			return;
		}
		setErrors({});
		setLoading(true);
		try {
			await api.post("/user/login", {
				email: result.data.email,
				password: result.data.password,
			});
			router.push("/feed");
		} catch (err) {
			const message =
				err instanceof ApiError ? err.message : "Something went wrong";
			setErrors({ form: message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="_social_login_wrapper _layout_main_wrapper">
			<div className="_shape_one">
				<img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
				<img
					src="/assets/images/dark_shape.svg"
					alt=""
					className="_dark_shape"
				/>
			</div>
			<div className="_shape_two">
				<img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
				<img
					src="/assets/images/dark_shape1.svg"
					alt=""
					className="_dark_shape _dark_shape_opacity"
				/>
			</div>
			<div className="_shape_three">
				<img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
				<img
					src="/assets/images/dark_shape2.svg"
					alt=""
					className="_dark_shape _dark_shape_opacity"
				/>
			</div>
			<div className="_social_login_wrap">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
							<div className="_social_login_left">
								<div className="_social_login_left_image">
									<img
										src="/assets/images/login.png"
										alt="Login"
										className="_left_img"
									/>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
							<div className="_social_login_content">
								<div className="_social_login_left_logo _mar_b28">
									<img
										src="/assets/images/logo.svg"
										alt="Buddy Script"
										className="_left_logo"
									/>
								</div>
								<p className="_social_login_content_para _mar_b8">
									Welcome back
								</p>
								<h4 className="_social_login_content_title _titl4 _mar_b50">
									Login to your account
								</h4>
								<button
									type="button"
									className="_social_login_content_btn _mar_b40"
								>
									<img
										src="/assets/images/google.svg"
										alt=""
										className="_google_img"
									/>{" "}
									<span>Or sign-in with google</span>
								</button>
								<div className="_social_login_content_bottom_txt _mar_b40">
									<span>Or</span>
								</div>
								<form
									className="_social_login_form"
									onSubmit={handleSubmit}
									noValidate
								>
									<div className="row">
										<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
											<div className="_social_login_form_input _mar_b14">
												<label
													htmlFor="email"
													className="_social_login_label _mar_b8"
												>
													Email
												</label>
												<input
													id="email"
													name="email"
													type="email"
													className="form-control _social_login_input"
													autoComplete="email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
												/>
												{errors.email && (
													<span className="_form_error">{errors.email}</span>
												)}
											</div>
										</div>
										<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
											<div className="_social_login_form_input _mar_b14">
												<label
													htmlFor="password"
													className="_social_login_label _mar_b8"
												>
													Password
												</label>
												<input
													id="password"
													name="password"
													type="password"
													className="form-control _social_login_input"
													autoComplete="current-password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
												/>
												{errors.password && (
													<span className="_form_error">{errors.password}</span>
												)}
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
											<div className="form-check _social_login_form_check">
												<input
													id="remember"
													name="remember"
													type="checkbox"
													className="form-check-input _social_login_form_check_input"
													checked={remember}
													onChange={(e) => setRemember(e.target.checked)}
												/>
												<label
													htmlFor="remember"
													className="form-check-label _social_login_form_check_label"
												>
													Remember me
												</label>
											</div>
										</div>
										<div className="col-lg-6 col-xl-6 col-md-6 col-sm-12">
											<div className="_social_login_form_left">
												<Link href="#" className="_social_login_form_left_para">
													Forgot password?
												</Link>
											</div>
										</div>
									</div>
									{errors.form && (
										<div className="row">
											<div className="col-12">
												<span className="_form_error">{errors.form}</span>
											</div>
										</div>
									)}
									<div className="row">
										<div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
											<div className="_social_login_form_btn _mar_t40 _mar_b60">
												<button
													type="submit"
													className="_social_login_form_btn_link _btn1"
													disabled={loading}
												>
													{loading ? "Logging in..." : "Login now"}
												</button>
											</div>
										</div>
									</div>
								</form>
								<div className="row">
									<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div className="_social_login_bottom_txt">
											<p className="_social_login_bottom_txt_para">
												Don&apos;t have an account?{" "}
												<Link href="/registration">Create New Account</Link>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
