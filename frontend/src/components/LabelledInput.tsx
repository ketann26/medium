import React, { ChangeEvent } from "react";

interface LabelledInputType {
	label: string;
	placeholder: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	type?: string;
}

export const LabelledInput = ({ label, placeholder, onChange, type }: LabelledInputType) => {
	return (
		<div className="flex flex-col my-2">
			<label className="font-semibold mb-2">{label}</label>
			<input
				type={type || "text"}
				className="p-2 border rounded-md"
				placeholder={placeholder}
				onChange={onChange}
				required
			/>
		</div>
	);
};
