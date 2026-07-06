"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFieldErrors, registrationSchema } from "@/lib/validation";
import { api, ApiError } from "@/lib/api";

export default function RegistrationPage() {
	const router = useRouter();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [agree, setAgree] = useState(true);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const result = registrationSchema.safeParse({
			firstName,
			lastName,
			email,
			password,
			repeatPassword,
			agree,
		});
		if (!result.success) {
			setErrors(getFieldErrors(result.error));
			return;
		}
		setErrors({});
		try {
			await api.post("/user/register", {
				firstName: result.data.firstName,
				lastName: result.data.lastName,
				email: result.data.email,
				password: result.data.password,
			});
			router.push("/feed");
		} catch (err) {
			const message =
				err instanceof ApiError ? err.message : "Something went wrong";
			setErrors({ form: message });
		}
	};

	return (
		<section className="_social_registration_wrapper _layout_main_wrapper">
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
			<div className="_social_registration_wrap">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
							<div className="_social_registration_right">
								<div className="_social_registration_right_image">
									<img
										src="/assets/images/registration.png"
										alt="Registration"
									/>
								</div>
								<div className="_social_registration_right_image_dark">
									<img
										src="/assets/images/registration1.png"
										alt="Registration"
									/>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
							<div className="_social_registration_content">
								<div className="_social_registration_right_logo _mar_b28">
									<img
										src="/assets/images/logo.svg"
										alt="Buddy Script"
										className="_right_logo"
									/>
								</div>
								<p className="_social_registration_content_para _mar_b8">
									Get Started Now
								</p>
								<h4 className="_social_registration_content_title _titl4 _mar_b50">
									Registration
								</h4>
								<button
									type="button"
									className="_social_registration_content_btn _mar_b40"
								>
									<img
										src="/assets/images/google.svg"
										alt=""
										className="_google_img"
									/>{" "}
									<span>Register with google</span>
								</button>
								<div className="_social_registration_content_bottom_txt _mar_b40">
									<span>Or</span>
								</div>
								<form
									className="_social_registration_form"
									onSubmit={handleSubmit}
									noValidate
								>
									<div className="row">
										<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
											<div className="_social_registration_form_input _mar_b14">
												<label
													htmlFor="firstName"
													className="_social_registration_label _mar_b8"
												>
													First Name
												</label>
												<input
													id="firstName"
													name="firstName"
													type="text"
													className="form-control _social_registration_input"
													autoComplete="given-name"
													value={firstName}
													onChange={(e) => setFirstName(e.target.value)}
												/>
												{errors.firstName && (
													<span className="_form_error">
														{errors.firstName}
													</span>
												)}
											</div>
										</div>
										<div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
											<div className="_social_registration_form_input _mar_b14">
												<label
													htmlFor="lastName"
													className="_social_registration_label _mar_b8"
												>
													Last Name
												</label>
												<input
													id="lastName"
													name="lastName"
													type="text"
													className="form-control _social_registration_input"
													autoComplete="name"
													value={lastName}
													onChange={(e) => setLastName(e.target.value)}
												/>
												{errors.lastName && (
													<span className="_form_error">{errors.lastName}</span>
												)}
											</div>
										</div>
										<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
											<div className="_social_registration_form_input _mar_b14">
												<label
													htmlFor="email"
													className="_social_registration_label _mar_b8"
												>
													Email
												</label>
												<input
													id="email"
													name="email"
													type="email"
													className="form-control _social_registration_input"
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
											<div className="_social_registration_form_input _mar_b14">
												<label
													htmlFor="password"
													className="_social_registration_label _mar_b8"
												>
													Password
												</label>
												<input
													id="password"
													name="password"
													type="password"
													className="form-control _social_registration_input"
													autoComplete="new-password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
												/>
												{errors.password && (
													<span className="_form_error">{errors.password}</span>
												)}
											</div>
										</div>
										<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
											<div className="_social_registration_form_input _mar_b14">
												<label
													htmlFor="repeatPassword"
													className="_social_registration_label _mar_b8"
												>
													Repeat Password
												</label>
												<input
													id="repeatPassword"
													name="repeatPassword"
													type="password"
													className="form-control _social_registration_input"
													autoComplete="new-password"
													value={repeatPassword}
													onChange={(e) => setRepeatPassword(e.target.value)}
												/>
												{errors.repeatPassword && (
													<span className="_form_error">
														{errors.repeatPassword}
													</span>
												)}
											</div>
										</div>
									</div>
									<div className="row">
										<div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
											<div className="form-check _social_registration_form_check">
												<input
													id="agree"
													name="agree"
													type="checkbox"
													className="form-check-input _social_registration_form_check_input"
													checked={agree}
													onChange={(e) => setAgree(e.target.checked)}
												/>
												<label
													htmlFor="agree"
													className="form-check-label _social_registration_form_check_label"
												>
													I agree to terms &amp; conditions
												</label>
											</div>
											{errors.agree && (
												<span className="_form_error">{errors.agree}</span>
											)}
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
											<div className="_social_registration_form_btn _mar_t40 _mar_b60">
												<button
													type="submit"
													className="_social_registration_form_btn_link _btn1"
												>
													Register now
												</button>
											</div>
										</div>
									</div>
								</form>
								<div className="row">
									<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
										<div className="_social_registration_bottom_txt">
											<p className="_social_registration_bottom_txt_para">
												Already have an account?{" "}
												<Link href="/login">Login</Link>
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
