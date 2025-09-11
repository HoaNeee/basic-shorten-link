/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import {
  ChartNoAxesCombined,
  Ellipsis,
  Eye,
  LogOut,
  Shuffle,
  Trash,
  Unlink2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { TLink } from "@/types/link.types";
import { isProduction } from "@/lib/contant";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import AlertDialogConfirm from "./alert-dialog-confirm";
import DialogEditLink from "./dialog-edit-link";
import CopyButton from "./copy-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { del } from "@/lib/request";
import { CheckedState } from "@radix-ui/react-checkbox";

interface Props {
  link: TLink;
  isStatistic?: boolean;
  onDelete?: (link: TLink) => void;
  selectedKey?: number[];
  setSelectedKey?: (val: number[]) => void;
}

const CardItemLink = (props: Props) => {
  const { link, isStatistic, onDelete, selectedKey, setSelectedKey } = props;

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [openDialogEditLink, setOpenDialogEditLink] = useState(false);
  const [typeEditLink, setTypeEditLink] = useState<
    "short-link" | "desnitation"
  >("desnitation");
  const [linkState, setLinkState] = useState<TLink>(link);
  const [loading, setLoading] = useState(false);

  const getShortLink = (link: TLink) => {
    return `${isProduction ? "https://" : "http://"}${link.domain}/${
      link.code
    }`;
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await del(`/link/${linkState.code}`);
      toast.success("Deleted success.");
      onDelete?.(linkState);
      setOpenDialogDelete(false);
      if (isStatistic) {
        window.location.href = "/user/dashboard";
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete link failure.");
    } finally {
      setLoading(false);
    }
  };

  const menuActions = [
    {
      icon: Unlink2,
      title: "Edit short link",
      className: "cursor-pointer",
      onClick: () => {
        console.log("Edit short link");
      },
      disabled: true,
    },
    {
      icon: ChartNoAxesCombined,
      title: "Statistics",
      className: "cursor-pointer",
      onClick: () => {
        window.location.href = `/user/link/${link.code}/stats`;
      },
      disabled: false,
    },
    {
      icon: Shuffle,
      title: "Edit desnitation",
      className: "cursor-pointer",
      onClick: () => {
        setOpenDialogEditLink(true);
        setTypeEditLink("desnitation");
      },
      disabled: false,
    },
  ];

  const handleChecked = (e: CheckedState) => {
    if (selectedKey) {
      const items = [...selectedKey];

      if (e) {
        items?.push(link.id);
      } else {
        const index = items.indexOf(link.id);
        if (index !== -1) {
          items.splice(index, 1);
        }
      }
      setSelectedKey?.(items);
    }
  };

  return (
    <div className="dark:bg-neutral-800 w-full bg-white rounded-sm shadow-xs">
      <div className="md:flex-row md:items-center dark:border-neutral-600 flex flex-col justify-between gap-4 px-4 py-3 border-b border-gray-100">
        <div className="md:max-w-7/10 flex items-center gap-4">
          {!isStatistic ? (
            <Checkbox
              checked={selectedKey?.includes(link.id)}
              onCheckedChange={handleChecked}
            />
          ) : (
            <div className="w-1" />
          )}
          <div className="flex items-center gap-4">
            <img src={linkState.url_icon} alt={link.url_title} className="" />
            <p className="text-ellipsis line-clamp-1 font-semibold">
              {linkState.url_title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p>{moment(linkState.created_at).format("yyyy-MM-DD")}</p>
          <a href={`/user/link/${linkState.code}/edit`}>
            <Button size={"sm"} variant={"outline"} className="">
              <LogOut strokeWidth={1} />
              <p className="font-normal">Detail</p>
            </Button>
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"outline"}>
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-46">
              <CopyButton shape="menu" content={getShortLink(link)} />
              {menuActions.map((menu, index) => (
                <DropdownMenuItem
                  disabled={menu.disabled}
                  key={index}
                  className={menu.className}
                  onClick={menu.onClick}
                >
                  <menu.icon size={18} className={menu.className} />
                  {menu.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDialogDelete(true)}
              >
                <Trash size={18} className="text-destructive" />
                <p className="text-destructive">Delete short link</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="px-8 py-3">
        <div className="dark:text-purple-600 flex items-center gap-3 font-semibold text-purple-800">
          {getShortLink(linkState)}
          <CopyButton shape="custom" content={getShortLink(linkState)} />
        </div>
        <div className="dark:text-gray-400 mt-2 mb-4 text-sm text-gray-500">
          {linkState.main_url}
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="md:flex items-center hidden gap-3">
            <CopyButton shape="circle" content={getShortLink(linkState)} />
            {menuActions.map((menu, index) => (
              <ButtonAction
                key={index}
                title={menu.title}
                disabled={menu.disabled}
                onClick={menu.onClick}
              >
                <menu.icon size={18} />
              </ButtonAction>
            ))}
            <ButtonAction
              title="Delete"
              className="size-10 hover:bg-red-600 hover:text-white dark:bg-transparent dark:hover:bg-red-600 flex items-center justify-center text-red-600 transition-colors bg-white border border-red-600 rounded-full cursor-pointer"
              onClick={() => setOpenDialogDelete(true)}
            >
              <Trash size={18} />
            </ButtonAction>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-50 dark:bg-green-800/30 text-green-600">
              {linkState.status}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{linkState.view}</span>{" "}
              <Eye size={18} />
            </div>
          </div>
        </div>
      </div>

      <AlertDialogConfirm
        open={openDialogDelete}
        setOpen={setOpenDialogDelete}
        onOk={handleDelete}
        loading={loading}
      />

      <DialogEditLink
        open={openDialogEditLink}
        setOpen={setOpenDialogEditLink}
        link={linkState}
        typeLink={typeEditLink}
        onChange={(val) => {
          setLinkState(val);
        }}
      />
    </div>
  );
};

const ButtonAction = ({
  children,
  className,
  title,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={` ${
        className
          ? className
          : "rounded-full disabled:cursor-not-allowed size-10 bg-white dark:bg-transparent text-gray-600 dark:text-white/80 dark:border-white/80 border-gray-600 border cursor-pointer not-disabled:hover:bg-gray-600 not-disabled:hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 dark:not-disabled:hover:bg-white/80 dark:not-disabled:hover:text-black"
      }`}
    >
      {children}
    </button>
  );
};

export default CardItemLink;
