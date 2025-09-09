import React from "react";
import FormCreateNewLink from "./form-create-new-link";
import HeadTitle from "./head-title";

const CreateNewLinkPage = () => {
	return (
		<div className="w-full h-full flex flex-col p-6">
			<HeadTitle title="New Link" />
			<div className="mt-6">
				<FormCreateNewLink />
			</div>
		</div>
	);
};

export default CreateNewLinkPage;
