import React from "react";
import FormCreateNewLink from "./form-create-new-link";
import HeadTitle from "./head-title";

const CreateNewLinkPage = ({ domain }: { domain?: string }) => {
  return (
    <div className="flex flex-col w-full h-full p-6">
      <HeadTitle title="New Link" />
      <div className="mt-6">
        <FormCreateNewLink domain={domain} />
      </div>
    </div>
  );
};

export default CreateNewLinkPage;
