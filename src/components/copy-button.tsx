import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

const CopyButton = ({
  shape,
  content,
}: {
  shape: "default" | "circle" | "menu" | "custom";
  content: string;
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = (content: string) => {
    if (copied) {
      return;
    }
    setCopied(true);
    navigator.clipboard.writeText(content);
  };

  return shape === "default" ? (
    <Button
      className="gap-3"
      variant={"outline"}
      onClick={() => handleCopy(content)}
    >
      <Copy />
      <p>{copied ? "Copied" : "Copy"}</p>
    </Button>
  ) : shape === "circle" ? (
    <button
      title="Copy short link"
      onClick={() => handleCopy(content)}
      className="disabled:cursor-not-allowed size-10 not-disabled:hover:bg-gray-600 dark:text-white/80 dark:bg-transparent dark:border-white/80 dark:not-disabled:hover:bg-white/80 dark:not-disabled:hover:text-black not-disabled:hover:text-white disabled:opacity-50 relative flex items-center justify-center text-gray-600 transition-colors bg-white border border-gray-600 rounded-full cursor-pointer"
    >
      <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full transition-opacity duration-300">
        <Copy
          size={18}
          className="transition-opacity duration-300"
          style={{
            opacity: copied ? 0 : 1,
          }}
        />
      </div>
      <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full transition-opacity duration-300">
        <Check
          size={18}
          className="transition-opacity duration-300"
          style={{
            opacity: copied ? 1 : 0,
          }}
        />
      </div>
    </button>
  ) : shape === "menu" ? (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => handleCopy(content)}
    >
      <Copy size={18} className="" />
      Copy short link
    </DropdownMenuItem>
  ) : (
    <div
      className="rounded-xs size-6 hover:bg-gray-50 dark:hover:bg-black/10 dark:text-purple-700 relative flex items-center justify-center cursor-pointer"
      title="Copy this link"
      onClick={() => handleCopy(content)}
    >
      <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full transition-opacity duration-300">
        <Copy
          size={16}
          className="transition-opacity duration-300"
          style={{
            opacity: copied ? 0 : 1,
          }}
        />
      </div>
      <div className="absolute top-0 left-0 z-0 flex items-center justify-center w-full h-full transition-opacity duration-300">
        <Check
          size={16}
          className="transition-opacity duration-300"
          style={{
            opacity: copied ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
};

export default CopyButton;
