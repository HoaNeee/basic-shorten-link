import AboutShortenLink from "@/components/about-shorten-link";
import BoxShortenLink from "@/components/box-shorten-link";
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

const Home = async () => {
  const domain = await getDomain();

  return (
    <div className="w-full h-full">
      <BoxShortenLink domain={domain} />
      <AboutShortenLink />
    </div>
  );
};

export default Home;
