/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import HeadTitle from "./head-title";
import {
	CalendarDays,
	ChartNoAxesCombined,
	Eye,
	Link,
	Pencil,
	Shuffle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TLink } from "@/types/link.types";
import moment from "moment";
import { isProduction } from "@/lib/contant";
import CopyButton from "./copy-button";
import DialogEditLink from "./dialog-edit-link";
import ChartLink from "./chart-link";

const EditLinkPage = ({ link }: { link: TLink }) => {
	const [openDialogEditLink, setOpenDialogEditLink] = useState(false);
	const [typeEditLink, setTypeEditLink] = useState<
		"desnitation" | "short-link" | "title"
	>("desnitation");

	const [linkState, setLinkState] = useState<TLink>(link);

	const getShortLink = (link: TLink) => {
		return `${isProduction ? "https://" : "http://"}${link.domain}/${
			link.code
		}`;
	};

	if (!link || typeof link === "string") {
		return <div className="p-6">{link}</div>;
	}

	return (
		<div className="p-6">
			<HeadTitle title="Edit" />
			<div className="flex flex-col gap-2 mt-4">
				<div className="md:flex-row md:items-center md:gap-0 dark:border-neutral-600 flex flex-col justify-between gap-4 py-8 border-b border-gray-200">
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<img
								src={linkState.url_icon}
								alt={linkState.url_title}
								className=""
							/>
							<h2 className="text-ellipsis line-clamp-1 text-xl font-semibold">
								{linkState.url_title}
							</h2>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<CalendarDays size={18} />
								<p>{moment(linkState.created_at).format("DD/MM/yyyy h:mm")}</p>
							</div>
							<div className="flex items-center gap-3">
								<Badge className="bg-green-50 text-green-600">
									{linkState.status}
								</Badge>
								<div className="flex items-center gap-2">
									<span className="font-semibold">{linkState.view}</span>{" "}
									<Eye size={18} />
								</div>
							</div>
						</div>
					</div>
					<div className="px-4">
						<Button
							className="gap-3"
							variant={"outline"}
							onClick={() => {
								setOpenDialogEditLink(true);
								setTypeEditLink("title");
							}}
						>
							<Pencil />
							Edit
						</Button>
					</div>
				</div>

				<div className="md:flex-row md:items-center md:gap-0 dark:border-neutral-600 flex flex-col justify-between gap-4 py-8 border-b border-gray-200">
					<div className="space-y-4">
						<div className="md:flex-row md:items-center flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<Link size={18} />
								<h2 className="text-ellipsis line-clamp-1 text-lg font-semibold">
									Short Link:
								</h2>
							</div>
							<p className="dark:text-purple-500 text-base font-semibold text-purple-700">
								{getShortLink(linkState)}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 px-4">
						<Button className="gap-3" variant={"outline"} disabled>
							<Pencil />
							Edit
						</Button>
						<CopyButton shape="default" content={getShortLink(linkState)} />
					</div>
				</div>

				<div className="md:flex-row md:items-center md:gap-0 dark:border-neutral-600 flex flex-col justify-between gap-4 py-8 border-b border-gray-200">
					<div className="space-y-4">
						<div className="md:flex-row md:items-center flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<Shuffle size={18} />
								<h2 className="text-ellipsis line-clamp-1 text-lg font-semibold">
									Destination URL:
								</h2>
							</div>
							<p className="dark:text-purple-500 text-base font-semibold text-purple-700">
								{linkState.main_url}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 px-4">
						<Button
							className="gap-3"
							variant={"outline"}
							onClick={() => {
								setOpenDialogEditLink(true);
								setTypeEditLink("desnitation");
							}}
						>
							<Pencil />
							Edit
						</Button>
						<CopyButton shape="default" content={linkState.main_url} />
					</div>
				</div>
			</div>
			<div className="mt-8">
				<div className="flex items-center gap-4">
					<ChartNoAxesCombined size={20} />
					<h2 className="text-xl font-bold">Statistics</h2>
				</div>
				<div className="mt-4 p-6">
					<ChartLink
						code={link.code}
						dateFrom={new Date(moment(new Date()).subtract(6, "day").format())}
						dateTo={new Date()}
						typeTime="day"
						className="md:h-100"
					/>
				</div>
			</div>
			<DialogEditLink
				link={linkState}
				typeLink={typeEditLink}
				open={openDialogEditLink}
				setOpen={setOpenDialogEditLink}
				onChange={(val) => {
					setLinkState(val);
				}}
			/>
		</div>
	);
};

export default EditLinkPage;
