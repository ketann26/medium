import React from "react";

export const Quote = () => {
	return (
		<div className="bg-slate-100 h-screen flex justify-center flex-col px-8">
			<div className="flex justify-center">
				<div className="flex flex-col">
					<div className="max-w-lg text-3xl font-bold text-slate-950 mb-4">
						"The customer support I received was exceptional. The support team went
						above and beyond to address my concerns."
					</div>
					<div className="text-lg font-bold text-slate-950">Jules Winnfield</div>
					<div className="text-lg font-medium text-gray-400">CEO, Acme Inc</div>
				</div>
			</div>
		</div>
	);
};
