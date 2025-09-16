/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button, ButtonTransition } from "./ui/button";
import { useAuth } from "@/contexts/auth-context";
import { TLink } from "@/types/link.types";
import { post } from "@/lib/request";
import { isProduction } from "@/lib/contant";

const BoxShortenLink = ({ domain }: { domain: string }) => {
  const { state } = useAuth();

  const [isShorted, setIsShorted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState<TLink>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const main_url = e.target[0].value as string;
    try {
      if (!main_url.trim()) {
        throw new Error("Please enter field above!");
      }
      const response = (await post("/link/create", {
        main_url,
        domain,
        user_id: state?.user?.id,
      })) as TLink;

      setIsShorted(true);
      setLink(response);

      setError("");
    } catch (error: any) {
      setIsShorted(true);
      setError((error.message as string) || (error as string));
    } finally {
      setLoading(false);
    }
  };

  const getShortLink = (link?: TLink) => {
    if (!link) {
      return ``;
    }

    return `${isProduction ? "https://" : "http://"}${link.domain}/${
      link.code
    }`;
  };

  const handleCopy = (content: string) => {
    if (copied) {
      return;
    }
    setCopied(true);
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="bg-gradient-to-r from-purple-200 dark:from-purple-500 to-pink-300 dark:to-pink-500 min-h-150 flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center w-full max-w-3xl py-10">
        <div className="md:flex-row flex flex-col items-center gap-2 text-4xl font-bold">
          <p className="italic">
            super<span>Link</span>
          </p>
          <span className="md:block hidden"> - </span>
          <p className="text-center capitalize">
            Shorten Link just one click away
          </p>
        </div>
        <div className="text-neutral-800 my-2 text-lg font-semibold">
          <p>
            Link shorten tool provided by{" "}
            <span className="underline">someone</span>
          </p>
        </div>
        <div className="w-full max-w-3xl px-4 mt-10">
          <form
            className="md:flex-row flex flex-col items-center justify-center gap-2"
            onSubmit={onSubmit}
          >
            <input
              type="text"
              placeholder="Enter your link"
              className="focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300 focus:border-transparent max-w-96 dark:bg-neutral-700 dark:border-gray-400 w-full p-2 text-lg bg-white border border-gray-300 rounded-md shadow-lg"
              name="url"
            />
            <ButtonTransition className="py-3" loading={loading}>
              Shorten
            </ButtonTransition>
          </form>
        </div>
        {/* Fast view */}
        <div
          className={`mt-14 max-w-9/10 w-full transition-all duration-500`}
          style={{
            maxHeight: isShorted ? 500 : "0px",
            opacity: isShorted ? 1 : 0,
          }}
        >
          <div className="min-h-32 md:pb-0 backdrop-blur-3xl bg-white/20 md:flex-row flex flex-col items-center justify-between w-full px-4 pb-4 rounded-md">
            {error ? (
              <p className="text-lg font-semibold text-purple-900">{error}</p>
            ) : (
              <>
                <div className="md:max-w-8/11 w-full max-w-full py-4 space-y-2 overflow-hidden">
                  <p className="text-neutral-600 line-clamp-1 text-ellipsis overflow-hidden">
                    {link?.main_url}
                  </p>
                  <p className="line-clamp-1 text-ellipsis overflow-hidden text-lg text-black">
                    {getShortLink(link as TLink)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(getShortLink(link))}
                    className="hover:bg-primary dark:hover:bg-black hover:text-white dark:text-black dark:hover:text-white px-4 py-1 text-sm transition-colors bg-transparent border border-black rounded-md cursor-pointer"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <Button variant={"link"} className="dark:text-black">
                    Statistics
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="text-neutral-800 mt-3 text-sm font-medium text-center">
            <p>
              Do you want to shorten more another link or view detail
              statistics?{" "}
              <a href="/login" className="hover:underline italic">
                Login now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxShortenLink;
