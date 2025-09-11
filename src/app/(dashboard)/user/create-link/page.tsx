import CreateNewLinkPage from "@/components/create-link-page";
import { get } from "@/lib/request";
import React from "react";

const getDomain = async () => {
  try {
    const response = await get("/link/domain", {
      cache: "no-store",
    });
    return response;
  } catch (error) {
    return null;
  }
};

const CreateLink = async () => {
  const domain = await getDomain();
  return <CreateNewLinkPage domain={domain} />;
};

export default CreateLink;
