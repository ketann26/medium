import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { LabelledInput } from "./LabelledInput";
import { SignupInput } from "@ketan-26/medium-common";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
	const navigate = useNavigate();
	const [postInputs, setPostInputs] = useState<SignupInput>({
		name: "",
		email: "",
		password: "",
	});

	async function sendRequest() {
		try {
			const response = await axios.post(
				`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
				postInputs
			);
			const jwt = response.data.jwt;
			localStorage.setItem("token", jwt);
			navigate("/blogs");
		} catch (e) {
			// alert
			console.log(e);
		}
	}

	return (
		<div className="h-screen flex justify-center flex-col">
			<div className="flex justify-center">
				<div className="flex flex-col max-w-xl">
					<div className="px-10">
						<div className="text-3xl font-bold text-slate-950">Create an Account</div>
						<div className="text-lg font-medium text-gray-400">
							{type === "signup" ? "Already " : "Don't "} have an account?{" "}
							<Link to={type === "signup" ? "/signin" : "/signup"}>
								{type === "signup" ? "Login" : "Sign up"}
							</Link>
						</div>
					</div>
					<div className="my-6">
						{type === "signup" ? (
							<LabelledInput
								label="Name"
								placeholder="John"
								onChange={(e) => {
									setPostInputs({
										...postInputs,
										name: e.target.value,
									});
								}}
							/>
						) : null}
						<LabelledInput
							label="Email"
							placeholder="john@example.com"
							onChange={(e) => {
								setPostInputs({
									...postInputs,
									email: e.target.value,
								});
							}}
						/>
						<LabelledInput
							label="Password"
							type={"password"}
							placeholder=""
							onChange={(e) => {
								setPostInputs({
									...postInputs,
									password: e.target.value,
								});
							}}
						/>
						<button
							className="bg-black w-full text-gray-100 font-semibold rounded-md p-2 mt-2"
							onClick={sendRequest}
						>
							{type === "signup" ? "Sign Up" : "Sign In"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
